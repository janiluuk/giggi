"use client";

import { useState } from "react";

export function VerifyPhoneForm() {
  const [phoneE164, setPhoneE164] = useState("+358");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "verifying" | "verified" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setError(null);
    setStatus("sending");
    const res = await fetch("/api/phone/send-code", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneE164 }),
    });
    const body = (await res.json().catch(() => null)) as
      | { devCode?: string; error?: string }
      | null;
    if (!res.ok) {
      setError(body?.error ?? "Could not send code.");
      setStatus("error");
      return;
    }
    setDevCode(body?.devCode ?? null);
    setStatus("sent");
  }

  async function verify() {
    setError(null);
    setStatus("verifying");
    const res = await fetch("/api/phone/verify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phoneE164, code }),
    });
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      setError(body?.error ?? "Invalid code.");
      setStatus("error");
      return;
    }
    setStatus("verified");
  }

  return (
    <div className="space-y-4">
      <label className="block">
        <div className="text-xs font-medium text-zinc-700">Phone (E.164)</div>
        <input
          value={phoneE164}
          onChange={(e) => setPhoneE164(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="+358401234567"
        />
        <div className="mt-1 text-xs text-zinc-500">
          Finland-first for MVP. Use a format like <span className="font-mono">+358…</span>
        </div>
      </label>

      <button
        type="button"
        onClick={sendCode}
        disabled={status === "sending" || status === "verifying"}
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send code"}
      </button>

      {devCode ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Dev code: <span className="font-mono font-semibold">{devCode}</span>
        </div>
      ) : null}

      <label className="block">
        <div className="text-xs font-medium text-zinc-700">Verification code</div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="123456"
        />
      </label>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={verify}
          disabled={status === "sending" || status === "verifying"}
          className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {status === "verifying" ? "Verifying…" : "Verify"}
        </button>
        {status === "verified" ? (
          <span className="text-sm text-green-700">Verified</span>
        ) : null}
      </div>
    </div>
  );
}

