export type GigKind = "REQUEST" | "OFFER";
export type GigSort = "best" | "popular" | "latest" | "urgent";
export type LocationMode = "ONSITE" | "REMOTE" | "WORKER_PLACE";

export type GigPreview = {
  id: string;
  type: GigKind;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  urgencyLabel: string;
  freshnessChip?: string;
  promoChip?: string;
  locationLabel: string;
  scheduleLabel: string;
  compensationLabel: string;
  paymentLabel?: string;
  creatorName: string;
  creatorBadge: string;
  ratingLabel: string;
  messageCount: number;
  hasImage: boolean;
  imageLabel?: string;
  locationMode: LocationMode;
  locationScore: number;
  popularityScore: number;
  freshnessScore: number;
  urgencyScore: number;
  createdAt: string;
  categoryParent: string;
};

export type CategoryGroup = {
  id: string;
  label: string;
  children: { id: string; label: string }[];
};

export const categoryGroups: CategoryGroup[] = [
  {
    id: "home-help",
    label: "Home help",
    children: [
      { id: "cleaning", label: "Deep cleaning" },
      { id: "moving", label: "Moving help" }
    ]
  },
  {
    id: "outdoor",
    label: "Outdoor",
    children: [
      { id: "garden", label: "Garden tidy-up" },
      { id: "snow", label: "Snow clearing" }
    ]
  },
  {
    id: "creative",
    label: "Creative",
    children: [
      { id: "photo", label: "Photo support" },
      { id: "design", label: "Poster design" }
    ]
  }
];

export const savedSearches = [
  { id: "nearby-now", label: "Nearby today" },
  { id: "weekend-helpers", label: "Weekend helpers" }
];

export const starredCategoryIds = ["cleaning", "garden"];

export const mockGigs: GigPreview[] = [
  {
    id: "gig-1",
    type: "REQUEST",
    title: "Clean a one-bedroom apartment before evening guests arrive",
    description:
      "Need a fast reset in Kamppi. Kitchen surfaces, bathroom, floors, and quick linen swap.",
    category: "Deep cleaning",
    subcategory: "Deep cleaning",
    urgencyLabel: "ASAP",
    freshnessChip: "Just created",
    locationLabel: "Kamppi, Helsinki",
    scheduleLabel: "Today, 17:00 to 20:00",
    compensationLabel: "EUR 60 fixed",
    paymentLabel: "After job · Cash",
    creatorName: "Anna",
    creatorBadge: "Reliable",
    ratingLabel: "4.8 (32 reviews)",
    messageCount: 3,
    hasImage: true,
    imageLabel: "Warm apartment interior",
    locationMode: "ONSITE",
    locationScore: 0.98,
    popularityScore: 0.65,
    freshnessScore: 0.95,
    urgencyScore: 1,
    createdAt: "2026-04-16T08:00:00.000Z",
    categoryParent: "home-help"
  },
  {
    id: "gig-2",
    type: "OFFER",
    title: "Available this afternoon for garden cleanup and hauling",
    description:
      "I can help with branches, leaves, and taking bags to the recycling point in western Helsinki.",
    category: "Garden tidy-up",
    subcategory: "Garden tidy-up",
    urgencyLabel: "Today",
    freshnessChip: "Expires soon",
    locationLabel: "Munkkiniemi, Helsinki",
    scheduleLabel: "Today, 14:00 to 19:00",
    compensationLabel: "EUR 28 / hour",
    paymentLabel: "Flexible · Mobile or bank",
    creatorName: "Mika",
    creatorBadge: "Phone verified",
    ratingLabel: "4.9 (14 reviews)",
    messageCount: 5,
    hasImage: false,
    locationMode: "ONSITE",
    locationScore: 0.9,
    popularityScore: 0.72,
    freshnessScore: 0.8,
    urgencyScore: 0.78,
    createdAt: "2026-04-15T18:30:00.000Z",
    categoryParent: "outdoor"
  },
  {
    id: "gig-3",
    type: "REQUEST",
    title: "Need someone to help move boxes from cellar storage",
    description:
      "Two hours should do it. Building has an elevator. Heavy lifting for a short burst only.",
    category: "Moving help",
    subcategory: "Moving help",
    urgencyLabel: "This week",
    locationLabel: "Kallio, Helsinki",
    scheduleLabel: "Fri, 18:30",
    compensationLabel: "EUR 45 fixed",
    creatorName: "Sari",
    creatorBadge: "New",
    ratingLabel: "No reviews yet",
    messageCount: 1,
    hasImage: false,
    locationMode: "ONSITE",
    locationScore: 0.76,
    popularityScore: 0.31,
    freshnessScore: 0.67,
    urgencyScore: 0.55,
    createdAt: "2026-04-14T10:20:00.000Z",
    categoryParent: "home-help"
  },
  {
    id: "gig-4",
    type: "OFFER",
    title: "Poster design and quick social graphics for local events",
    description:
      "Fast-turnaround Canva and Figma support for event promos, cafe menus, and community posters.",
    category: "Poster design",
    subcategory: "Poster design",
    urgencyLabel: "Flexible",
    promoChip: "Featured",
    locationLabel: "Remote",
    scheduleLabel: "Remote delivery in 24h",
    compensationLabel: "Negotiable",
    paymentLabel: "After job · Mobile or bank",
    creatorName: "Leena",
    creatorBadge: "Reliable",
    ratingLabel: "4.7 (21 reviews)",
    messageCount: 8,
    hasImage: true,
    imageLabel: "Graphic poster draft",
    locationMode: "REMOTE",
    locationScore: 0.52,
    popularityScore: 0.83,
    freshnessScore: 0.7,
    urgencyScore: 0.3,
    createdAt: "2026-04-13T12:45:00.000Z",
    categoryParent: "creative"
  },
  {
    id: "gig-5",
    type: "REQUEST",
    title: "Snow clearing for a narrow driveway before early commute",
    description:
      "Need help tomorrow morning. Narrow drive, shovel and grit available on site.",
    category: "Snow clearing",
    subcategory: "Snow clearing",
    urgencyLabel: "Urgent",
    freshnessChip: "Expires soon",
    locationLabel: "Haaga, Helsinki",
    scheduleLabel: "Tomorrow, 06:00",
    compensationLabel: "EUR 35 fixed",
    creatorName: "Jussi",
    creatorBadge: "Reliable",
    ratingLabel: "4.6 (11 reviews)",
    messageCount: 2,
    hasImage: false,
    locationMode: "ONSITE",
    locationScore: 0.74,
    popularityScore: 0.41,
    freshnessScore: 0.75,
    urgencyScore: 0.94,
    createdAt: "2026-04-15T21:10:00.000Z",
    categoryParent: "outdoor"
  },
  {
    id: "gig-6",
    type: "OFFER",
    title: "Portrait and event photography with same-day selects",
    description:
      "Available for neighborhood events, openings, and quick portrait sessions. Editing included.",
    category: "Photo support",
    subcategory: "Photo support",
    urgencyLabel: "This week",
    locationLabel: "Punavuori, Helsinki",
    scheduleLabel: "Slots open Thu to Sat",
    compensationLabel: "EUR 90 fixed",
    paymentLabel: "After job · Mobile or bank",
    creatorName: "Oona",
    creatorBadge: "Phone verified",
    ratingLabel: "5.0 (7 reviews)",
    messageCount: 4,
    hasImage: true,
    imageLabel: "Camera and lighting setup",
    locationMode: "WORKER_PLACE",
    locationScore: 0.68,
    popularityScore: 0.61,
    freshnessScore: 0.58,
    urgencyScore: 0.48,
    createdAt: "2026-04-12T09:30:00.000Z",
    categoryParent: "creative"
  }
];

export function getGigFeed(options?: {
  categoryId?: string | null;
  showOffersOnly?: boolean;
  sort?: GigSort;
}) {
  const sort = options?.sort ?? "best";

  const category = categoryGroups
    .flatMap((group) => group.children.map((child) => ({ ...child, parentId: group.id })))
    .find((entry) => entry.id === options?.categoryId);

  const filtered = mockGigs.filter((gig) => {
    if (options?.showOffersOnly && gig.type !== "OFFER") {
      return false;
    }

    if (category) {
      return gig.subcategory === category.label || gig.categoryParent === category.parentId;
    }

    return true;
  });

  return [...filtered].sort((left, right) => compareGigs(left, right, sort));
}

function compareGigs(left: GigPreview, right: GigPreview, sort: GigSort) {
  if (sort === "latest") {
    return Date.parse(right.createdAt) - Date.parse(left.createdAt);
  }

  if (sort === "popular") {
    return right.popularityScore - left.popularityScore;
  }

  if (sort === "urgent") {
    return right.urgencyScore - left.urgencyScore;
  }

  return weightedInterest(right) - weightedInterest(left);
}

export function weightedInterest(gig: GigPreview) {
  return (
    gig.locationScore * 0.3 +
    gig.urgencyScore * 0.25 +
    gig.freshnessScore * 0.2 +
    gig.popularityScore * 0.15 +
    scoreFromBadge(gig.creatorBadge) * 0.1
  );
}

function scoreFromBadge(badge: GigPreview["creatorBadge"]) {
  if (badge === "Reliable" || badge === "Phone verified") {
    return 0.9;
  }

  if (badge === "New") {
    return 0.4;
  }

  return 0.6;
}

