"use client";

import { FormEvent, useState } from "react";

type TailorResult = {
  resumeId: string;
  createdAt: string;
  persisted?: boolean;
  tailoredResume: {
    summary: string;
    skills: string[];
    experience: {
      company: string;
      role: string;
      startDate: string;
      endDate: string;
      isCurrent: boolean;
      bulletPoints: string[];
    }[];
    education: {
      institution: string;
      degree: string;
      fieldOfStudy: string;
      startDate: string;
      endDate: string;
    }[];
  };
  skillGap: {
    missingSkills: string[];
    suggestions: string[];
  };
};

type TailorErrorResponse = {
  error?: string;
  issues?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

type TailorFormProps = {
  initialJobTitle: string;
  initialCompany: string;
  initialDescription: string;
};

export function TailorForm({ initialJobTitle, initialCompany, initialDescription }: TailorFormProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResult | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/resume/tailor", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        jobTitle,
        company,
        jobDescription,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      const fallbackText = await response.text().catch(() => "");
      const body = (() => {
        try {
          return JSON.parse(fallbackText) as TailorErrorResponse;
        } catch {
          return null;
        }
      })();
      const formError = body?.issues?.formErrors?.[0];
      const fieldError = body?.issues?.fieldErrors
        ? Object.values(body.issues.fieldErrors).flat().find(Boolean)
        : null;

      const fallbackMessage = fallbackText.trim().length > 0 ? fallbackText : null;
      setError(formError ?? fieldError ?? body?.error ?? fallbackMessage ?? "Tailoring failed.");
      return;
    }

    const body = (await response.json()) as TailorResult;
    setResult(body);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Job Input</h2>
        <div>
          <label className="mb-1 block text-sm font-medium">Job title</label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Company</label>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Job description</label>
          <textarea
            rows={14}
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-500">Minimum 40 characters.</p>
        </div>

        {error ? (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating..." : "Generate tailored resume"}
        </button>
      </form>

      <section className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">AI Output</h2>
        {!result ? <p className="text-sm text-zinc-600">Generate a resume to see output here.</p> : null}

        {result ? (
          <div className="space-y-4 text-sm text-zinc-800">
            <div>
              <h3 className="font-semibold">Summary</h3>
              <p className="mt-1 whitespace-pre-wrap">{result.tailoredResume.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold">Skills</h3>
              <p className="mt-1">{result.tailoredResume.skills.join(", ")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Experience</h3>
              <div className="mt-2 space-y-3">
                {result.tailoredResume.experience.map((item, idx) => (
                  <div key={`exp-${idx}`} className="rounded-md border border-zinc-200 p-3">
                    <p className="font-medium">
                      {item.role} at {item.company}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {item.startDate} - {item.isCurrent ? "Present" : item.endDate || ""}
                    </p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {item.bulletPoints.map((bullet, bulletIdx) => (
                        <li key={`b-${bulletIdx}`}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Education</h3>
              <div className="mt-2 space-y-2">
                {result.tailoredResume.education.map((item, idx) => (
                  <p key={`edu-${idx}`}>
                    {item.degree} {item.fieldOfStudy ? `(${item.fieldOfStudy})` : ""} - {item.institution}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Skill Gaps</h3>
              <p className="mt-1">{result.skillGap.missingSkills.join(", ") || "No major gaps detected"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Improvement Suggestions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.skillGap.suggestions.map((item, idx) => (
                  <li key={`s-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              {result.persisted === false ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  Preview generated successfully. Save/export is temporarily unavailable right now.
                </p>
              ) : (
                <a
                  href={`/api/resume/export?resumeId=${encodeURIComponent(result.resumeId)}`}
                  className="inline-flex rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                >
                  Download PDF Resume
                </a>
              )}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
