const steps = [
  {
    title: "Discover Jobs",
    description: "Find relevant openings quickly and focus only on high-fit roles.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.2-4.2" />
      </svg>
    ),
  },
  {
    title: "AI Tailors Resume",
    description: "Generate role-specific bullet points and keyword-aligned content instantly.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    title: "Get Shortlisted",
    description: "Submit ATS-ready resumes with stronger relevance and confidence.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_14px_38px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow-200">How it works</p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">From job post to shortlist-ready resume in 3 steps</h2>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {steps.map((step, index) => (
          <article key={step.title} className="rounded-2xl border border-white/10 bg-[#101010] p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex rounded-xl bg-[#FFD400] p-2 text-black">{step.icon}</div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400">Step {index + 1}</p>
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-white">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-300">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
