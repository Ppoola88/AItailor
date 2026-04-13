import { prisma } from "@/lib/prisma";
import { getOpenAIClient, getOpenAIModel } from "@/lib/ai/client";
import { buildResumeTailoringPrompt, buildSkillGapPrompt } from "@/lib/ai/prompts";
import { logger } from "@/lib/logger";
import { createSuggestions, extractRequiredKeywords, normalize as normalizeKeyword } from "@/lib/match-score-utils";
import {
  skillGapSchema,
  tailoredResumeSchema,
  type ResumeTailorRequest,
  type TailoredResume,
} from "@/lib/validation/resume-tailor";
import { getProfileForUser } from "@/services/profile-service";

const MAX_TAILORED_SUMMARY_LENGTH = 1200;

function extractJson(content: string) {
  const start = content.indexOf("{");
  const end = content.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response is not valid JSON");
  }
  return JSON.parse(content.slice(start, end + 1));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function validateExperienceIntegrity(profile: Awaited<ReturnType<typeof getProfileForUser>>, resume: TailoredResume) {
  if (!profile) {
    return false;
  }

  const allowedPairs = new Set(
    profile.experiences.map((item) => `${normalize(item.company)}::${normalize(item.role)}`),
  );

  return resume.experience.every((item) => {
    const pair = `${normalize(item.company)}::${normalize(item.role)}`;
    return allowedPairs.has(pair);
  });
}

function createFallbackSummary(profile: NonNullable<Awaited<ReturnType<typeof getProfileForUser>>>, input: ResumeTailorRequest) {
  const clamp = (value: string) => {
    if (value.length <= MAX_TAILORED_SUMMARY_LENGTH) {
      return value;
    }
    return `${value.slice(0, MAX_TAILORED_SUMMARY_LENGTH - 3).trimEnd()}...`;
  };

  const topSkills = profile.skills.slice(0, 6).join(", ");
  const title = input.jobTitle?.trim() || "target role";
  const company = input.company?.trim() ? ` at ${input.company.trim()}` : "";
  const profileSummary = profile.professionalSummary?.trim();

  if (profileSummary) {
    return clamp(
      `${profileSummary} Focused on aligning my background to the ${title}${company} opportunity with measurable business outcomes.`,
    );
  }

  return clamp(
    `Results-driven professional targeting ${title}${company}. Core strengths include ${topSkills || "software engineering, delivery, and collaboration"}, with proven experience delivering production impact.`,
  );
}

function createFallbackTailoredResume(
  profile: NonNullable<Awaited<ReturnType<typeof getProfileForUser>>>,
  input: ResumeTailorRequest,
) {
  const required = extractRequiredKeywords(input.jobDescription);
  const prioritizedSkills = [
    ...required.filter((item) => profile.skills.some((skill) => normalizeKeyword(skill) === normalizeKeyword(item))),
    ...profile.skills,
  ];

  const uniqueSkills = [...new Set(prioritizedSkills.map((item) => item.trim()).filter(Boolean))].slice(0, 20);

  const experience = profile.experiences.slice(0, 8).map((item) => ({
    company: item.company,
    role: item.role,
    startDate: item.startDate || "",
    endDate: item.endDate || "",
    isCurrent: item.isCurrent,
    bulletPoints: item.bulletPoints.slice(0, 8),
  }));

  const education = profile.educations.slice(0, 8).map((item) => ({
    institution: item.institution,
    degree: item.degree,
    fieldOfStudy: item.fieldOfStudy || "",
    startDate: item.startDate || "",
    endDate: item.endDate || "",
  }));

  const tailored: TailoredResume = {
    summary: createFallbackSummary(profile, input),
    skills: uniqueSkills,
    experience,
    education,
  };

  return tailoredResumeSchema.parse(tailored);
}

function createFallbackSkillGap(
  profile: NonNullable<Awaited<ReturnType<typeof getProfileForUser>>>,
  input: ResumeTailorRequest,
) {
  const required = extractRequiredKeywords(input.jobDescription);
  const profileSkills = new Set(profile.skills.map((item) => normalizeKeyword(item)));
  const missing = required.filter((item) => !profileSkills.has(normalizeKeyword(item)));

  return skillGapSchema.parse({
    missingSkills: missing,
    suggestions: createSuggestions(missing),
  });
}

async function requestJsonFromModel(prompt: string) {
  const client = getOpenAIClient();
  const model = getOpenAIModel();

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: "Return valid JSON only. Do not include markdown or prose.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty model response");
  }

  return extractJson(content);
}

export async function tailorResumeForJob(userId: string, input: ResumeTailorRequest) {
  let profile: Awaited<ReturnType<typeof getProfileForUser>> = null;

  try {
    profile = await getProfileForUser(userId);
  } catch (profileError) {
    logger.error("Failed to load profile for tailoring", {
      userId,
      error: profileError instanceof Error ? profileError.message : "Unknown profile load error",
    });

    return {
      ok: false as const,
      status: 503,
      error: "Profile data is temporarily unavailable. Please try again.",
    };
  }

  if (!profile) {
    return {
      ok: false as const,
      status: 404,
      error: "Profile not found",
    };
  }

  if (!profile.fullName || !profile.phone || profile.skills.length === 0 || profile.experiences.length === 0) {
    return {
      ok: false as const,
      status: 400,
      error: "Complete your profile with contact, skills, and experience before tailoring",
    };
  }

  try {
    let tailored: TailoredResume;
    let skillGap: ReturnType<typeof skillGapSchema.parse>;

    try {
      const resumeRaw = await requestJsonFromModel(
        buildResumeTailoringPrompt({
          profile,
          jobDescription: input.jobDescription,
          jobTitle: input.jobTitle,
          company: input.company,
        }),
      );
      tailored = tailoredResumeSchema.parse(resumeRaw);

      const integrityFromAi = validateExperienceIntegrity(profile, tailored);
      if (!integrityFromAi) {
        throw new Error("AI output failed factual integrity checks");
      }

      const gapRaw = await requestJsonFromModel(
        buildSkillGapPrompt({
          profile,
          jobDescription: input.jobDescription,
        }),
      );
      skillGap = skillGapSchema.parse(gapRaw);
    } catch (aiError) {
      logger.warn("AI tailoring failed; using local fallback", {
        userId,
        error: aiError instanceof Error ? aiError.message : "Unknown AI tailoring error",
      });

      tailored = createFallbackTailoredResume(profile, input);
      skillGap = createFallbackSkillGap(profile, input);
    }

    const integrityOk = validateExperienceIntegrity(profile, tailored);
    if (!integrityOk) {
      tailored = createFallbackTailoredResume(profile, input);
    }

    try {
      const saved = await prisma.tailoredResume.create({
        data: {
          userId,
          jobPostingId: null,
          summary: tailored.summary,
          skillsSnapshot: tailored.skills,
          experienceBody: tailored.experience,
          educationBody: tailored.education,
          missingSkills: skillGap.missingSkills,
          suggestions: skillGap.suggestions,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      return {
        ok: true as const,
        data: {
          resumeId: saved.id,
          createdAt: saved.createdAt,
          tailoredResume: tailored,
          skillGap,
          persisted: true,
        },
      };
    } catch (saveError) {
      logger.warn("Failed to persist tailored resume; returning preview", {
        userId,
        error: saveError instanceof Error ? saveError.message : "Unknown tailored resume save error",
      });

      return {
        ok: true as const,
        data: {
          resumeId: `preview-${Date.now()}`,
          createdAt: new Date(),
          tailoredResume: tailored,
          skillGap,
          persisted: false,
        },
      };
    }
  } catch (error) {
    logger.error("Resume tailoring failed", {
      userId,
      error: error instanceof Error ? error.message : "Unknown tailoring error",
    });

    // Last-resort recovery path so users still get a generated preview.
    if (profile) {
      try {
        const tailored = createFallbackTailoredResume(profile, input);
        const skillGap = createFallbackSkillGap(profile, input);

        return {
          ok: true as const,
          data: {
            resumeId: `preview-${Date.now()}`,
            createdAt: new Date(),
            tailoredResume: tailored,
            skillGap,
            persisted: false,
          },
        };
      } catch (fallbackError) {
        logger.error("Fallback resume tailoring also failed", {
          userId,
          error: fallbackError instanceof Error ? fallbackError.message : "Unknown fallback tailoring error",
        });
      }
    }

    return {
      ok: false as const,
      status: 500,
      error: "Resume tailoring failed due to an internal error",
    };
  }
}
