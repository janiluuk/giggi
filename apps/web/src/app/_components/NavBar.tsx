"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();
  const user = session?.user as { name?: string; email?: string } | undefined;

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          giggi
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/profile" className="text-zinc-700 hover:text-black">
            Profile
          </Link>
          <Link href="/verify-phone" className="text-zinc-700 hover:text-black">
            Verify phone
          </Link>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50"
            >
              Sign out{user?.name ? ` (${user.name})` : ""}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="rounded-md border border-zinc-300 px-3 py-1.5 hover:bg-zinc-50"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-md bg-black px-3 py-1.5 text-white hover:bg-zinc-800"
              >
                Create account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

