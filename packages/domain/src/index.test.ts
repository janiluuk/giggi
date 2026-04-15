import { describe, expect, it } from "vitest";

import { getGigFeed, weightedInterest } from "./index";

describe("weightedInterest", () => {
  it("prioritizes nearby urgent gigs in best sort", () => {
    const feed = getGigFeed({ sort: "best" });

    expect(feed[0]?.id).toBe("gig-1");
    expect(weightedInterest(feed[0]!)).toBeGreaterThan(weightedInterest(feed[1]!));
  });

  it("filters offers when the home scope changes", () => {
    const feed = getGigFeed({ showOffersOnly: true, sort: "latest" });

    expect(feed.every((gig) => gig.type === "OFFER")).toBe(true);
  });

  it("keeps urgent sort separate from latest sort", () => {
    const urgent = getGigFeed({ sort: "urgent" }).map((gig) => gig.id);
    const latest = getGigFeed({ sort: "latest" }).map((gig) => gig.id);

    expect(urgent).not.toEqual(latest);
    expect(urgent[0]).toBe("gig-1");
  });
});

