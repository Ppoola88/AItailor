import { z } from "zod";

const MAX_TEXT_LENGTH = 400;
const MAX_BULLET_LENGTH = 2000;
const MAX_SUGGESTION_LENGTH = 1200;

const dateLike = z
  .string()
  .regex(/^$|^\d{4}-\d{2}-\d{2}$/);

const tailoredExperienceSchema = z.object({
  company: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  role: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  startDate: dateLike,
  endDate: dateLike,
  isCurrent: z.boolean(),
  bulletPoints: z.array(z.string().trim().min(1).max(MAX_BULLET_LENGTH)).max(10),
});

const tailoredEducationSchema = z.object({
  institution: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  degree: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  fieldOfStudy: z.string().trim().max(MAX_TEXT_LENGTH),
  startDate: dateLike,
  endDate: dateLike,
});

export const resumeTailorRequestSchema = z.object({
  jobTitle: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
  company: z.string().trim().max(MAX_TEXT_LENGTH).optional(),
  jobDescription: z.string().trim().min(40).max(8000),
  jobPostingId: z.string().trim().max(200).optional(),
});

export const resumeExportRequestSchema = z.object({
  resumeId: z.string().trim().min(1).max(100),
});

export const tailoredResumeSchema = z.object({
  summary: z.string().trim().min(40).max(1200),
  skills: z.array(z.string().trim().min(1).max(MAX_TEXT_LENGTH)).max(60),
  experience: z.array(tailoredExperienceSchema).max(30),
  education: z.array(tailoredEducationSchema).max(20),
});

export const skillGapSchema = z.object({
  missingSkills: z.array(z.string().trim().min(1).max(MAX_TEXT_LENGTH)).max(30),
  suggestions: z.array(z.string().trim().min(1).max(MAX_SUGGESTION_LENGTH)).max(20),
});

export type ResumeTailorRequest = z.infer<typeof resumeTailorRequestSchema>;
export type TailoredResume = z.infer<typeof tailoredResumeSchema>;
export type SkillGapResult = z.infer<typeof skillGapSchema>;
export type ResumeExportRequest = z.infer<typeof resumeExportRequestSchema>;
