import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { signupSchema } from "@/lib/validation/auth";
import { createUserAccount } from "@/services/auth-service";

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const key = `signup:${forwardedFor.split(",")[0].trim()}`;
  const rl = await rateLimit(key, 10, 60_000);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many signup attempts. Please wait and try again." },
      { status: 429 },
    );
  }

  try {
    const payload = await request.json().catch(() => null);
    if (!payload) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const parsed = signupSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid signup payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await createUserAccount(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json({ user: result.user }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown signup error";

    if (errorMessage.includes("P1000") || errorMessage.toLowerCase().includes("authentication failed")) {
      logger.error("Signup API database authentication failed", { error: errorMessage });
      return NextResponse.json(
        { error: "Database authentication failed. Please verify DATABASE_URL credentials." },
        { status: 503 },
      );
    }

    logger.error("Signup API failed", {
      error: errorMessage,
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
