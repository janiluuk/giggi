import { getGigFeed } from "@giggi/domain";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sortValue = searchParams.get("sort");
  const sort =
    sortValue === "popular" || sortValue === "latest" || sortValue === "urgent"
      ? sortValue
      : "best";

  return NextResponse.json({
    items: getGigFeed({
      sort,
      showOffersOnly: searchParams.get("offers") === "1",
      categoryId: searchParams.get("category")
    })
  });
}
