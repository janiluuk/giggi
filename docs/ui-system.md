# UI System — Gig Marketplace

## 1. Purpose

Define a **simple, consistent UI** that:

* feels familiar (like social feeds)
* builds trust (like marketplaces)
* works for both Gen Z and older users
* stays fast and low-friction

**Implementation detail** (tokens, per-component specs, style-book index): [`ui/README.md`](ui/README.md).

---

## 2. Core Principle

> Build a **text-first opportunity feed** with marketplace-level trust.

---

## 3. Inspiration (What We Learn From Others)

### Vinted

**Use:**

* clean layout
* strong trust signals (price, user, rating)
* clarity and predictability

**Avoid:**

* image-first dependency
* grid-based browsing

---

### Depop

**Use:**

* social, scrollable discovery
* lightweight interaction feel

**Avoid:**

* chaotic layouts
* over-reliance on visuals

---

### Feed Platforms (Twitter / Reddit / LinkedIn)

**Use:**

* vertical feed
* fast scanning
* text-first content

---

## 4. Layout Model

* Vertical feed (no grid)
* Each item = one gig
* Clean spacing, minimal decoration
* Image optional (never required)

---

## 5. Gig Card (Example)

```plaintext
[ ⚡ ASAP ] [ Cleaning ]

Clean 1-bedroom apartment today

📍 Kamppi, Helsinki
⏱ 1–3h
💰 €60

Looking for someone reliable. Basic cleaning only.

👤 Anna (⭐ 4.8)
💬 3 messages
```

---

## 6. Typography

### Principle

> Typography carries the UI — not decoration.

---

### Font Style

Use a **modern, neutral sans-serif** similar to:

* Twitter (X)
* Facebook
* system UI fonts

---

### Recommended Stack

```css
font-family:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  Roboto,
  Helvetica,
  Arial,
  sans-serif;
```

---

### Why this works

* Familiar to all users
* Highly readable on all devices
* Fast loading (no external dependency)
* Feels native on iOS, Android, and web

---

## 7. Visual Style

* White background by default
* Subtle highlights for urgency
* No heavy shadows or complex cards
* Typography defines structure

---

## 8. Icons

### Principle

> Icons support meaning — they do not carry it.

---

### Approach

* Use a clean, consistent icon style (e.g. Lucide)
* Use stronger/filled icons only for emphasis (urgent, active)

---

### Guidelines

**Do:**

* pair icons with text
* use icons consistently

**Don’t:**

* rely on icons alone
* mix styles randomly
* overuse icons

---

## 9. Images

* Optional only
* Show if available
* Never reserve space for missing images

---

## 10. Themes (Light / Dark)

### Principle

> Both themes must feel equally natural — not inverted hacks.

---

### Light Theme (Default)

* White background
* Dark text
* Minimal accents

---

### Dark Theme

* Dark gray background (not pure black)
* Soft contrast (avoid harsh white text)
* Preserve readability and calmness

---

### Rules

* Do not increase visual noise in dark mode
* Maintain same layout and spacing
* Only adjust colors, not structure

---

## 11. What We Avoid

* Grid-based browsing
* Image-first UI
* Over-designed cards
* Visual clutter
* Hidden interactions

---

## 12. UX Principles

* Fast to use (< 60s to post)
* Easy to scan
* Clear next actions
* No forced roles

---

## 13. Design Summary

> Clean like Vinted
> Scrollable like social feeds
> Structured for fast decisions

---

## 14. Accessibility & motion

* **Contrast:** meet **WCAG 2.1 AA** for text and interactive labels in both themes (check primary buttons, chips, and dark-mode grays).
* **Focus:** visible **focus rings** for keyboard users; focus order follows reading order in the feed and modals.
* **Touch targets:** minimum **44×44 CSS px** (or equivalent) for tappable rows, chips, and icon buttons; avoid tight hit areas in card metadata rows.
* **Urgency / state:** do **not** rely on **color alone** for urgency or status — pair with **text** (e.g. “ASAP”) and/or **icons** as already required in §8.
* **Motion:** respect **`prefers-reduced-motion`**: avoid large parallax, long auto-animations, and autoplaying motion in the feed; keep transitions subtle or instant when reduced motion is on.

---

## 15. Spacing, type scale & trust on cards (tier-aware)

### Spacing & rhythm

* **Base grid:** **4px**; use **8, 12, 16, 24** (multiples of 4) for vertical gaps, card padding, and section spacing so the feed stays even across breakpoints.
* **Type scale (targets):** **one strong title** (feed title line), **one meta line** (location / time / price), **one optional body** (snippet) — roughly **~17–20px / ~600** for title, **~13–14px / ~400–500** for meta and body on mobile; adjust slightly for tablet/desktop but keep the same hierarchy.

### Identity & trust (align with product tiers)

* Cards must follow **visibility rules** from the product spec ([`giggi.md` §8](giggi.md#giggi-8)): **Tier 1** = lighter trust surface (e.g. nickname, optional “new” / limited cues); **Tier 2** = show **phone-verified** affordance where policy allows and show **rating / review aggregates** when the product exposes them publicly.
* Do **not** show phone numbers or full identity on the **feed card** unless the agreement/messaging stage allows it (progressive reveal stays in deeper views).

---

## 16. Feed states, localization & emoji vs icons

### Loading, empty, and error

* **Loading:** **skeleton** rows that match **real card height** (text-first blocks, not image placeholders) to avoid layout jump.
* **Empty:** short **headline** + **one primary action** (e.g. clear filters, change area, or post) — no dead-end screens.
* **Error:** **inline retry** on the feed or section; preserve **scroll position** where possible after successful retry.

### Localization (Finland-first)

* **Currency:** **EUR (€)** with consistent formatting.
* **Time:** prefer **24-hour** clock and explicit **date + time** when scheduling matters.
* **Location line:** **Neighbourhood, City** (or product-equivalent fields), consistent with backend `location_data`.

### Emoji vs Lucide in shipped UI

* **Mockups** may use emoji (as in §5) for speed.
* **Product UI:** prefer **Lucide (or chosen set) + text** per §8; avoid mixing random emoji in components unless product standardizes them (e.g. marketing-only surfaces).

---

END
