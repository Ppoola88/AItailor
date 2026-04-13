import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { aggregateJobs } from "@/services/jobs-service";

type JobsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const q = typeof params.q === "string" ? params.q : "";
  const location = typeof params.location === "string" ? params.location : "";

  const { jobs, count } = await aggregateJobs({ q, location, limit: 25 });
  const hasFilters = q.trim().length > 0 || location.trim().length > 0;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 text-zinc-100">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-50">Job Listings</h1>
          <p className="mt-1 text-sm text-zinc-300">Search across free live job APIs with automatic local fallback.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-indigo-300 hover:text-indigo-200 hover:underline">
          Back to dashboard
        </Link>
      </div>

      <form className="mb-6 grid gap-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 md:grid-cols-[1fr_1fr_auto]">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search title, company, keywords"
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
        />
        <input
          type="text"
          name="location"
          list="location-suggestions"
          defaultValue={location}
          placeholder="Filter by location (e.g., USA, UK, India, Remote)"
          className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder:text-zinc-500"
        />
        <datalist id="location-suggestions">
          <option value="Remote" />
          <option value="USA" />
          <option value="UK" />
          <option value="India" />
          <option value="Canada" />
          <option value="Germany" />
          <option value="Australia" />
          <option value="Singapore" />
          <option value="UAE" />
        </datalist>
        <button type="submit" className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700">
          Search
        </button>
      </form>

      <p className="mb-4 text-sm text-zinc-300">{count} jobs found</p>

      {count === 0 ? (
        <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          No jobs matched your filters. Try fewer keywords or clear the location filter.
          {hasFilters ? (
            <>
              {" "}
              <Link href="/jobs" className="font-semibold underline underline-offset-2">
                Clear filters
              </Link>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-4">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-lg border border-zinc-800 bg-zinc-950/65 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-zinc-100">{job.title}</h2>
                <p className="mt-1 text-sm text-zinc-300">
                  {job.company} | {job.location}
                </p>
              </div>
              <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-300">
                {job.source}
              </span>
            </div>

            <p className="mt-4 text-zinc-200">{job.description}</p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-zinc-400">Posted: {job.postedAt}</p>
              <div className="flex gap-2">
                <Link
                  href={`/match-score?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&description=${encodeURIComponent(job.description)}`}
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                >
                  Match score
                </Link>
                <Link
                  href={`/tailor?title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.company)}&description=${encodeURIComponent(job.description)}`}
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                >
                  Tailor resume
                </Link>
                <a
                  href={job.applyLink}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Apply
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
