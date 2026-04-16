"use client";

import { useState } from "react";

type Profile = {
  bio: string | null;
  skills: string[];
  visibilityLevel: "PUBLIC" | "HIDDEN";
};

export function ProfileForm({ initial }: { initial: Profile }) {
  const [bio, setBio] = useState(initial.bio ?? "");
  const [skillsText, setSkillsText] = useState(initial.skills.join(", "));
  const [visibilityLevel, setVisibilityLevel] = useState<Profile["visibilityLevel"]>(
    initial.visibilityLevel ?? "PUBLIC",
  );
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bio: bio.trim() ? bio.trim() : null,
        skills,
        visibilityLevel,
      }),
    });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <label className="block">
        <div className="text-xs font-medium text-zinc-700">Bio</div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          rows={5}
          placeholder="A short intro…"
        />
      </label>

      <label className="block">
        <div className="text-xs font-medium text-zinc-700">Skills</div>
        <input
          value={skillsText}
          onChange={(e) => setSkillsText(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          placeholder="Cleaning, moving, tutoring"
        />
        <div className="mt-1 text-xs text-zinc-500">Comma-separated.</div>
      </label>

      <label className="block">
        <div className="text-xs font-medium text-zinc-700">Visibility</div>
        <select
          value={visibilityLevel}
          onChange={(e) => setVisibilityLevel(e.target.value as Profile["visibilityLevel"])}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="PUBLIC">Public</option>
          <option value="HIDDEN">Hidden</option>
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button
          disabled={status === "saving"}
          className="rounded-md bg-black px-3 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save"}
        </button>
        {status === "saved" ? (
          <span className="text-sm text-green-700">Saved</span>
        ) : status === "error" ? (
          <span className="text-sm text-red-700">Could not save</span>
        ) : null}
      </div>
    </form>
  );
}

