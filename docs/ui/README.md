# UI specs & style book index

This folder holds **implementable** UI detail: tokens, per-component requirements, and verification notes. Principles and product-wide rules stay in [`../ui-system.md`](../ui-system.md). End-to-end user paths (auth, routing) are charted in [`../journeys/`](../journeys/). Cross-cutting behaviour (soft disputes, payment timing/method on listings vs agreements): [`../system-rules.md`](../system-rules.md) — use section anchors from the table of contents.

**Copy and roles:** the UI must **not** present “worker” or “client” as permanent identities. Use **names** and natural questions (e.g. *“How was your experience with Anna?”*, not *“Leave feedback for your client”*). **Worker** / **client** in specs refer to **agreement context** only — [`../giggi.md` §1.2](../giggi.md#giggi-1-2).

**Trust display (MVP):** show **average stars + review count** (e.g. `⭐ 4.7 (32 reviews)`). Show **qualitative** trust only (**Reliable** / **New** / **Low activity**, etc.) — **never** the numeric composite formula in the product UI. Spec: [`../giggi.md` §7.1](../giggi.md#giggi-7-1).

**Ranking (MVP):** feeds and search use **weighted interest scores** by context — **do not** expose raw scores or weights in the UI; use order, sections, and light labels. Spec: [`../giggi.md` §19 (MVP weighted interest score)](../giggi.md#giggi-19-interest).

## Contents

| Doc | Role |
| --- | --- |
| [`tokens.md`](tokens.md) | Spacing, type scale, semantic colors — contract for implementation |
| [`components/`](components/) | Reusable UI pieces; states, anatomy, accessibility |
| [`screens/home.md`](screens/home.md) | Full-screen compositions (e.g. Home shell + feed) |

## Component status

| Component | Spec status | Living book (stories) |
| --- | --- | --- |
| [Gig card](components/gig-card.md) | Draft | Not wired — stack TBD |
| [Feed list](components/feed-list.md) | Draft | Not wired — stack TBD |
| [Home](screens/home.md) | Draft | Not wired — stack TBD |

Update the **Spec status** column as specs stabilize (`Draft` → `Agreed` → `Implemented` when code exists).

## Platform parity (web vs native)

One row per **surface or component**; spec is the source of truth. Platform columns track **implementation** only.

| Surface / component | Spec | Web | iOS | Android | Notes |
| --- | --- | --- | --- | --- | --- |
| [Tokens](tokens.md) | Draft | — | — | — | Map tokens per platform (CSS, Swift, Kotlin, …). |
| [Gig card](components/gig-card.md) | Draft | — | — | — | |
| [Feed list](components/feed-list.md) | Draft | — | — | — | |
| [Home (shell + feed)](screens/home.md) | Draft | — | — | — | App bar (logo, search, create, inbox, avatar); **fixed left nav** / **mobile secondary menu** (location, Home reset, offers, saved searches, categories + starred); **mobile bottom tabs**; feed + **sort strip** (Best / Popular / Latest / Urgent) + scroll refresh; optional **right rail**. Ranking: [`giggi.md` §19](../giggi.md#giggi-19) + [feed list](components/feed-list.md). |
| Gig detail | *TBD* | — | — | — | |
| Search (results list) | *TBD* | — | — | — | Reuses feed list + card; ranking differs per `feed-list.md`. |

**Platform column values:** `—` not started · `Planned` · `Shipped` · `N/A` (no app / out of scope).

**Native exceptions:** when a platform **must** diverge (e.g. Material vs HIG), change the cell to `Shipped*` and add one line under **Notes** — do not fork the main spec silently.
