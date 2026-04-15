# Home (shell + feed)

**Status:** Implemented

**Related:** [`../ui-system.md`](../ui-system.md); [Feed list](../components/feed-list.md); [Gig card](../components/gig-card.md); [`../tokens.md`](../tokens.md); [`giggi.md` §4](../../giggi.md#giggi-4) (categories), [§5.B](../../giggi.md#giggi-5-b) (discovery), [§19](../../giggi.md#giggi-19) (homepage feed & ranking)

## Purpose

The **default entry surface** after sign-in: users browse a **best-matched** gig feed with **infinite scroll**, adjust **sort** and **scope** (location, categories, saved searches, offers-only view) without heavy chrome. Layout is **responsive**: a **fixed left navigation** on wide screens; on **mobile**, primary actions move to **top and bottom** bars and **navigation moves into a secondary menu** below the app bar.

Philosophy matches [Feed list](../components/feed-list.md): **flat feed rows**, no boxed feed container; side rails are **navigation**, not decorative cards around the stream.

## Scope (this spec)

* **In scope:** **App menu** (top), **left navigation** (desktop) / **secondary menu** (mobile), **main feed** (sort strip, refresh affordance, list behavior), **mobile bottom bar**, optional **right rail** (TBD).
* **Out of scope:** exact **weighted formulas** for “Best” / “Popular” / [§19](../../giggi.md#giggi-19) section math — stay in [`giggi.md` §19](../../giggi.md#giggi-19-interest) and related product docs; **category tree data** — stay in [`giggi.md` §4](../../giggi.md#giggi-4) (UI only describes interaction: tap category → filter + nested list).

## Layout model

| Breakpoint (conceptual) | Structure |
| --- | --- |
| **Wide (e.g. desktop / tablet landscape)** | **Fixed left nav** (does not scroll with feed) \| **Scrollable main column** (feed) \| optional **right rail** (see below) |
| **Narrow (mobile)** | **Top app menu** → **Secondary menu** (nav / filters / categories — scroll **within** this panel, not the same scroll as the feed) → **Scrollable main feed** \| **Bottom tab bar** (subset of global actions) |

The **feed body** is always the **only** major vertical scroll that loads gig rows (infinite scroll). Left nav stays **sticky/fixed** on wide screens so location and category scope remain visible while scrolling gigs.

## Top app menu (all breakpoints)

Single horizontal **app bar** (minimal height; [`ui-system.md`](../ui-system.md) §12).

| Control | Role |
| --- | --- |
| **App logo** | Tap → **Home** (this route); also **resets** Home filters to default when already on Home (same behavior as **Home** in the left nav — see below). |
| **Search** | **Primary** entry to global search (field and/or tap-to-focus); prominence above other actions in this bar. |
| **Create** | **Secondary** — primary CTA to **post / create a gig** (exact label TBD: “Create”, “+”, etc.). |
| **Inbox** | **Icon** — opens messages / notifications hub (badge rules TBD). |
| **User avatar** | Opens a **dropdown / menu** with links to **Profile**, **Settings**, and other **system** destinations (help, logout, etc.); exact list TBD per product. |

**Wide screens:** all of the above typically live in this **top** bar.

**Mobile:** **Search** may remain in the top bar or duplicate entry in bottom (product choice — avoid three competing search entry points). **Create**, **Inbox**, and **avatar** have a **home** in the **bottom tab bar** (see next section); the top bar still shows **logo** and keeps **search primary** unless product collapses search into an icon to save space.

## Mobile bottom tab bar

When viewport is **narrow**, a **bottom** navigation holds high-frequency items so the thumb can reach them:

* **Home** — this page.
* **Add** — create gig (same destination as top **Create**).
* **Inbox** — same as top inbox (one implementation; two entry points allowed with consistent badge).
* **User avatar** — opens the **same** account menu as the top avatar **or** navigates to profile (pick one pattern and document; avoid divergent menus).

**Logo** and **search** remain biased to the **top** on mobile so the brand and primary discovery path stay visible.

## Left navigation (wide screens only)

A **vertical list** in a **left column**, **fixed** (does **not** scroll with the main feed). Width: compact; typography per [`tokens.md`](../tokens.md).

**Order (top → bottom):**

1. **Location & vicinity** — e.g. **“Kamppi · 60 km”** (neighbourhood + radius or product-equivalent); tap opens location/radius editor. Must stay consistent with gig location copy rules ([`giggi.md` §3 Gig](../../giggi.md#giggi-3-gig) / [`ui-system.md`](../ui-system.md) §16).
2. **Home** — navigates to this feed; **resets filters** to default Home scope (same as logo-on-Home behavior).
3. **Gigs offer** — navigates to a feed that shows **only gig offers** (`type = OFFER` or product definition). On **mobile**, this item moves to the **bottom tab bar** or secondary menu (not duplicated in conflicting ways).
4. **Saved searches** — list appears **only if** the user has saved searches; each item runs that saved query / filter set (product TBD).
5. **Categories (first level)** — from [`giggi.md` §4](../../giggi.md#giggi-4) top-level groups. **Tap** a category: **filters the main feed** to that branch and reveals **nested (second-level) categories** in the nav (expand inline or replace list — product choice; must be keyboard- and SR-friendly).
6. **Starred categories** (logged-in only) — user can **star** categories they care about; **starred** items appear in a **separate block above** the normal category list. Starring is **per user**, not global.

**Interaction notes:**

* Active route / active filter state should be **visually indicated** (e.g. bold or accent) without relying on color alone ([`ui-system.md`](../ui-system.md) §14).
* Clearing category filter: align with **Home** reset or explicit “clear category” — document when product locks behavior.

## Secondary menu (mobile)

**Below the top app menu**, a **drawer / sheet / collapsible strip** holds most of what the **left nav** holds on desktop: **location & vicinity**, **Home** (reset), **Gigs offer**, **saved searches**, **starred + normal categories** with the same **tap → filter + nested categories** behavior.

* This panel has its **own** scroll if content is tall; it must **not** steal scroll from the **feed** when closed.
* Opening/closing: one clear control (e.g. “Menu” or filter icon) in the app bar; respect **focus trap** and **escape** when modal ([`ui-system.md`](../ui-system.md) §14).

## Main body (Home feed)

* **Content:** [Feed list](../components/feed-list.md) of **best-matched** gigs for the current scope (location, categories, saved search, etc.). **Infinite scroll**; row chrome per feed list (separators on list, not on [gig card](../components/gig-card.md) by default).
* **Sort strip** — placed **above** the scrolling feed (not inside each row). Explicit control to change ordering:

  | Mode | Intent (product refines formulas) |
  | --- | --- |
  | **Best** | Default — composite **weighted match** (location, interest, [§19](../../giggi.md#giggi-19)-style signals, cold-start rules in [`giggi.md` §19](../../giggi.md#giggi-19-interest)). |
  | **Popular** | Weighted toward **views** / engagement (define metric in product). |
  | **Latest** | **Creation date** descending. |
  | **Urgent** | **Urgency** and **expiry** (`expires_at`) drive ordering. |

  Changing sort may **reset scroll to top** (recommended) and show **light** loading (skeleton or subtle progress), not a full-screen blocker.

* **Scroll-linked refresh** — after the user scrolls **past a threshold** (depth TBD), show a **control** (e.g. floating button or compact bar) to **refresh** the feed without losing context where possible ([`ui-system.md`](../ui-system.md) §16). Complements or replaces pull-to-refresh per platform.

* **Loading / skeleton:** **lightweight** — text-first skeleton rows per feed list; avoid heavy shimmer or large spinners over the whole page.

**[§19](../../giggi.md#giggi-19) sections:** if the product still uses **sectioned** homepage blocks (Urgent Now, Nearby, …) **inside** “Best”, document whether sort modes **flatten** to one list or **keep** sections; implementation must match [`giggi.md` §19](../../giggi.md#giggi-19) once decided.

## Right rail (optional, TBD)

Add a **right column** only if the **main feed** feels **too wide** for comfortable reading (measure max line width / gig row width).

**Allowed content:** low-noise **links** only — e.g. **Privacy Policy**, **Terms of Service**, **Accessibility**, **Subscribe** / buy subscription, etc. No feed content here.

## Behavior (cross-links)

* **Ranking & sections:** [`giggi.md` §19](../../giggi.md#giggi-19).
* **Page-level ranking contract:** [Feed list — Home](../components/feed-list.md).
* **Filters** from nav apply to the **same** feed component; empty state after restrictive filters per feed list.

## States

| State | Behavior |
| --- | --- |
| Feed loading | Light skeleton in main column ([Feed list](../components/feed-list.md)) |
| Feed empty | Headline + one primary action |
| Feed error | Inline retry in main column; nav remains usable |
| Secondary menu open (mobile) | Focus management per §14; body scroll locked if modal |
| Logged out | Starred categories hidden; avatar menu shows sign-in as appropriate (TBD) |

## Accessibility & motion

* **Landmarks:** `header` (app bar), `nav` (left / secondary), `main` (feed), optional `aside` (right rail).
* **Focus order:** logical order within app bar → secondary trigger → main sort strip → feed rows.
* **Fixed left nav:** keyboard users can reach all items; skip link to **main** content recommended on wide layouts.
* **`prefers-reduced-motion`:** respect for menu transitions and refresh affordances.

## Verification checklist

- [ ] Top bar: logo, search (primary), create, inbox, avatar menu — roles and labels clear
- [ ] Mobile: bottom bar (Home, Add, Inbox, avatar) does not duplicate behavior inconsistently with top
- [ ] Left nav **fixed** on wide screens; does **not** scroll with feed
- [ ] Mobile secondary menu holds nav + categories; feed scroll independent when menu closed
- [ ] Category tap filters feed + shows nested categories; starred block above normal when logged in
- [ ] Sort modes (Best / Popular / Latest / Urgent) documented in product for formulas; UI shows active sort
- [ ] Scroll-threshold refresh + light skeletons
- [ ] Right rail only when width warrants; legal/subscribe links only
- [ ] No dead-end empty states; alignment with [`giggi.md` §19](../../giggi.md#giggi-19) for Best view
