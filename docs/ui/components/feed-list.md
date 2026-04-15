# Feed list

**Status:** Draft  
**Related:** [`ui-system.md`](../../ui-system.md) §4, §12, §16; [Gig card](gig-card.md); [`../tokens.md`](../tokens.md); [`../screens/home.md`](../screens/home.md) (Home uses this list); [`giggi.md` §5.B](../../giggi.md#giggi-5-b) (discovery), [§19](../../giggi.md#giggi-19) (Home ranking)

## Purpose

A **full-width, vertically scrolling** surface of gigs. The list is **the** primary discovery experience: users should scroll through **many** gigs with **minimal chrome**, and **narrow scope** with filters (and optional sort) instead of fighting decorative UI.

Aligned with social feeds (e.g. Twitter / Instagram timeline): **no boxed cards**, no nested “card in card” padding philosophy — **flat rows**, calm typography, **separators** between items so each [gig card](gig-card.md) reads as a **row**, not a floating panel.

## Product philosophy (this surface)

* **Engage through content**, not through ornamental components (gradients, heavy shadows, rounded boxes around every row).
* **Infinite scroll** (or equivalent “load more” that feels continuous) so discovery does not stop at a page boundary.
* **Filters** (and when relevant **sort**) let the user **define scope**; defaults depend on **which screen** owns the list (see below).
* **Page-specific ranking**, not one global ordering: each route passes its own **sort / ranking contract** into the same list UI.

## Page variants (sort / ranking contract)

The **list shell** (scroll, skeletons, empty/error, filters) is shared; **how items are ordered** is defined **per page** (or per tab inside a page). Examples:

| Context | Ordering / relevance intent |
| --- | --- |
| **Home** | **Best match** (default **Best** sort) — shell, nav, and **sort strip**: [`screens/home.md`](../screens/home.md). Base ranking and [§19](../../giggi.md#giggi-19) sections: [`giggi.md` §19](../../giggi.md#giggi-19). UI stays agnostic to exact weights. |
| **Search** | **Relevance to query** (text + structured signals); may combine with light personalization later — contract stays “search owns ranking.” |
| **Favorites / saved** | **Latest first** among **still-active** gigs (exclude expired / closed per product rules); user expects recency, not match score. |
| **Other feeds** | Each screen documents its own contract (e.g. “posted by me”, category browse) in product docs and passes it into the list. |

**Sortable / filterable:** filters are **first-class** on or above the list; **sort** may be explicit (control or sheet) where the product allows multiple orderings on that page. **Home** exposes an explicit **sort strip** (Best, Popular, Latest, Urgent) — see [`screens/home.md`](../screens/home.md).

## Anatomy (minimal chrome)

* **Optional top region:** compact filter entry (chips row, icon opening a filter sheet, or search field) — **one** visual band; avoid stacked heavy toolbars.
* **Scroll region:** edge-to-edge **column** of gig **rows** (each row = one [gig card](gig-card.md)).
* **No** outer “inset card” wrapping the whole feed; horizontal padding follows **safe area / screen** only, not a boxed feed container.
* **Row separation:** **list owns** the separator between rows (see **Row chrome** below).

## Row chrome (separators — list vs card)

* **Define at feed-list level:** use a **single bottom border** (or hairline) **between rows** from the **list** (e.g. `border-bottom` on each row wrapper, or `divide-y` pattern on the scroll container). That keeps one source of truth for “timeline rhythm” and avoids double lines when a gig card is reused elsewhere (detail, preview) without a feed border.
* **Gig card** does **not** assume a feed border; it stays a **content module**. If a variant ever needs an inset card (e.g. modal), that context adds its own chrome — not the default feed.

Cross-reference: [Gig card — Feed context](gig-card.md#feed-context) (no elevated surface in feed).

## Behaviors

### Infinite scroll

* Load the next page **before** the user hits the hard bottom when possible (threshold TBD).
* **End of list:** short, non-intrusive line (“You’re up to date”) or nothing; optional small spinner only while fetching — avoid large blocking footers.
* Preserve **scroll position** on background refresh when feasible (`ui-system.md` §16).

### Filters & scope

* Filters **narrow the set**; changing filters should show **clear loading** (skeleton or subtle progress) and **preserve** user orientation where possible (e.g. scroll to top on “apply” is acceptable if documented).
* Empty state after filters: headline + **one** primary action (clear filters, widen area) per `ui-system.md` §16.

### Sort (when exposed)

* Sort is **per page**: only show controls where multiple orderings are product-approved; label the active ordering clearly for screen readers.

## States

| State | Behavior |
| --- | --- |
| Loading (initial) | **Skeleton** rows matching **real row height**; text-first blocks, not image placeholders (`ui-system.md` §16) |
| Loading (next page) | Small inline indicator at bottom; do not replace the whole list |
| Empty | Short headline + **one primary action** (`ui-system.md` §16) |
| Error | **Inline retry**; preserve **scroll position** where possible after successful retry (`ui-system.md` §16) |
| End of list | Quiet end state or minimal copy (see Infinite scroll) |

## Localization

EUR, 24h time, location formatting — see [`../tokens.md`](../tokens.md).

## Accessibility & motion

* Focus order: filters (if any) → first row → …; **row** navigation predictable (`ui-system.md` §14).
* **Separators** are decorative; structure comes from **headings** / row semantics (list or listbox pattern per platform).
* No autoplaying or heavy motion in the feed; honor **`prefers-reduced-motion`** (`ui-system.md` §14).

## Verification checklist

- [ ] No boxed “card around the whole feed”; rows feel flat like a social timeline
- [ ] Row separators come from the **list**, not duplicated on every gig card by default
- [ ] Infinite scroll + end-of-list behavior are calm and non-blocking
- [ ] Home vs search vs favorites (etc.) each document or receive the correct **ranking contract**
- [ ] Skeleton height matches live row (no large layout jump)
- [ ] Empty state after filters is never a dead end
- [ ] Error + retry without losing scroll when feasible
