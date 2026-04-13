import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { BeforeAfter } from "@/components/home/BeforeAfter";
import { CTA } from "@/components/home/CTA";
import { Features } from "@/components/home/Features";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pricing } from "@/components/home/Pricing";
import { ProductPreview } from "@/components/home/ProductPreview";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteNav } from "@/components/home/site-nav";
import { TrustSection } from "@/components/home/TrustSection";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative overflow-hidden bg-[#0B0B0B] text-white scroll-smooth">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[linear-gradient(180deg,rgba(255,212,0,0.12),transparent)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SiteNav />
        <Hero />
        <TrustSection />
        <ProductPreview />
        <HowItWorks />
        <Features />
        <BeforeAfter />
        <Pricing />
        <CTA />

        <div className="flex justify-center pb-4">
          <Link
            href="/login"
            className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(0,0,0,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:border-yellow-300/60"
          >
            Existing user? Log in
          </Link>
        </div>

        <SiteFooter />
      </div>
    </main>
  );
}
