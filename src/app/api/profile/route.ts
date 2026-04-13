import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { profileUpsertSchema } from "@/lib/validation/profile";
import { deleteProfileForUser, getProfileForUser, upsertProfileForUser } from "@/services/profile-service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await getProfileForUser(session.user.id);
  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ profile });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`profile-put:${session.user.id}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many profile update requests. Try again shortly." },
      { status: 429 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = profileUpsertSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const result = await upsertProfileForUser(session.user.id, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, issues: result.issues }, { status: result.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Profile update API failed", {
      error: error instanceof Error ? error.message : "Unknown profile API error",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteProfileForUser(session.user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Profile delete API failed", {
      error: error instanceof Error ? error.message : "Unknown profile delete error",
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
