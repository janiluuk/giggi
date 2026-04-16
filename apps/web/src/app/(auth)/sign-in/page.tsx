"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      if (!res || res.error) {
        setError("Invalid email or password.");
        return;
      }
      window.location.href = res.url ?? "/";
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-zinc-700">
        New here?{" "}
        <Link href="/sign-up" className="font-medium text-black underline">
          Create an account
        </Link>
        .
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
        >
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <div className="text-xs text-zinc-500">or</div>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <div className="text-xs font-medium text-zinc-700">Email</div>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="block">
            <div className="text-xs font-medium text-zinc-700">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              required
            />
          </label>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <button
            disabled={busy}
            className="w-full rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

