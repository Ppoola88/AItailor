import { z } from "zod";

const MAX_TEXT_LENGTH = 400;
const MIN_JOB_DESCRIPTION_LENGTH = 40;

export const matchScoreRequestSchema = z.object({
  jobTitle: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
  company: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
  jobDescription: z.string().trim().min(MIN_JOB_DESCRIPTION_LENGTH).max(8000),
});

export const matchScoreResultSchema = z.object({
  matchPercentage: z.number().min(0).max(100),
  requiredKeywords: z.array(z.string()),
  matchedKeywords: z.array(z.string()),
  missingSkills: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type MatchScoreRequest = z.infer<typeof matchScoreRequestSchema>;
export type MatchScoreResult = z.infer<typeof matchScoreResultSchema>;
