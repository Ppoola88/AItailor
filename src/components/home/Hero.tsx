import Link from "next/link";

const heroImage =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80";

export function Hero() {
  return (
    <section className="rounded-3xl border border-white/12 bg-[linear-gradient(145deg,rgba(20,20,20,0.95),rgba(11,11,11,0.97))] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="fade-up">
          <div className="inline-flex rounded-full border border-yellow-300/35 bg-yellow-300/12 px-4 py-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow-200">
            AI Resume Intelligence
          </div>

          <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Get Shortlisted Faster with AI-Powered Resumes
          </h1>

          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
            Anjarpanam analyzes job descriptions and builds ATS-optimized resumes tailored for each role in seconds.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-[#FFD400] px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              Build My Resume
            </Link>
            <Link
              href="/jobs"
              className="rounded-full border border-white/22 bg-white/5 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-0.5 hover:border-yellow-300/60"
            >
              Explore Jobs
            </Link>
          </div>

          <div className="mt-6 inline-flex rounded-2xl border border-yellow-300/30 bg-yellow-300 px-4 py-2 text-sm font-black text-black shadow-[0_14px_28px_rgba(255,212,0,0.28)]">
            Launch Offer - Only $4.99 for First 100 Users
          </div>
        </div>

        <div className="fade-up-delay rounded-3xl border border-white/14 bg-white/5 p-3 shadow-[0_20px_56px_rgba(0,0,0,0.45)] transition duration-500 hover:-translate-y-1">
          <div
            className="h-[320px] w-full rounded-2xl bg-cover bg-center transition duration-500 hover:scale-[1.03] sm:h-[420px]"
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Professional software engineer working on a laptop in a clean office"
          />
        </div>
      </div>
    </section>
  );
}
