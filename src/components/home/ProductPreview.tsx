export function ProductPreview() {
  return (
    <section id="product-preview" className="fade-up rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow-200">Product preview</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">A real workflow, not a vague mockup</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          This dashboard helps candidates understand fit instantly and make targeted resume upgrades before applying.
        </p>
      </div>

      <div className="mt-7 rounded-3xl border border-white/10 bg-[linear-gradient(160deg,#171717,#0f0f0f)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <article className="rounded-2xl border border-yellow-300/28 bg-yellow-300/8 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">Resume Match Score</p>
              <p className="mt-2 text-5xl font-black tracking-[-0.04em] text-yellow-300">85%</p>
              <p className="mt-2 text-sm text-zinc-300">Strong alignment for Backend Engineer roles with room to improve impact metrics.</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">Skill Gap Suggestions</p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                <li>Add cloud cost optimization achievements</li>
                <li>Highlight Docker and CI pipeline ownership</li>
                <li>Include quantified API latency improvements</li>
              </ul>
            </article>
          </div>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-300">Resume Preview Snippet</p>
            <div className="mt-4 rounded-xl border border-white/8 bg-[#0d0d0d] p-4 text-sm leading-7 text-zinc-200">
              <p className="font-semibold text-white">Experience Highlights</p>
              <p className="mt-2">Built and optimized backend APIs serving 1.2M monthly requests with 99.95% uptime.</p>
              <p className="mt-2">Reduced average response time by 38% using caching and query optimization.</p>
              <p className="mt-2">Collaborated with cross-functional teams to ship ATS-friendly technical content for recruiting workflows.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
