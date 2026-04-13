import type { ProfileDTO } from "@/lib/validation/profile";

function profileToCompactText(profile: ProfileDTO) {
  return JSON.stringify(profile, null, 2);
}

export function buildResumeTailoringPrompt(input: {
  profile: ProfileDTO;
  jobTitle?: string;
  company?: string;
  jobDescription: string;
}) {
  const roleLine = [input.jobTitle, input.company].filter(Boolean).join(" at ");

  return `
You are an expert resume writer specializing in ATS optimization.

Objective:
Rewrite the candidate's resume for the target job while preserving factual accuracy.

Hard constraints:
- Do NOT fabricate companies, roles, dates, certifications, or education.
- Do NOT add skills that are not evidenced by the provided profile.
- You may improve phrasing, reorder content, and sharpen impact.
- Use concise, professional language and strong action verbs.
- Keep formatting ATS-friendly and machine-readable.

Target role context:
${roleLine || "Not provided"}

Job description:
${input.jobDescription}

Candidate profile (source of truth):
${profileToCompactText(input.profile)}

Return strict JSON only in this exact shape:
{
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "company": "string",
      "role": "string",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string",
      "isCurrent": true,
      "bulletPoints": ["string"]
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "startDate": "YYYY-MM-DD or empty string",
      "endDate": "YYYY-MM-DD or empty string"
    }
  ]
}
`;
}

export function buildSkillGapPrompt(input: {
  profile: ProfileDTO;
  jobDescription: string;
}) {
  return `
You are an AI career coach.

Task:
Analyze the candidate profile against the job description and identify realistic skill gaps.

Rules:
- Use only evidence from the provided profile and job description.
- Do not assume unlisted experience or skills.
- Suggest practical learning steps focused on shortlist readiness.

Job description:
${input.jobDescription}

Candidate profile:
${profileToCompactText(input.profile)}

Return strict JSON only in this exact shape:
{
  "missingSkills": ["string"],
  "suggestions": ["string"]
}
`;
}
