import Link from "next/link";

import { auth } from "@/server/auth";
import { prisma } from "@/server/db";

export default async function Home() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { nickname: true, name: true, isPhoneVerified: true },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Giggi (MVP)</h1>
        <p className="mt-2 text-sm text-zinc-700">
          Phase 1: authentication, basic profile, and phone verification.
        </p>

        {session ? (
          <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="text-sm">
              Signed in as{" "}
              <span className="font-medium">{user?.nickname ?? user?.name ?? "—"}</span>
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              Phone verification:{" "}
              {user?.isPhoneVerified ? (
                <span className="font-medium text-green-700">verified</span>
              ) : (
                <span className="font-medium text-amber-700">not verified</span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/verify-phone"
                className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800"
              >
                Verify phone
              </Link>
              <Link
                href="/profile"
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
              >
                Edit profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/sign-up"
              className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
