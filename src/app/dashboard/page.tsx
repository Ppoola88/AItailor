import Link from "next/link";
import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-12 text-zinc-100">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6 shadow-xl shadow-black/30 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-zinc-50">Welcome, {session.user.name ?? session.user.email}</h1>
          <LogoutButton />
        </div>

        <p className="mt-5 text-zinc-300">
          Your account is active. Start by creating your base resume profile, then use AI to tailor it per job.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/profile"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-zinc-100 transition hover:border-indigo-400 hover:text-indigo-200"
          >
            Edit resume profile
          </Link>
          <Link
            href="/jobs"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-zinc-100 transition hover:border-indigo-400 hover:text-indigo-200"
          >
            Browse jobs
          </Link>
          <Link
            href="/tailor"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-zinc-100 transition hover:border-indigo-400 hover:text-indigo-200"
          >
            Tailor resume with AI
          </Link>
          <Link
            href="/match-score"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-zinc-100 transition hover:border-indigo-400 hover:text-indigo-200"
          >
            Check match score
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 font-medium text-zinc-100 transition hover:border-indigo-400 hover:text-indigo-200"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
