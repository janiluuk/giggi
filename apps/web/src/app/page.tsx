import { categoryGroups, savedSearches, starredCategoryIds } from "@giggi/domain";

import { env } from "../env";
import { HomeShell } from "../components/home-shell";

export default function HomePage() {
  return (
    <HomeShell
      defaultCity={env.NEXT_PUBLIC_DEFAULT_CITY}
      categories={categoryGroups}
      savedSearches={savedSearches}
      starredCategoryIds={starredCategoryIds}
    />
  );
}
