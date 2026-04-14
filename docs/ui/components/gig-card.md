# Gig card

**Status:** Draft

**Related:** [`ui-system.md`](../../ui-system.md) §4–5, §8, §14–16; [`tokens.md`](../tokens.md); [`giggi.md`](../../giggi.md) §3 Gig, §5.B (discovery), §8 (identity / premium)

## Purpose

One **text-first** row representing a single gig in the feed: fast to scan like a social feed, but with enough trust and transaction context to support quick decisions.

## Anatomy

*(Label regions; replace ASCII with diagram if needed.)*

```text
[ poster avatar and name or nickname ] poster identity / trust

Chip row: always + conditional chips (may wrap to a second line)

Title — full text, may wrap to multiple lines (no ellipsis truncation)

Meta: gig location · duration/date · compensation (see giggi.md §3)

Optional body snippet (description — truncated; see Truncation)

[ optional featured image ]

Footer: actions
```

## Chips (always + conditional)

* **Multiple chips** may appear together when each applies (e.g. `ASAP` + `Expires soon` + `Deep cleaning`), reflecting **different dimensions** (time intent, freshness, category, monetisation surface, etc.).
* **Always show** (when the gig has the underlying data):

  * **Deepest matched category** (e.g. `Deep cleaning`)
  * **Urgency / time intent** derived from product fields using the **canonical mapping** in [`giggi.md` “Urgency and intent modifiers (alignment)”](../../giggi.md#urgency-and-intent-modifiers-alignment) (single source of truth; avoids forked chip enums)
* **Conditional** (only when rules fire; exact thresholds TBD in product/engineering):

  * **Expires soon** (vs `expires_at` and urgency rules in [`giggi.md`](../../giggi.md) §9)
  * **Just created** (short age window after `created_at`)
  * **Featured** / **Boosted** (or equivalent) for **paid / premium** visibility where the product exposes it ([`giggi.md`](../../giggi.md) §8 Premium, §9 as relevant)
  * Other freshness or state chips as the product adds them
* **Reading order (LTR):** category → urgency / time intent → time-sensitive freshness (`Expires soon`, `Just created`, …) → promotional (`Featured`, …). Keep **text on every chip** (no color-only meaning; [`ui-system.md`](../../ui-system.md) §8, §14).
* **Layout:** chips live in one **chip row**; the row **may wrap** to avoid overflow. If a soft cap is needed later (clutter on narrow screens), define it in implementation and document here.

## Variants & data

* **Core content:** deepest matched category, title, gig location, duration and/or scheduled date, **compensation** (see below), poster identity/trust.

### Compensation (display)

Follow **[`giggi.md`](../../giggi.md) §3 Gig**: `compensation_type` (`FIXED` | `HOURLY` | `NEGOTIABLE`) and `compensation_amount` where applicable — e.g. fixed **€X**, hourly with amount or range, **Negotiable**, etc. Exact strings and formatting stay aligned with product copy rules in `giggi.md`.

### Location (gig-based)

* Always reflect the **gig’s location mode**, not viewer or creator location:

  * `Remote`
  * `At worker’s place`
  * area/neighbourhood for on-site gigs

*How strongly a gig matches a viewer* is a **ranking** concern, not card copy; see [`giggi.md` §5.B “Location mode and match breadth (ranking)”](../../giggi.md#location-mode-and-match-breadth-ranking).

### Image handling

* If the gig has images:

  * display **first / featured image**
  * keep it **secondary to text**, not dominant
* If no image:

  * no reserved space
  * layout remains text-first

### Tier rules

* **Tier 1 / Tier 2:** follow visibility rules in product spec ([`giggi.md`](../../giggi.md) §8)
* No phone or full identity on card unless allowed later

### Footer actions

* **Contact** — primary action; **primary control takes remaining horizontal space** in the footer action area.
* **Heart** — save / favorite; icon control (see **Favorite control (accessibility)** below).
* **Ellipsis (⋯)** — opens a menu for **secondary** actions (share, report, edit or delete for creator, etc.).

Hit targets and discoverability must satisfy [`ui-system.md`](../../ui-system.md) §14 (including minimum tap size and no mystery-only gestures).

### Row tap vs footer (hit hierarchy)

If the product opens **gig detail** from the card (common feed pattern):

* Taps on **Contact**, **heart**, and **ellipsis** **must not** open detail — they only fire their own action.
* Any **card-level** “open detail” behavior should attach to **body** regions (poster + chips + title + meta + snippet + image), **not** wrapping the footer strip, so hit targets do not compete.
* Do not rely on **gesture-only** or ambiguous overlaps for primary outcomes ([`ui-system.md`](../../ui-system.md) §12, §14).

If detail is **only** reachable via an explicit control (no row tap), say so in product copy; this spec still requires footer controls to remain **distinct** targets.

### Favorite control (accessibility)

* Treat the heart as a **toggle**: expose **`aria-pressed="true"`** / **`false`** (or the platform equivalent, e.g. `accessibilityState.selected` on React Native).
* **Accessible name** must **change with state** (via i18n), e.g. **“Save gig”** when not saved and **“Remove saved gig”** (or **“Unsave gig”**) when saved — not the same static label for both states.
* Optional: **`aria-label`** / description can mention outcome (“Adds this gig to your saved list”) if it does not duplicate noisy text for every row.

## Truncation

* **Title:** always show **full title**. Allow **multiple lines** as needed; do **not** truncate with ellipsis mid-line or mid-word.
* **Description / snippet:** when space is limited, shorten in an **elegant** way: prefer **sentence or word boundaries** (no hard cut mid-word or mid-sentence); avoid a raw character chop. Exact algorithm (e.g. max lines + “read more” on detail) TBD when detail screen exists.

## Content variants vs UI states

### Content / data variants

What the row **is**, driven by gig data (not loading/error chrome).

| Variant | Card behavior |
| --- | --- |
| Remote / at worker’s place / on-site | Location mode and copy explicit in meta (or equivalent); on-site uses area/neighbourhood per data |
| Urgent / scheduled / recurring / flexible | Reflected in **urgency / time intent** chip(s) and meta, not color-only |
| With / without image | Image block only when an image exists |
| Tier 1 / Tier 2 (and future tiers) | Trust row and chips per [`giggi.md`](../../giggi.md) §8 |
| Featured / boosted (when applicable) | Conditional chip + any visual accent still paired with **text** |

### UI states

| State | Behavior |
| --- | --- |
| Default | Full content per anatomy |
| Loading | Prefer parent feed skeleton ([`ui-system.md`](../../ui-system.md) §16) |
| Long description | Snippet truncated at word/sentence boundary; title unchanged |
| Menu open (ellipsis) | Secondary actions available; focus trap / escape per platform |
| Saving favorite (heart) | Optional pending/disabled feedback TBD |

## Accessibility & motion

* WCAG 2.1 AA; min **44×44 CSS px** tap targets ([`ui-system.md`](../../ui-system.md) §14)
* Urgency/freshness not **color-only** — always text on chips
* Location mode must be explicit in text
* Respect **`prefers-reduced-motion`**

## Verification checklist

* [ ] Deepest category visible (chip)
* [ ] Urgency / time intent chip present when data supports it
* [ ] Conditional chips (expires soon, just created, featured, …) only when rules say so
* [ ] Meta line readable at a glance; compensation matches `giggi.md` §3 patterns
* [ ] Full title visible (multi-line OK); snippet never ugly mid-word/mid-sentence
* [ ] Works without image
* [ ] Featured image (if present) does not dominate text
* [ ] Trust row matches tier rules
* [ ] Contact, heart, and overflow menu meet a11y and hit-target rules; heart uses **pressed** state + **distinct** save/unsave names
* [ ] If row opens detail: footer taps do not navigate; body tap target does not swallow footer hits
* [ ] Dark theme preserves structure ([`ui-system.md`](../../ui-system.md) §10)
