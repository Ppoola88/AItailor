import Link from "next/link";

import { QuickTailorPlayground } from "@/components/resume/quick-tailor-playground";

export default function QuickTailorPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10">
      <div className="mb-5 flex items-center justify-between text-sm">
        <div className="flex gap-4">
          <Link href="/" className="font-medium text-cyan-300 hover:underline">
            Home
          </Link>
          <Link href="/tailor" className="font-medium text-cyan-300 hover:underline">
            Existing tailored flow
          </Link>
        </div>
      </div>

      <QuickTailorPlayground />
    </main>
  );
}
