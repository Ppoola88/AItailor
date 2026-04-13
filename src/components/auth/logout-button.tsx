"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
    >
      Log out
    </button>
  );
}
