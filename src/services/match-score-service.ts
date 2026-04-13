import { logger } from "@/lib/logger";
import {
  buildCandidateKeywordSet,
  createSuggestions,
  extractRequiredKeywords,
} from "@/lib/match-score-utils";
import {
  type MatchScoreRequest,
  matchScoreResultSchema,
  type MatchScoreResult,
} from "@/lib/validation/match-score";
import { getProfileForUser } from "@/services/profile-service";

export async function generateMatchScore(userId: string, input: MatchScoreRequest) {
  const profile = await getProfileForUser(userId);

  if (!profile) {
    return {
      ok: false as const,
      status: 404,
      error: "Profile not found",
    };
  }

  if (profile.skills.length === 0 || profile.experiences.length === 0) {
    return {
      ok: false as const,
      status: 400,
      error: "Complete your profile with skills and experience first",
    };
  }

  try {
    const requiredKeywords = extractRequiredKeywords(input.jobDescription);
    const candidateKeywords = buildCandidateKeywordSet(profile);

    const matchedKeywords = requiredKeywords.filter((keyword) => {
      return candidateKeywords.has(keyword);
    });

    const missingSkills = requiredKeywords.filter((keyword) => !candidateKeywords.has(keyword));

    const denominator = Math.max(requiredKeywords.length, 1);
    const rawScore = (matchedKeywords.length / denominator) * 100;
    const matchPercentage = Math.round(rawScore);

    const result: MatchScoreResult = {
      matchPercentage,
      requiredKeywords,
      matchedKeywords,
      missingSkills,
      suggestions: createSuggestions(missingSkills),
    };

    const validated = matchScoreResultSchema.parse(result);
    return {
      ok: true as const,
      data: validated,
    };
  } catch (error) {
    logger.error("Match score generation failed", {
      userId,
      error: error instanceof Error ? error.message : "Unknown match score error",
    });

    return {
      ok: false as const,
      status: 500,
      error: "Failed to generate match score",
    };
  }
}
