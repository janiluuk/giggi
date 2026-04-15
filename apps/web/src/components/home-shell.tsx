"use client";

import {
  type CategoryGroup,
  type GigSort,
  getGigFeed
} from "@giggi/domain";
import { useEffect, useMemo, useState } from "react";

import styles from "./home-shell.module.css";
import { GigRow } from "./gig-row";

type SavedSearch = {
  id: string;
  label: string;
};

type HomeShellProps = {
  categories: CategoryGroup[];
  defaultCity: string;
  savedSearches: SavedSearch[];
  starredCategoryIds: string[];
};

const SORT_LABELS: { value: GigSort; label: string }[] = [
  { value: "best", label: "Best" },
  { value: "popular", label: "Popular" },
  { value: "latest", label: "Latest" },
  { value: "urgent", label: "Urgent" }
];

export function HomeShell({
  categories,
  defaultCity,
  savedSearches,
  starredCategoryIds
}: HomeShellProps) {
  const [sort, setSort] = useState<GigSort>("best");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showOffersOnly, setShowOffersOnly] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [savedGigIds, setSavedGigIds] = useState<string[]>([]);
  const [showRefresh, setShowRefresh] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const onScroll = () => {
      setShowRefresh(window.scrollY > 560);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredFeed = useMemo(
    () =>
      getGigFeed({
        categoryId: activeCategoryId,
        showOffersOnly,
        sort
      }),
    [activeCategoryId, showOffersOnly, sort]
  );

  useEffect(() => {
    setVisibleCount(Math.min(4, filteredFeed.length));
  }, [filteredFeed]);

  const visibleFeed = filteredFeed.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredFeed.length;

  const activeParent = categories.find((category) =>
    category.children.some((child) => child.id === activeCategoryId)
  );

  const starredChildren = categories.flatMap((group) =>
    group.children.filter((child) => starredCategoryIds.includes(child.id))
  );

  function resetHome() {
    setActiveCategoryId(null);
    setShowOffersOnly(false);
    setSort("best");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={styles.shell}>
      <a className="sr-only" href="#main-feed">
        Skip to feed
      </a>

      <header className={styles.topBar}>
        <div className={styles.brandCluster}>
          <button className={styles.wordmark} onClick={resetHome} type="button">
            giggi
          </button>
          <p className={styles.tagline}>Hyper-local gigs with faster trust signals</p>
        </div>

        <div className={styles.topActions}>
          <label className={styles.searchField}>
            <span className="sr-only">Search gigs</span>
            <input defaultValue="Cleaning, moving, photo" readOnly type="text" />
          </label>

          <button className={styles.primaryAction} type="button">
            Create
          </button>

          <button className={styles.iconAction} type="button">
            Inbox
          </button>

          <button
            aria-controls="mobile-secondary-menu"
            aria-expanded={menuOpen}
            className={styles.avatarAction}
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            JS
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <nav aria-label="Desktop navigation" className={styles.leftNav}>
          <NavigationPanel
            activeCategoryId={activeCategoryId}
            activeParentId={activeParent?.id ?? null}
            categories={categories}
            defaultCity={defaultCity}
            onCategorySelect={setActiveCategoryId}
            onOffersToggle={() => setShowOffersOnly((value) => !value)}
            onReset={resetHome}
            savedSearches={savedSearches}
            showOffersOnly={showOffersOnly}
            starredChildren={starredChildren}
          />
        </nav>

        <section
          aria-label="Mobile secondary menu"
          className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
          id="mobile-secondary-menu"
        >
          <NavigationPanel
            activeCategoryId={activeCategoryId}
            activeParentId={activeParent?.id ?? null}
            categories={categories}
            defaultCity={defaultCity}
            onCategorySelect={(value) => {
              setActiveCategoryId(value);
              setMenuOpen(false);
            }}
            onOffersToggle={() => setShowOffersOnly((value) => !value)}
            onReset={resetHome}
            savedSearches={savedSearches}
            showOffersOnly={showOffersOnly}
            starredChildren={starredChildren}
          />
        </section>

        <main className={styles.main} id="main-feed">
          <section className={styles.hero}>
            <div>
              <p className={styles.eyebrow}>Nearby and relevant</p>
              <h1>Find help or jump into a paid task without fighting the UI.</h1>
            </div>
            <div className={styles.heroStats}>
              <div>
                <strong>{filteredFeed.length}</strong>
                <span>active matches</span>
              </div>
              <div>
                <strong>60 km</strong>
                <span>search radius</span>
              </div>
              <div>
                <strong>7 min</strong>
                <span>average first reply</span>
              </div>
            </div>
          </section>

          <div className={styles.sortStrip} role="tablist" aria-label="Feed sort">
            {SORT_LABELS.map((option) => (
              <button
                aria-selected={sort === option.value}
                className={`${styles.sortPill} ${sort === option.value ? styles.sortPillActive : ""}`}
                key={option.value}
                onClick={() => setSort(option.value)}
                role="tab"
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          {showRefresh ? (
            <button className={styles.refreshButton} onClick={resetHome} type="button">
              Refresh home feed
            </button>
          ) : null}

          <div className={styles.feedHeader}>
            <div>
              <h2>{showOffersOnly ? "People offering help near you" : "Best matched gigs"}</h2>
              <p>
                Ordered by a lightweight MVP blend: location, urgency, freshness, category fit,
                and trust.
              </p>
            </div>
            <span className={styles.feedMeta}>
              {activeCategoryId ? "Filtered by category" : "Home defaults"}
            </span>
          </div>

          <section aria-label="Gig feed" className={styles.feedList}>
            {visibleFeed.map((gig) => (
              <GigRow
                gig={gig}
                isSaved={savedGigIds.includes(gig.id)}
                key={gig.id}
                onToggleSaved={() =>
                  setSavedGigIds((current) =>
                    current.includes(gig.id)
                      ? current.filter((value) => value !== gig.id)
                      : [...current, gig.id]
                  )
                }
              />
            ))}
          </section>

          <div className={styles.loadMoreRow}>
            {canLoadMore ? (
              <button
                className={styles.loadMoreButton}
                onClick={() => setVisibleCount((count) => Math.min(count + 2, filteredFeed.length))}
                type="button"
              >
                Load more gigs
              </button>
            ) : (
              <p className={styles.endState}>You are up to date.</p>
            )}
          </div>
        </main>

        <aside className={styles.rightRail}>
          <div className={styles.railPanel}>
            <p className={styles.eyebrow}>Right rail</p>
            <h2>Low-noise extras</h2>
            <ul>
              <li>Privacy</li>
              <li>Terms</li>
              <li>Accessibility</li>
              <li>Subscribe</li>
            </ul>
          </div>
        </aside>
      </div>

      <nav aria-label="Mobile bottom bar" className={styles.bottomBar}>
        <button className={styles.bottomItemActive} onClick={resetHome} type="button">
          Home
        </button>
        <button className={styles.bottomItem} type="button">
          Add
        </button>
        <button className={styles.bottomItem} type="button">
          Inbox
        </button>
        <button className={styles.bottomAvatar} type="button">
          JS
        </button>
      </nav>
    </div>
  );
}

type NavigationPanelProps = {
  activeCategoryId: string | null;
  activeParentId: string | null;
  categories: CategoryGroup[];
  defaultCity: string;
  onCategorySelect: (value: string | null) => void;
  onOffersToggle: () => void;
  onReset: () => void;
  savedSearches: SavedSearch[];
  showOffersOnly: boolean;
  starredChildren: { id: string; label: string }[];
};

function NavigationPanel({
  activeCategoryId,
  activeParentId,
  categories,
  defaultCity,
  onCategorySelect,
  onOffersToggle,
  onReset,
  savedSearches,
  showOffersOnly,
  starredChildren
}: NavigationPanelProps) {
  return (
    <div className={styles.navPanel}>
      <button className={styles.locationButton} type="button">
        {defaultCity} · 60 km
      </button>

      <button className={styles.navLinkActive} onClick={onReset} type="button">
        Home
      </button>

      <button
        aria-pressed={showOffersOnly}
        className={showOffersOnly ? styles.navLinkActive : styles.navLink}
        onClick={onOffersToggle}
        type="button"
      >
        Gigs offer
      </button>

      {savedSearches.length > 0 ? (
        <section className={styles.navGroup}>
          <p>Saved searches</p>
          {savedSearches.map((savedSearch) => (
            <button className={styles.navLink} key={savedSearch.id} type="button">
              {savedSearch.label}
            </button>
          ))}
        </section>
      ) : null}

      {starredChildren.length > 0 ? (
        <section className={styles.navGroup}>
          <p>Starred categories</p>
          {starredChildren.map((child) => (
            <button
              className={activeCategoryId === child.id ? styles.navLinkActive : styles.navLink}
              key={child.id}
              onClick={() => onCategorySelect(child.id)}
              type="button"
            >
              {child.label}
            </button>
          ))}
        </section>
      ) : null}

      <section className={styles.navGroup}>
        <p>Categories</p>
        {categories.map((group) => (
          <div className={styles.categoryBlock} key={group.id}>
            <button
              className={activeParentId === group.id ? styles.navLinkActive : styles.navLink}
              onClick={() => onCategorySelect(group.children[0]?.id ?? null)}
              type="button"
            >
              {group.label}
            </button>

            {activeParentId === group.id ? (
              <div className={styles.categoryChildren}>
                {group.children.map((child) => (
                  <button
                    className={activeCategoryId === child.id ? styles.childLinkActive : styles.childLink}
                    key={child.id}
                    onClick={() => onCategorySelect(child.id)}
                    type="button"
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </section>
    </div>
  );
}
