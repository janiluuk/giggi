"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname, email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        if (body?.error === "email_taken") setError("Email is already in use.");
        else setError("Could not create account.");
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });
      window.location.href = signInRes?.url ?? "/";
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-2 text-sm text-zinc-700">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-black underline">
          Sign in
        </Link>
        .
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block">
            <div className="text-xs font-medium text-zinc-700">Nickname</div>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              required
            />
          </label>

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
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              required
              minLength={8}
            />
            <div className="mt-1 text-xs text-zinc-500">At least 8 characters.</div>
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
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

