"use client";

import { FormEvent, useState } from "react";

type MatchScoreResponse = {
  matchPercentage: number;
  requiredKeywords: string[];
  matchedKeywords: string[];
  missingSkills: string[];
  suggestions: string[];
};

type MatchScoreErrorResponse = {
  error?: string;
  issues?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
};

type MatchScoreFormProps = {
  initialJobTitle: string;
  initialCompany: string;
  initialDescription: string;
};

export function MatchScoreForm({ initialJobTitle, initialCompany, initialDescription }: MatchScoreFormProps) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobDescription, setJobDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MatchScoreResponse | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/match-score", {
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
      const body = (await response.json().catch(() => null)) as MatchScoreErrorResponse | null;
      const formError = body?.issues?.formErrors?.[0];
      const fieldError = body?.issues?.fieldErrors
        ? Object.values(body.issues.fieldErrors).flat().find(Boolean)
        : null;

      setError(formError ?? fieldError ?? body?.error ?? "Failed to calculate match score.");
      return;
    }

    const body = (await response.json()) as MatchScoreResponse;
    setResult(body);
  }

  const scoreColor =
    (result?.matchPercentage ?? 0) >= 75
      ? "text-emerald-700"
      : (result?.matchPercentage ?? 0) >= 50
        ? "text-amber-700"
        : "text-red-700";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Job Description Input</h2>
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
          {loading ? "Calculating..." : "Calculate match score"}
        </button>
      </form>

      <section className="space-y-4 rounded-lg border border-zinc-200 p-5">
        <h2 className="text-xl font-semibold">Match Analysis</h2>

        {!result ? <p className="text-sm text-zinc-600">Run the analysis to view score and gap insights.</p> : null}

        {result ? (
          <div className="space-y-4 text-sm text-zinc-800">
            <div className="rounded-md bg-zinc-100 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">Match score</p>
              <p className={`mt-1 text-3xl font-bold ${scoreColor}`}>{result.matchPercentage}%</p>
            </div>

            <div>
              <h3 className="font-semibold">Required Keywords</h3>
              <p className="mt-1">{result.requiredKeywords.join(", ") || "No keywords extracted"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Matched Keywords</h3>
              <p className="mt-1">{result.matchedKeywords.join(", ") || "No keyword matches yet"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Missing Skills</h3>
              <p className="mt-1">{result.missingSkills.join(", ") || "No major gaps detected"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Suggestions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {result.suggestions.map((item, idx) => (
                  <li key={`sg-${idx}`}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
