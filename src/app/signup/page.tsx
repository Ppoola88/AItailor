import { redirect } from "next/navigation";

import { SignupForm } from "@/components/auth/signup-form";
import { auth } from "@/lib/auth";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-zinc-600">Start building job-tailored resumes.</p>

      <SignupForm />
    </main>
  );
}
