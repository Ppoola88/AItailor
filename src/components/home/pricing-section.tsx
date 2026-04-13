import Link from "next/link";

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="rounded-[34px] border border-black/8 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,249,232,0.96))] px-6 py-10 shadow-[0_18px_44px_rgba(0,0,0,0.06)] sm:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-500">Pricing</p>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.04em] text-zinc-950 sm:text-4xl">
            Low-friction pricing for people actively applying now.
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            The launch plan is intentionally simple: one affordable entry point that gives job seekers tailoring, match scoring, and improvement guidance without enterprise-style complexity.
          </p>
        </div>

        <div className="rounded-[30px] border-2 border-yellow-300 bg-[#111111] p-6 text-white shadow-[0_18px_48px_rgba(0,0,0,0.16)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-yellow-200">Starter launch plan</p>
              <div className="mt-3 flex items-end gap-2">
                <p className="font-display text-5xl font-bold tracking-[-0.05em] text-white">$4.99</p>
                <p className="pb-1 text-sm font-semibold text-zinc-300">Limited offer</p>
              </div>
            </div>
            <div className="rounded-full bg-yellow-300 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-zinc-950">
              First 100 users
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-zinc-200 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">Unlimited tailored resumes</div>
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">Keyword-based match scoring</div>
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">Skill-gap suggestions</div>
            <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">Fast export workflow</div>
          </div>

          <Link
            href="/signup"
            className="mt-6 inline-flex rounded-full bg-yellow-300 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-950 transition hover:-translate-y-0.5 hover:bg-yellow-200"
          >
            Claim Offer Now
          </Link>
        </div>
      </div>
    </section>
  );
}
