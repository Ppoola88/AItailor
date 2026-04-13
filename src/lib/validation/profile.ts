import { z } from "zod";

const MAX_PROFILE_SUMMARY_LENGTH = 2000;
const MAX_EXPERIENCE_BULLET_LENGTH = 2000;
const MAX_PROFILE_TEXT_LENGTH = 400;
const MAX_SKILL_LENGTH = 400;
const MAX_EXPERIENCE_COMPANY_LENGTH = 400;
const MAX_EXPERIENCE_ROLE_LENGTH = 400;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const nullableDateInput = z.union([isoDate, z.null()]).optional();
const optionalUrlInput = z
  .string()
  .trim()
  .max(255)
  .url()
  .or(z.literal(""))
  .nullish()
  .transform((value) => (value ? value : null));

function normalizeDateInput(value: unknown) {
  if (value === "" || value === undefined) {
    return null;
  }
  return value;
}

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1).max(MAX_EXPERIENCE_COMPANY_LENGTH),
    role: z.string().trim().min(1).max(MAX_EXPERIENCE_ROLE_LENGTH),
    startDate: isoDate,
    endDate: z.preprocess(normalizeDateInput, nullableDateInput),
    isCurrent: z.boolean().default(false),
    bulletPoints: z
      .array(z.string().trim().min(1).max(MAX_EXPERIENCE_BULLET_LENGTH))
      .max(15),
  })
  .refine(
    (value) => {
      if (value.isCurrent) {
        return true;
      }
      return Boolean(value.endDate);
    },
    {
      message: "End date is required when role is not current",
      path: ["endDate"],
    },
  );

export const educationSchema = z.object({
  institution: z.string().trim().min(1).max(MAX_PROFILE_TEXT_LENGTH),
  degree: z.string().trim().min(1).max(MAX_PROFILE_TEXT_LENGTH),
  fieldOfStudy: z.string().trim().max(MAX_PROFILE_TEXT_LENGTH).optional().nullable(),
  startDate: z.preprocess(normalizeDateInput, nullableDateInput),
  endDate: z.preprocess(normalizeDateInput, nullableDateInput),
});

export const profileUpsertSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  linkedIn: optionalUrlInput,
  professionalSummary: z
    .string()
    .trim()
    .max(MAX_PROFILE_SUMMARY_LENGTH)
    .optional()
    .nullable(),
  skills: z.array(z.string().trim().min(1).max(MAX_SKILL_LENGTH)).max(50),
  experiences: z.array(experienceSchema).max(20),
  educations: z.array(educationSchema).max(10),
});

export type ProfileUpsertInput = z.infer<typeof profileUpsertSchema>;

export type ProfileDTO = {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  professionalSummary: string;
  skills: string[];
  experiences: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    bulletPoints: string[];
  }[];
  educations: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }[];
};
