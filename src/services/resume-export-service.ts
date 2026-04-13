import { PDFDocument, PDFPage, StandardFonts, rgb } from "pdf-lib";

import { prisma } from "@/lib/prisma";

function drawWrappedText(options: {
  page: PDFPage;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  size: number;
  color?: { r: number; g: number; b: number };
  lineHeight?: number;
}) {
  const { page, text, x, maxWidth, font, size } = options;
  const color = options.color ?? { r: 0, g: 0, b: 0 };
  const lineHeight = options.lineHeight ?? size * 1.35;
  const words = text.split(/\s+/).filter(Boolean);

  let currentLine = "";
  let cursorY = options.y;

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);

    if (width > maxWidth && currentLine) {
      page.drawText(currentLine, {
        x,
        y: cursorY,
        size,
        font,
        color: rgb(color.r, color.g, color.b),
      });
      cursorY -= lineHeight;
      currentLine = word;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    page.drawText(currentLine, {
      x,
      y: cursorY,
      size,
      font,
      color: rgb(color.r, color.g, color.b),
    });
    cursorY -= lineHeight;
  }

  return cursorY;
}

function ensureStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }
  return value.map((item) => String(item));
}

type ExperienceItem = {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bulletPoints: string[];
};

type EducationItem = {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
};

function normalizeExperience(value: unknown): ExperienceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      company: String(row.company ?? ""),
      role: String(row.role ?? ""),
      startDate: String(row.startDate ?? ""),
      endDate: String(row.endDate ?? ""),
      isCurrent: Boolean(row.isCurrent ?? false),
      bulletPoints: ensureStringArray(row.bulletPoints),
    };
  });
}

function normalizeEducation(value: unknown): EducationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      institution: String(row.institution ?? ""),
      degree: String(row.degree ?? ""),
      fieldOfStudy: String(row.fieldOfStudy ?? ""),
      startDate: String(row.startDate ?? ""),
      endDate: String(row.endDate ?? ""),
    };
  });
}

export async function buildResumePdf(userId: string, resumeId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      resumes: {
        where: { id: resumeId },
        take: 1,
      },
    },
  });

  if (!user || user.resumes.length === 0) {
    return null;
  }

  const resume = user.resumes[0];
  const skills = ensureStringArray(resume.skillsSnapshot);
  const experience = normalizeExperience(resume.experienceBody);
  const education = normalizeEducation(resume.educationBody);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const marginX = 48;
  const maxWidth = 612 - marginX * 2;
  let y = 750;

  y = drawWrappedText({
    page,
    text: user.profile?.fullName || user.name || "Candidate",
    x: marginX,
    y,
    maxWidth,
    font: bold,
    size: 24,
  });

  const contactLine = [user.email, user.profile?.phone, user.profile?.linkedIn].filter(Boolean).join(" | ");
  y = drawWrappedText({
    page,
    text: contactLine,
    x: marginX,
    y,
    maxWidth,
    font: regular,
    size: 10,
    color: { r: 0.3, g: 0.3, b: 0.3 },
  });

  y -= 8;

  page.drawLine({
    start: { x: marginX, y },
    end: { x: marginX + maxWidth, y },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
  });

  y -= 22;

  y = drawWrappedText({
    page,
    text: "SUMMARY",
    x: marginX,
    y,
    maxWidth,
    font: bold,
    size: 12,
  });

  y = drawWrappedText({
    page,
    text: resume.summary,
    x: marginX,
    y,
    maxWidth,
    font: regular,
    size: 10.5,
  });

  y -= 8;

  y = drawWrappedText({
    page,
    text: "SKILLS",
    x: marginX,
    y,
    maxWidth,
    font: bold,
    size: 12,
  });

  y = drawWrappedText({
    page,
    text: skills.join(", "),
    x: marginX,
    y,
    maxWidth,
    font: regular,
    size: 10.5,
  });

  y -= 8;

  y = drawWrappedText({
    page,
    text: "EXPERIENCE",
    x: marginX,
    y,
    maxWidth,
    font: bold,
    size: 12,
  });

  for (const item of experience) {
    y = drawWrappedText({
      page,
      text: `${item.role} - ${item.company}`,
      x: marginX,
      y,
      maxWidth,
      font: bold,
      size: 10.5,
    });

    y = drawWrappedText({
      page,
      text: `${item.startDate || ""} - ${item.isCurrent ? "Present" : item.endDate || ""}`,
      x: marginX,
      y,
      maxWidth,
      font: regular,
      size: 9.5,
      color: { r: 0.35, g: 0.35, b: 0.35 },
    });

    for (const bullet of item.bulletPoints) {
      y = drawWrappedText({
        page,
        text: `- ${bullet}`,
        x: marginX + 8,
        y,
        maxWidth: maxWidth - 8,
        font: regular,
        size: 10,
      });
    }

    y -= 5;
  }

  y -= 5;

  y = drawWrappedText({
    page,
    text: "EDUCATION",
    x: marginX,
    y,
    maxWidth,
    font: bold,
    size: 12,
  });

  for (const item of education) {
    const degreeLine = item.fieldOfStudy
      ? `${item.degree} (${item.fieldOfStudy}) - ${item.institution}`
      : `${item.degree} - ${item.institution}`;

    y = drawWrappedText({
      page,
      text: degreeLine,
      x: marginX,
      y,
      maxWidth,
      font: regular,
      size: 10.5,
    });

    if (item.startDate || item.endDate) {
      y = drawWrappedText({
        page,
        text: `${item.startDate || ""} - ${item.endDate || ""}`,
        x: marginX,
        y,
        maxWidth,
        font: regular,
        size: 9.5,
        color: { r: 0.35, g: 0.35, b: 0.35 },
      });
    }

    y -= 4;
  }

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}
