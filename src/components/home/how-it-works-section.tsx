const steps = [
  {
    title: "Discover jobs",
    description: "Discover latest jobs from across the internet.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.2-4.2" />
      </svg>
    ),
  },
  {
    title: "Tailor instantly",
    description: "Generate tailored resumes instantly for each role.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
        <path d="M7.5 7.5l9 9" />
        <path d="M16.5 7.5l-9 9" />
      </svg>
    ),
  },
  {
    title: "Apply with confidence",
    description: "Apply with confidence and get shortlisted faster.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="rounded-[34px] border border-black/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,248,226,0.92))] px-6 py-10 shadow-[0_18px_44px_rgba(0,0,0,0.06)] backdrop-blur sm:px-8"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">How it works</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
            A tighter application workflow in three moves.
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">
          The product flow is simple on purpose: bring your base profile in once, evaluate the role, then generate a sharper resume with clear improvement signals.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="group rounded-[28px] border border-black/8 bg-white/90 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-zinc-900"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="rounded-2xl bg-yellow-300 p-3 text-zinc-950 shadow-[0_10px_24px_rgba(255,212,0,0.28)]">
                {step.icon}
              </div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">Step {index + 1}</p>
            </div>
            <h3 className="font-display mt-6 text-2xl font-bold tracking-[-0.03em] text-zinc-950">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-700">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
