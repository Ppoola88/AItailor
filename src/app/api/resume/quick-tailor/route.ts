import { NextResponse } from "next/server";

import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";

const PROVIDERS = ["openai", "gemini", "claude", "xai"] as const;
type Provider = (typeof PROVIDERS)[number];

type QuickTailorPayload = {
  provider: Provider;
  apiKey: string;
  model?: string;
  resumeText: string;
  jobDescription: string;
};

function isProvider(value: string): value is Provider {
  return (PROVIDERS as readonly string[]).includes(value);
}

function parsePayload(input: unknown): { ok: true; data: QuickTailorPayload } | { ok: false; error: string } {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Invalid request payload" };
  }

  const body = input as Record<string, unknown>;
  const provider = typeof body.provider === "string" ? body.provider.trim().toLowerCase() : "";
  const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
  const model = typeof body.model === "string" ? body.model.trim() : undefined;
  const resumeText = typeof body.resumeText === "string" ? body.resumeText.trim() : "";
  const jobDescription = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";

  if (!isProvider(provider)) {
    return { ok: false, error: "Unsupported provider" };
  }

  if (apiKey.length < 10) {
    return { ok: false, error: "API key looks invalid" };
  }

  if (resumeText.length < 80) {
    return { ok: false, error: "Paste your full resume (minimum 80 characters)" };
  }

  if (jobDescription.length < 80) {
    return { ok: false, error: "Paste the job description (minimum 80 characters)" };
  }

  return {
    ok: true,
    data: {
      provider,
      apiKey,
      model,
      resumeText,
      jobDescription,
    },
  };
}

function defaultModel(provider: Provider) {
  if (provider === "openai") return "gpt-4.1-mini";
  if (provider === "gemini") return "gemini-2.0-flash";
  if (provider === "claude") return "claude-3-5-sonnet-20241022";
  return "grok-3-mini";
}

function buildPrompt(resumeText: string, jobDescription: string) {
  return [
    "You are an expert ATS resume writer.",
    "Compare the candidate resume against the target job description.",
    "Return ONLY plain text in this format:",
    "",
    "# Tailored Resume",
    "<rewrite the resume content so it aligns with the role, keeps facts truthful, adds ATS keywords naturally, and improves impact bullets>",
    "",
    "# Why This Version Is Stronger",
    "- <bullet 1>",
    "- <bullet 2>",
    "- <bullet 3>",
    "",
    "# Missing Keywords To Add",
    "- <keyword 1>",
    "- <keyword 2>",
    "",
    "Constraints:",
    "- Do not invent employers, dates, degrees, or certifications.",
    "- Keep output concise but complete.",
    "- Prioritize measurable impact and role-relevant terminology.",
    "",
    "Candidate Resume:",
    resumeText,
    "",
    "Target Job Description:",
    jobDescription,
  ].join("\n");
}

async function callOpenAICompatible(provider: Provider, apiKey: string, model: string, prompt: string) {
  const baseUrl =
    provider === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : provider === "gemini"
        ? "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        : "https://api.x.ai/v1/chat/completions";

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You tailor resumes for ATS and recruiter screening.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Provider request failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const body = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const text = body.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("Provider returned empty response");
  }

  return text;
}

async function callGemini(apiKey: string, model: string, prompt: string) {
  // Support both Google AI Studio style keys (AIza...) and bearer-token style keys.
  const useQueryKey = apiKey.startsWith("AIza");
  const endpoint = useQueryKey
    ? `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
    : "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: useQueryKey
      ? {
          "Content-Type": "application/json",
        }
      : {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
    body: useQueryKey
      ? JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
          },
        })
      : JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            {
              role: "system",
              content: "You tailor resumes for ATS and recruiter screening.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Provider request failed (${response.status}): ${errorBody.slice(0, 300)}`);
  }

  if (!useQueryKey) {
    const body = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = body.choices?.[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("Provider returned empty response");
    }
    return text;
  }

  const body = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const text =
    body.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("\n")
      .trim() ?? "";

  if (!text) {
    throw new Error("Provider returned empty response");
  }

  return text;
}

async function callClaude(apiKey: string, model: string, prompt: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      temperature: 0.2,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Provider request failed (${response.status}): ${errorBody.slice(0, 200)}`);
  }

  const body = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };

  const text =
    body.content
      ?.filter((item) => item.type === "text" && typeof item.text === "string")
      .map((item) => item.text?.trim() ?? "")
      .join("\n")
      .trim() ?? "";

  if (!text) {
    throw new Error("Provider returned empty response");
  }

  return text;
}

function clientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const parsedBody = await request.json().catch(() => null);
    const parsed = parsePayload(parsedBody);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const ip = clientIp(request);
    const limit = await rateLimit(`quick-tailor:${ip}`, 8, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
    }

    const model = parsed.data.model && parsed.data.model.length > 0 ? parsed.data.model : defaultModel(parsed.data.provider);
    const prompt = buildPrompt(parsed.data.resumeText, parsed.data.jobDescription);

    const tailoredText =
      parsed.data.provider === "claude"
        ? await callClaude(parsed.data.apiKey, model, prompt)
        : parsed.data.provider === "gemini"
          ? await callGemini(parsed.data.apiKey, model, prompt)
          : await callOpenAICompatible(parsed.data.provider, parsed.data.apiKey, model, prompt);

    return NextResponse.json({
      provider: parsed.data.provider,
      model,
      tailoredText,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown quick-tailor error";
    logger.error("Quick tailor API failed", {
      error: errorMessage,
    });

    return NextResponse.json(
      {
        error: "Unable to generate tailored resume. Please verify API key/model and try again.",
        details: errorMessage.slice(0, 400),
      },
      { status: 502 },
    );
  }
}
