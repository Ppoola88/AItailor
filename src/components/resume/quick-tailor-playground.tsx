"use client";

import { FormEvent, useMemo, useState } from "react";

type Provider = "openai" | "gemini" | "claude" | "xai";

type TailorResponse = {
  provider: Provider;
  model: string;
  tailoredText: string;
  generatedAt: string;
};

type TailorErrorResponse = {
  error?: string;
  details?: string;
};

const providerDefaults: Record<Provider, { label: string; model: string; keyHint: string }> = {
  openai: {
    label: "OpenAI",
    model: "gpt-4.1-mini",
    keyHint: "sk-...",
  },
  gemini: {
    label: "Google Gemini",
    model: "gemini-2.0-flash",
    keyHint: "AIza...",
  },
  claude: {
    label: "Anthropic Claude",
    model: "claude-3-5-sonnet-20241022",
    keyHint: "sk-ant-...",
  },
  xai: {
    label: "xAI Grok",
    model: "grok-3-mini",
    keyHint: "xai-...",
  },
};

export function QuickTailorPlayground() {
  const [provider, setProvider] = useState<Provider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(providerDefaults.openai.model);
  const [showKeyModal, setShowKeyModal] = useState(true);

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TailorResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const providerMeta = useMemo(() => providerDefaults[provider], [provider]);

  function applyProvider(next: Provider) {
    setProvider(next);
    setModel(providerDefaults[next].model);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCopied(false);

    if (!apiKey.trim()) {
      setShowKeyModal(true);
      setError("Please add your API key first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/resume/quick-tailor", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          model: model.trim(),
          resumeText,
          jobDescription,
        }),
      });

      const textBody = await response.text();
      const parsed = (() => {
        if (!textBody) return null;
        try {
          return JSON.parse(textBody) as Partial<TailorResponse> & TailorErrorResponse;
        } catch {
          return null;
        }
      })();

      if (!response.ok) {
        const detail = parsed?.details ? ` Details: ${parsed.details}` : "";
        setError(`${parsed?.error ?? "Tailoring failed"}${detail}`);
        setLoading(false);
        return;
      }

      setResult(parsed as TailorResponse);
      setLoading(false);
    } catch {
      setLoading(false);
      setError("Could not reach tailoring service.");
    }
  }

  async function copyResult() {
    if (!result?.tailoredText) return;
    await navigator.clipboard.writeText(result.tailoredText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <>
      {showKeyModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold">Choose AI Provider</h2>
            <p className="mt-2 text-sm text-zinc-300">
              Your key is used only for this request and is not stored in the database.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {(Object.keys(providerDefaults) as Provider[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => applyProvider(item)}
                  className={`rounded-md border px-3 py-2 text-left text-sm ${
                    provider === item
                      ? "border-cyan-400 bg-cyan-500/15 text-cyan-200"
                      : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  {providerDefaults[item].label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">API key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder={providerMeta.keyHint}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Model (optional)</label>
              <input
                value={model}
                onChange={(event) => setModel(event.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2"
              />
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="rounded-md bg-cyan-500 px-4 py-2 font-medium text-zinc-950 hover:bg-cyan-400"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold">Single-Page Resume Tailor</h1>
          <p className="mt-1 text-sm text-zinc-300">Paste resume on the left, job description on the right, then tailor.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          API key & provider settings
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
            <label className="mb-2 block text-sm font-medium text-zinc-200">Original resume</label>
            <textarea
              rows={18}
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your complete resume text here..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
            <label className="mb-2 block text-sm font-medium text-zinc-200">Target job description</label>
            <textarea
              rows={18}
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste job description here..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error ? <p className="rounded-md border border-red-800 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-cyan-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Tailoring..." : "Tailor resume"}
        </button>
      </form>

      <section className="mt-6 rounded-xl border border-zinc-700 bg-zinc-950/70 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Tailored output</h2>
          <div className="flex items-center gap-2 text-xs text-zinc-300">
            {result ? <span>{providerMeta.label}</span> : null}
            {result ? <span>•</span> : null}
            {result ? <span>{result.model}</span> : null}
            <button
              type="button"
              onClick={copyResult}
              disabled={!result?.tailoredText}
              className="ml-2 rounded-md border border-zinc-700 px-3 py-1 text-sm hover:bg-zinc-800 disabled:opacity-50"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <textarea
          rows={20}
          readOnly
          value={result?.tailoredText ?? "Your tailored resume will appear here..."}
          className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
        />
      </section>
    </>
  );
}
