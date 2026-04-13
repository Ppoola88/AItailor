import Link from "next/link";

import { BrandLogo } from "@/components/home/brand-logo";

export function HeroSection() {
  return (
    <section className="noise-overlay relative overflow-hidden rounded-[40px] border border-black/10 bg-[#111111] px-6 py-8 text-white shadow-[0_26px_90px_rgba(0,0,0,0.28)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="brand-grid absolute inset-0 opacity-20" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-yellow-300/18 blur-3xl" />
      <div className="absolute left-0 top-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <div className="max-w-[240px] sm:max-w-[280px]">
            <BrandLogo />
          </div>

          <div className="mt-6 inline-flex rounded-full border border-yellow-300/35 bg-yellow-300/12 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-yellow-200">
            Built for job seekers who want more replies
          </div>

          <h1 className="font-display mt-6 max-w-3xl text-4xl font-bold leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
            Resume tailoring that feels premium and performs like a growth tool.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Anjarpanam turns each job description into a sharper application package with tailored bullets, clearer match scoring, and practical skill-gap direction before you hit apply.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-yellow-400 px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-950 shadow-[0_14px_34px_rgba(255,212,0,0.28)] transition hover:-translate-y-0.5 hover:bg-yellow-300"
            >
              Start Free Profile
            </Link>
            <Link
              href="/jobs"
              className="rounded-full border border-white/20 bg-white/8 px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition hover:border-yellow-300/60 hover:bg-white/12"
            >
              Explore Jobs
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <div className="rounded-2xl border border-white/12 bg-white/6 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Average workflow</p>
              <p className="mt-1 text-lg font-extrabold text-white">Profile - Match - Tailor</p>
            </div>
            <div className="rounded-2xl border border-yellow-300/30 bg-yellow-300 px-4 py-3 text-zinc-950">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-700">Launch offer</p>
              <p className="mt-1 text-lg font-extrabold">$4.99 for first 100 users</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-5 right-5 rounded-full border border-yellow-300/30 bg-yellow-300/14 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-yellow-200">
            ATS-focused outputs
          </div>

          <div className="rounded-[32px] border border-white/12 bg-gradient-to-br from-white/12 to-white/4 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur">
            <div className="rounded-[26px] bg-[#1b1b1b] p-5">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-200">Application Snapshot</p>
                  <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.03em] text-white">Senior Product Analyst</h2>
                </div>
                <div className="rounded-2xl bg-yellow-300 px-4 py-3 text-right text-zinc-950">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em]">Match score</p>
                  <p className="text-2xl font-black">92%</p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Tailored summary</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-200">
                    Data storyteller with experience turning messy operational metrics into executive-ready decisions.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Key wins surfaced</p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-200">
                    <li>Improved reporting turnaround by 41%</li>
                    <li>Aligned resume language with role keywords</li>
                    <li>Flagged SQL and stakeholder communication as strengths</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-[#131313] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">Suggested skill upgrades</p>
                  <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.12em]">
                    <span className="rounded-full bg-yellow-300 px-3 py-1 text-zinc-950">SQL storytelling</span>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-zinc-200">A/B testing</span>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-zinc-200">Forecasting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
