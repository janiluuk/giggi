const gig = {
  title: "Deep cleaning before move-out",
  location: "Punavuori, Helsinki",
  when: "Sat 14:00–18:00",
  compensation: "€180 fixed",
  urgency: "This week",
  category: "Deep cleaning",
  effort: "Half day",
  description:
    "Need a thorough clean before moving out of a 2-room apartment (50 m²). Oven, fridge, bathroom, and windows included.",
  checklist: [
    "Vacuum and mop all floors",
    "Clean bathroom (shower, toilet, sink, tiles)",
    "Wipe kitchen surfaces and cupboards (outside)",
    "Clean oven and fridge (inside)",
    "Clean windows from inside",
  ],
  poster: "Laura",
  trust: "⭐ 4.7 (21)",
};

export default function DemoGigDetailPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <header className="mb-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-700">
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">
              {gig.urgency}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-800">
              {gig.category}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{gig.title}</h1>
          <div className="mt-1 text-sm text-zinc-700">
            {gig.location} · {gig.when} · {gig.compensation}
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            Effort: {gig.effort} · Posted by{" "}
            <span className="font-medium text-zinc-800">{gig.poster}</span> · {gig.trust}
          </div>
        </header>

        <section className="mt-4 space-y-3 text-sm text-zinc-800">
          <p>{gig.description}</p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold tracking-tight">Checklist (example)</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-800">
            {gig.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 text-sm">
          <div className="text-xs text-zinc-600">
            This is a demo view showing how gig detail and checklist might look in MVP.
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-black px-4 py-2 text-xs font-medium text-white">
              Message
            </button>
            <button className="rounded-md border border-zinc-300 px-3 py-2 text-xs">
              Hire (demo)
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

