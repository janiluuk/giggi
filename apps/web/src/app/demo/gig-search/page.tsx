"use client";

import { useState } from "react";

const allGigs = [
  {
    id: "1",
    title: "Math tutoring for high school exam",
    location: "Pasila, Helsinki",
    compensation: "€35 / h",
    urgency: "Flexible",
  },
  {
    id: "2",
    title: "Translate CV from Finnish to English",
    location: "Remote",
    compensation: "€80 fixed",
    urgency: "ASAP",
  },
  {
    id: "3",
    title: "Help carrying boxes to storage",
    location: "Kontula, Helsinki",
    compensation: "€50",
    urgency: "Today",
  },
];

export default function DemoGigSearchPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const results = allGigs.filter((gig) => gig.title.toLowerCase().includes(q));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-4 space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">Search gigs</h1>
        <p className="text-sm text-zinc-600">
          Demo search results list using the same flat feed layout as the homepage.
        </p>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
            className="w-full max-w-sm rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <button className="rounded-md border border-zinc-300 px-3 py-2 text-xs">Filters</button>
        </div>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white">
        {results.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-600">
            No demo results match that query. Try a broader search.
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {results.map((gig) => (
              <li key={gig.id} className="px-4 py-4">
                <h2 className="text-sm font-semibold tracking-tight">{gig.title}</h2>
                <div className="mt-1 text-xs text-zinc-600">
                  {gig.location} · {gig.compensation} · {gig.urgency}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

