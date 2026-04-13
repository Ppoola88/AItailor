import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { resumeTailorRequestSchema } from "@/lib/validation/resume-tailor";
import { tailorResumeForJob } from "@/services/resume-tailor-service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit(`resume-tailor:${session.user.id}`, 20, 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const payload = await request.json().catch(() => null);
    const parsed = resumeTailorRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await tailorResumeForJob(session.user.id, parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    logger.error("Resume tailor API failed", {
      error: error instanceof Error ? error.message : "Unknown resume tailor API error",
    });

    return NextResponse.json({ error: "Resume tailor service unavailable" }, { status: 500 });
  }
}
