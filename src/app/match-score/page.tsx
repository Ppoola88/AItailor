import Link from "next/link";
import { redirect } from "next/navigation";

import { MatchScoreForm } from "@/components/match-score/match-score-form";
import { auth } from "@/lib/auth";

type MatchScorePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function pickString(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export default async function MatchScorePage({ searchParams }: MatchScorePageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};
  const initialJobTitle = pickString(params.title);
  const initialCompany = pickString(params.company);
  const initialDescription = pickString(params.description);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Match Score Engine</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Compare your profile to a job description and get actionable gap recommendations.
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/jobs" className="font-medium text-indigo-700 hover:underline">
            Browse jobs
          </Link>
          <Link href="/dashboard" className="font-medium text-indigo-700 hover:underline">
            Dashboard
          </Link>
        </div>
      </div>

      <MatchScoreForm
        initialJobTitle={initialJobTitle}
        initialCompany={initialCompany}
        initialDescription={initialDescription}
      />
    </main>
  );
}
