const features = [
  {
    title: "AI Resume Tailoring",
    description: "Generate role-specific resumes from job descriptions while keeping your achievements accurate.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    ),
  },
  {
    title: "ATS Optimization",
    description: "Improve keyword relevance, structure, and formatting to pass ATS filters with confidence.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h7" />
        <path d="M7 16h5" />
      </svg>
    ),
  },
  {
    title: "Match Score Insights",
    description: "Get a clear role-fit score so you can focus on jobs where you are likely to get shortlisted.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 18h16" />
        <path d="M7 14l3-3 3 2 4-5" />
      </svg>
    ),
  },
  {
    title: "Skill Gap Analysis",
    description: "Spot missing qualifications and prioritize the exact upgrades recruiters care about.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section id="features" className="fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_16px_42px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow-200">Features</p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">Everything needed to apply smarter</h2>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="group rounded-2xl border border-white/10 bg-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-yellow-300/45"
          >
            <div className="inline-flex rounded-xl bg-yellow-300 p-2 text-black shadow-[0_10px_24px_rgba(255,212,0,0.25)]">{feature.icon}</div>
            <h3 className="mt-4 text-xl font-extrabold tracking-[-0.02em] text-white">{feature.title}</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-300">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
