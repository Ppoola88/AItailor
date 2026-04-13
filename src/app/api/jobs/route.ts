import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { jobQuerySchema } from "@/lib/validation/jobs";
import { aggregateJobs } from "@/services/jobs-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`jobs-get:${session.user.id}`, 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const url = new URL(request.url);
    const parsed = jobQuerySchema.safeParse({
      q: url.searchParams.get("q") ?? undefined,
      location: url.searchParams.get("location") ?? undefined,
      limit: url.searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await aggregateJobs(parsed.data);

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Jobs aggregation API failed", {
      error: error instanceof Error ? error.message : "Unknown jobs API error",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
