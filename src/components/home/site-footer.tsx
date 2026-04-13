import Link from "next/link";

import { BrandLogo } from "@/components/home/brand-logo";

export function SiteFooter() {
  return (
    <footer className="rounded-[30px] border border-white/10 bg-white/5 px-5 py-6 shadow-[0_14px_32px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandLogo compact className="w-[172px]" />
          <p className="mt-3 max-w-md text-sm leading-6 text-zinc-300">
            Anjarpanam helps job seekers tailor stronger resumes, understand fit, and improve each application before sending it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/signup" className="font-semibold text-zinc-200 hover:text-white">
            Create account
          </Link>
          <Link href="/jobs" className="font-semibold text-zinc-200 hover:text-white">
            Explore jobs
          </Link>
          <Link href="/tailor" className="font-semibold text-zinc-200 hover:text-white">
            Build resume
          </Link>
        </div>
      </div>
    </footer>
  );
}
