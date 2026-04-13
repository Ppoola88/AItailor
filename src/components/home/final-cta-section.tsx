import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="rounded-[38px] border border-black/10 bg-[linear-gradient(135deg,#1a1a1a_0%,#0f0f0f_65%,#2b2400_100%)] px-6 py-10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-yellow-200">Ready to apply better?</p>
          <p className="font-display mt-3 max-w-3xl text-3xl font-bold leading-[1] tracking-[-0.04em] sm:text-4xl">
            Build a sharper profile, tailor each resume, and move into every application with more signal.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex rounded-full bg-yellow-300 px-6 py-3.5 text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-950 transition hover:-translate-y-0.5 hover:bg-yellow-200"
        >
          Start Free Profile
        </Link>
      </div>
    </section>
  );
}
