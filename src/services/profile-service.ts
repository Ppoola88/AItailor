import { Prisma } from "@prisma/client";

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { type ProfileDTO, type ProfileUpsertInput, profileUpsertSchema } from "@/lib/validation/profile";

function toDateOrNull(value?: string | null) {
  if (!value) {
    return null;
  }
  return new Date(`${value}T00:00:00.000Z`);
}

function toDateString(value?: Date | null) {
  if (!value) {
    return "";
  }
  return value.toISOString().slice(0, 10);
}

export async function getProfileForUser(userId: string): Promise<ProfileDTO | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: {
        include: {
          skills: true,
          experiences: { orderBy: { startDate: "desc" } },
          educations: { orderBy: { endDate: "desc" } },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  if (!user.profile) {
    return {
      fullName: user.name ?? "",
      email: user.email,
      phone: "",
      linkedIn: "",
      professionalSummary: "",
      skills: [],
      experiences: [],
      educations: [],
    };
  }

  return {
    fullName: user.profile.fullName,
    email: user.email,
    phone: user.profile.phone,
    linkedIn: user.profile.linkedIn ?? "",
    professionalSummary: user.profile.professionalSummary ?? "",
    skills: user.profile.skills.map((skill) => skill.name),
    experiences: user.profile.experiences.map((experience) => ({
      company: experience.company,
      role: experience.role,
      startDate: toDateString(experience.startDate),
      endDate: toDateString(experience.endDate),
      isCurrent: experience.isCurrent,
      bulletPoints: Array.isArray(experience.bulletPoints)
        ? experience.bulletPoints.map((item) => String(item))
        : [],
    })),
    educations: user.profile.educations.map((education) => ({
      institution: education.institution,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy ?? "",
      startDate: toDateString(education.startDate),
      endDate: toDateString(education.endDate),
    })),
  };
}

export async function upsertProfileForUser(userId: string, input: ProfileUpsertInput) {
  const parsed = profileUpsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      status: 400,
      error: "Invalid profile payload",
      issues: parsed.error.flatten(),
    };
  }

  const payload = parsed.data;
  const normalizedEmail = payload.email.toLowerCase();
  const normalizedSkills = [...new Set(payload.skills.map((item) => item.trim()).filter(Boolean))];

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          email: normalizedEmail,
          name: payload.fullName,
        },
      });

      const profile = await tx.profile.upsert({
        where: { userId },
        create: {
          userId,
          fullName: payload.fullName,
          phone: payload.phone,
          linkedIn: payload.linkedIn || null,
          professionalSummary: payload.professionalSummary || null,
        },
        update: {
          fullName: payload.fullName,
          phone: payload.phone,
          linkedIn: payload.linkedIn || null,
          professionalSummary: payload.professionalSummary || null,
        },
      });

      await tx.skill.deleteMany({ where: { profileId: profile.id } });
      if (normalizedSkills.length > 0) {
        await tx.skill.createMany({
          data: normalizedSkills.map((name) => ({
            profileId: profile.id,
            name,
          })),
        });
      }

      await tx.workExperience.deleteMany({ where: { profileId: profile.id } });
      if (payload.experiences.length > 0) {
        await tx.workExperience.createMany({
          data: payload.experiences.map((item) => ({
            profileId: profile.id,
            company: item.company,
            role: item.role,
            startDate: new Date(`${item.startDate}T00:00:00.000Z`),
            endDate: item.isCurrent ? null : toDateOrNull(item.endDate),
            isCurrent: item.isCurrent,
            bulletPoints: item.bulletPoints,
          })),
        });
      }

      await tx.education.deleteMany({ where: { profileId: profile.id } });
      if (payload.educations.length > 0) {
        await tx.education.createMany({
          data: payload.educations.map((item) => ({
            profileId: profile.id,
            institution: item.institution,
            degree: item.degree,
            fieldOfStudy: item.fieldOfStudy || null,
            startDate: toDateOrNull(item.startDate),
            endDate: toDateOrNull(item.endDate),
          })),
        });
      }
    });

    return { ok: true as const };
  } catch (error) {
    logger.error("Failed to upsert profile", {
      error: error instanceof Error ? error.message : "Unknown profile upsert error",
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        ok: false as const,
        status: 409,
        error: "Email is already used by another account",
      };
    }

    return {
      ok: false as const,
      status: 500,
      error: "Internal server error",
    };
  }
}

export async function deleteProfileForUser(userId: string) {
  await prisma.profile.deleteMany({ where: { userId } });
}
