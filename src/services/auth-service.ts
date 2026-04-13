import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/lib/validation/auth";

export async function createUserAccount(input: SignupInput) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid signup data" };
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (existing) {
    return { ok: false as const, error: "Email already registered" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: parsed.data.name,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return { ok: true as const, user };
}

export async function verifyCredentials(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return null;
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user || !user.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
