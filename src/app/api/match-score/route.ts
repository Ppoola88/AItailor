import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { matchScoreRequestSchema } from "@/lib/validation/match-score";
import { generateMatchScore } from "@/services/match-score-service";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`match-score:${session.user.id}`, 40, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = matchScoreRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await generateMatchScore(session.user.id, parsed.data);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result.data);
}
