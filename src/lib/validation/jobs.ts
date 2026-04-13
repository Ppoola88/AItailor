import { z } from "zod";

export const jobQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform((value) => Number(value))
    .optional(),
});

export type JobListingDTO = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyLink: string;
  postedAt: string;
  source: string;
};
