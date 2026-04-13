import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="fade-up rounded-3xl border border-yellow-300/45 bg-[#121212] p-6 shadow-[0_20px_52px_rgba(0,0,0,0.45)] sm:p-8">
      <div className="mx-auto max-w-2xl rounded-3xl border border-yellow-300/35 bg-[linear-gradient(170deg,#1a1a1a,#121212)] p-6 text-center sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-yellow-200">Starter Launch Plan</p>
        <p className="mt-3 text-6xl font-black tracking-[-0.04em] text-[#FFD400]">$4.99</p>

        <div className="mt-6 grid gap-3 text-left text-sm text-zinc-200 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Unlimited tailored resumes</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Match scoring</div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Resume downloads</div>
        </div>

        <Link
          href="/signup"
          className="mt-7 inline-flex rounded-full bg-[#FFD400] px-7 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
        >
          Claim Offer Now
        </Link>

        <p className="mt-4 text-sm font-bold text-yellow-100">Limited to first 100 users</p>
      </div>
    </section>
  );
}
