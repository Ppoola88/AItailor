"use client";

import Link from "next/link";
import { useState } from "react";

import { BrandLogo } from "@/components/home/brand-logo";

const navItems = [
  { href: "#trust", label: "Trust" },
  { href: "#product-preview", label: "Preview" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
];

export function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 rounded-[28px] border border-white/12 bg-white/5 px-4 py-3 shadow-[0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex w-full items-center justify-between gap-4">
        <Link href="/" className="flex items-center">
          <BrandLogo compact className="w-[172px] sm:w-[200px]" />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-extrabold uppercase tracking-[0.08em] text-zinc-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className="rounded-full border border-white/24 bg-white/6 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-yellow-300/60 sm:text-sm"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[#FFD400] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-black shadow-[0_10px_24px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:brightness-105 sm:text-sm"
          >
            Start
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex rounded-full border border-white/24 bg-white/6 p-2 text-white transition hover:border-yellow-300/70 md:hidden"
        >
          {isOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen ? (
        <div className="mt-4 rounded-2xl border border-white/12 bg-[#121212] p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-[0.08em] text-zinc-200 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex gap-2">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-white/24 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-yellow-300/60 sm:text-sm"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#FFD400] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-black transition hover:brightness-105 sm:text-sm"
            >
              Start
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
