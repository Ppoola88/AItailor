export function BeforeAfter() {
  return (
    <section className="fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_14px_38px_rgba(0,0,0,0.35)] sm:p-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow-200">Before vs After</p>
      <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">See the difference in resume quality</h2>

      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-red-300/30 bg-red-300/8 p-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-red-200">Generic Resume</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-200">
            <li>Weak bullets</li>
            <li>No keywords</li>
            <li>Generic wording with low relevance</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-emerald-300/35 bg-emerald-300/10 p-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.1em] text-emerald-200">Anjarpanam Resume</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-100">
            <li>Strong action verbs</li>
            <li>Keyword optimized</li>
            <li>ATS-friendly structure with measurable impact</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
