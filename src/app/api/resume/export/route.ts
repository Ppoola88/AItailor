import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { resumeExportRequestSchema } from "@/lib/validation/resume-tailor";
import { buildResumePdf } from "@/services/resume-export-service";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await rateLimit(`resume-export:${session.user.id}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = new URL(request.url);
  const parsed = resumeExportRequestSchema.safeParse({
    resumeId: url.searchParams.get("resumeId") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid resumeId" }, { status: 400 });
  }

  const pdfBuffer = await buildResumePdf(session.user.id, parsed.data.resumeId);

  if (!pdfBuffer) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="ai-job-tailor-resume-${parsed.data.resumeId}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
