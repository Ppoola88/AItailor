const features = [
  {
    title: "AI Resume Tailoring",
    description: "Rewrite and optimize your resume against specific job descriptions while staying factual.",
  },
  {
    title: "Match Score",
    description: "See how aligned your profile is with each role using clear keyword-based match analysis.",
  },
  {
    title: "Skill Gap Insights",
    description: "Identify missing skills and get practical suggestions to improve your shortlist chances.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden rounded-[38px] border border-black/10 bg-[#111111] px-6 py-10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,212,0,0.16),transparent_28%)]" />
      <div className="relative">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-yellow-200">Core features</p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
              Built to improve application quality, not just output volume.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
            Each feature is tied to a job-seeker outcome: better alignment, clearer gaps, and faster iteration for every role you care about.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-[28px] border border-white/12 bg-white/6 p-6 transition hover:-translate-y-1 hover:border-yellow-300/70 hover:bg-white/10"
          >
            <div className="h-1.5 w-14 rounded-full bg-yellow-300" />
            <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.03em] text-yellow-300">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-200">{feature.description}</p>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
