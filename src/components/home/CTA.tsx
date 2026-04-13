import Link from "next/link";

export function CTA() {
  return (
    <section className="fade-up rounded-3xl border border-white/10 bg-[linear-gradient(145deg,#191919,#0f0f0f)] p-6 text-center shadow-[0_16px_44px_rgba(0,0,0,0.42)] sm:p-8">
      <p className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
        Stop applying blindly. Start getting shortlisted.
      </p>
      <Link
        href="/profile"
        className="mt-6 inline-flex rounded-full bg-[#FFD400] px-7 py-3 text-sm font-extrabold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
      >
        Start Free Profile
      </Link>
    </section>
  );
}
