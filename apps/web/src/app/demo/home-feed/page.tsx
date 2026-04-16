const sampleGigs = [
  {
    id: "1",
    title: "Clean 1-bedroom apartment today",
    category: "Deep cleaning",
    urgency: "ASAP",
    location: "Kamppi, Helsinki",
    duration: "1–3 h",
    compensation: "€60 fixed",
    snippet: "Looking for someone reliable. Basic cleaning only.",
    poster: "Anna",
    trust: "⭐ 4.8 (32)",
  },
  {
    id: "2",
    title: "Help moving a sofa this weekend",
    category: "Moving & Transport",
    urgency: "This week",
    location: "Kallio, Helsinki",
    duration: "1–2 h",
    compensation: "€40",
    snippet: "Need help carrying a sofa down one flight of stairs.",
    poster: "Mikko",
    trust: "New",
  },
  {
    id: "3",
    title: "Dog walking in the evenings",
    category: "Dog walking",
    urgency: "Flexible",
    location: "Tapiola, Espoo",
    duration: "Recurring",
    compensation: "€15 / walk",
    snippet: "Friendly labrador, 30–40 min walk on weekdays.",
    poster: "Sara",
    trust: "⭐ 4.9 (18)",
  },
];

export default function DemoHomeFeedPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Home — Nearby &amp; Relevant</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Demo feed showing how gigs will appear on the frontpage.
          </p>
        </div>
        <div className="flex gap-2 text-sm">
          <button className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium">
            Best
          </button>
          <button className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600">
            Popular
          </button>
          <button className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600">
            Latest
          </button>
          <button className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600">
            Urgent
          </button>
        </div>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-4 py-3 text-sm text-zinc-600">
          Showing gigs near <span className="font-medium">Helsinki</span>. Filters and ranking are
          demo-only in this view.
        </div>
        <ul className="divide-y divide-zinc-100">
          {sampleGigs.map((gig) => (
            <li key={gig.id} className="px-4 py-4">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-700">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">
                  {gig.urgency}
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-800">
                  {gig.category}
                </span>
              </div>
              <h2 className="text-sm font-semibold tracking-tight">{gig.title}</h2>
              <div className="mt-1 text-xs text-zinc-600">
                {gig.location} · {gig.duration} · {gig.compensation}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-700">{gig.snippet}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-800">{gig.poster}</span>
                  <span>{gig.trust}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white">
                    Contact
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-xs"
                    aria-label="Save gig"
                  >
                    ♥
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-300 text-xs"
                    aria-label="More actions"
                  >
                    ⋯
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

