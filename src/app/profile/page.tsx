import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileEditor } from "@/components/profile/profile-editor";
import { auth } from "@/lib/auth";
import { getProfileForUser } from "@/services/profile-service";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getProfileForUser(session.user.id);
  if (!profile) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Base Resume Profile</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Maintain your source profile once. AI tailoring will build job-specific resumes from this data.
          </p>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-indigo-700 hover:underline">
          Back to dashboard
        </Link>
      </div>

      <ProfileEditor initialProfile={profile} />
    </main>
  );
}
