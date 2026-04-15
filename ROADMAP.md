# Gig Marketplace — Technical Roadmap

This document breaks [`giggi.md`](giggi.md) into **phases** and **executable steps**. It is the source of truth for implementation order and status.

**Companion docs:** [User journeys](docs/journeys/README.md) · [System rules](docs/system-rules.md) (soft disputes, payment fields, messaging concurrency, pointers to trust/ranking) · [Personas](docs/personas/README.md) (worker / client, contextual roles).

## Product Principles (Guiding Implementation)

- Mobile-first UX, web-first implementation (PWA)
- AI-assisted flows are core, not optional
- **Ranking & relevance (MVP):** ordering uses **weighted interest scores** that depend on **context** (gig feed vs gig search vs worker search vs profile lists) — [`giggi.md` §19](giggi.md) (*MVP weighted interest score*). **Gig discovery feed:** **location** has the **largest default weight** but is **one of several** signals (urgency, freshness, category, trust; engagement in *Nearby & Relevant* per §19). **Trust** for ranking comes from the **§7.1 composite** (reviews + completion + behaviour), not stars alone — UI still shows honest **average stars + count** plus qualitative chips (§7.1).
- **Roles in product:** **Worker** / **client** are **agreement-context** labels in docs and schema — not permanent profile types; UI favours **names** and natural copy ([`giggi.md` §1.2](giggi.md)).
- Simplicity over infrastructure complexity in MVP
- Design for future real-time, but start with pragmatic implementations

## How to use status

Update the line under each **phase** or **step** as work progresses:

| Status        | Meaning                                      |
| ------------- | -------------------------------------------- |
| `PLANNED`     | Not started                                  |
| `IN_PROGRESS` | Active work                                  |
| `DONE`        | Complete and verified                        |
| `BLOCKED`     | Waiting on dependency or decision            |
| `DEFERRED`    | Explicitly moved to later phase / out of MVP |

**Current snapshot (initial):** all items `PLANNED` until you change them after review.

---

## Decisions needed before or during execution

Answer these when you can; steps that depend on them are marked **(DECISION)**.

1. **Backend framework:** NestJS vs Express (or other) — [`giggi.md` §15](giggi.md) lists both.
2. **Hosting:** managed cloud (e.g. Fly, Railway, AWS) vs self-hosted — affects CI, secrets, and ops steps.
3. **Phone verification (Finland):** SMS/WhatsApp provider and budget (Twilio, Vonage, local FI provider, etc.).
4. **OAuth:** Google-only for social auth, or additional providers from day one?
5. **Maps (resolved for MVP):** No **browse / homepage / discovery map** of gigs in MVP — **list + search + filters** only. Location based search and ranking is core. Optional **single-gig detail** map only: **OpenStreetMap** stack (Leaflet or MapLibre). Provider choice for **later** browse maps (if any) is non-blocking.
6. **AI default provider:** OpenAI vs Anthropic vs local — env-driven abstraction is planned; pick first provider for dev/staging.
7. **Premium / templates / monetisation:** [`giggi.md`](giggi.md) describes templates and premium limits; **MVP “Included”** does not list payments or premium. Confirm: **exclude** paid tiers and template limits from Phase A, or **include** schema + UI stubs only.
8. **Disputes in MVP:** Entity exists; full dispute workflow may be minimal. Confirm: **PENDING/COMPLETED/CANCELLED only** first, or **full DISPUTED path** with admin tooling.
9. **Double-blind review timeout:** **Resolved** — **7-day** auto-reveal; **immediate reveal** when both parties have submitted. Tunable via config for experiments (see Phase 6).
10. **One-sided feedback visibility:** [Feedback flow](docs/journeys/feedback-flow.md) uses a **3-day** auto-publish path; **reconcile** with §5.F / Phase 6 **7-day** language in **one config surface** before ship.

---

## Platform Strategy

### Phase A (MVP)
- Web application (Next.js), mobile-first responsive design
- PWA support (installable on mobile)

### Phase B
- Native iOS app (React Native or wrapper)
- Android (later)

### Requirements
- All APIs must be mobile-compatible from day one
- UI components designed for touch-first interaction

---

## Phase 0 — Project foundation

**Status:** `PLANNED`

Goal: repo, tooling, environments, and conventions so later phases plug in cleanly.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 0.1 | Initialize monorepo or single app per **(DECISION)** stack (Next.js app + API package or combined). | `PLANNED` |
| 0.2 | TypeScript, lint, format, test runner; pre-commit optional. | `PLANNED` |
| 0.3 | Environment config pattern (`AI_PROVIDER`, DB URLs, OAuth secrets) — no secrets in repo. | `PLANNED` |
| 0.4 | Docker Compose (or equivalent): PostgreSQL + Redis for local dev. | `PLANNED` |
| 0.5 | Database migration tool (e.g. Prisma, Drizzle, TypeORM — align with framework **(DECISION)**). | `PLANNED` |
| 0.6 | CI pipeline: lint + test on push (provider **(DECISION)** with hosting). | `PLANNED` |

---

## Phase 1 — Authentication & user system

**Status:** `PLANNED`
Maps to [`giggi.md` §18 item 1](giggi.md), entities **User** / **Profile** (§3), identity **Tier 1–2** (§8).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 1.1 | PostgreSQL schema: `users` (id, nickname, email, phone, flags, rating aggregates placeholder, cancellation fields, timestamps). | `PLANNED` |
| 1.2 | Schema: `profiles` (user_id, bio, skills, resume_data JSON, visibility_level). | `PLANNED` |
| 1.3 | Email + password auth **or** magic link — confirm product preference **(DECISION)** if not specified in giggi. | `PLANNED` |
| 1.4 | Google OAuth integration. | `PLANNED` |
| 1.5 | Session/JWT strategy; secure cookies if web; CSRF where applicable. | `PLANNED` |
| 1.6 | Phone verification flow (Finland-first): send code, verify, set `is_phone_verified`, **Tier 2** capabilities flag. | `PLANNED` |
| 1.7 | API: register, login, logout, current user, profile CRUD. | `PLANNED` |
| 1.8 | Enforce **Tier 1 vs Tier 2** rules on endpoints (browse/message/post limits, sensitive categories blocked for Tier 1) per §8. | `PLANNED` |
| 1.9 | Frontend: auth screens, profile basics, verification UI. | `PLANNED` |

---

## Phase 2 — Categories, gigs, expiration

**Status:** `PLANNED`
Maps to §3 **Gig** (including optional **payment timing / method** hints — [System rules — Payment timing](docs/system-rules.md#payment-timing)), §4 categories & intent modifiers, §9 expiration rules, §19 feed inputs, §20 posting intent.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 2.1 | Seed data: flat category tree (parent/child or single table with path) matching §4. | `PLANNED` |
| 2.2 | Schema: `gigs` with type REQUEST \| OFFER, title, description, category, tags JSON, location_type, location_data (geo + neighbourhood), compensation fields, effort_level, urgency, expires_at, created_by, status (active/closed/expired). | `PLANNED` |
| 2.3 | Align **urgency** enum with feed sections (ASAP, SCHEDULED, RECURRING, FLEXIBLE vs giggi §3 `urgency` — resolve naming in implementation). | `PLANNED` |
| 2.4 | Service: compute `expires_at` from urgency + duration estimates (§9); optional message-activity extension. | `PLANNED` |
| 2.5 | Auto-close gig when agreement created (§9). | `PLANNED` |
| 2.6 | API: create/update gig (auth + tier checks), get gig by id, list with filters (location, urgency, category). | `PLANNED` |
| 2.7 | Location system: store lat/lng + neighbourhood; basic radius queries (no PostGIS in MVP). | `PLANNED` |
| 2.8 | Frontend: “Post” flow with **I need help** / **I offer help** (§20); gig form with intent modifiers. | `PLANNED` |
| 2.9 | Optional: **free-text first** posting step before structured form (pairs with Phase 7 AI). | `PLANNED` |
| 2.10 | Re-engagement hooks: on expiration, API/events for repost / edit / save template (template persistence may be **DEFERRED** per monetisation decision). | `PLANNED` |
| 2.11 | **Optional** gig-detail map only (no discovery map in MVP): OpenStreetMap (Leaflet or MapLibre), single gig’s location on **gig detail** screen. Browse / feed / homepage stays **list + search + filters** — no map of many gigs. | `PLANNED` |

---

## Phase 3 — Discovery, search, homepage feed

**Status:** `PLANNED`
Maps to §5 Discovery, **§19** homepage sections & **MVP weighted interest** (default gig-feed blend + search / profile variants), **§7.1** trust as a rank input, §20 Find help / Find work.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 3.1 | API: search + filter endpoint(s); pagination. | `PLANNED` |
| 3.2 | Feed endpoint: context `find_help` vs `find_work` (filter gig type + sections). | `PLANNED` |
| 3.3 | Implement section queries: **Urgent Now**, **Nearby & Relevant**, **New Gigs**, **Flexible & Recurring** (§19–§20). | `PLANNED` |
| 3.4 | **Blended interest score** per §19: normalise factors to 0–1; **default gig discovery blend** (starting weights, config-tunable): `location 0.30 + urgency 0.25 + freshness 0.20 + category 0.15 + trust 0.10` (+ **engagement** term for *Nearby & Relevant* per §19 ranking blend / cold-start rules). Implement **separate** ranking paths for **gig search**, **worker search**, and **profile / worker lists** per §19 priority tables. **Do not** expose raw scores in UI ([`docs/ui/README.md`](docs/ui/README.md)). | `PLANNED` |
| 3.5 | Urgent decay (`exp(-time_since_post)` or discrete tiers) and soft quotas (§19). | `PLANNED` |
| 3.6 | Track lightweight engagement (message count, optional click events) for ranking. | `PLANNED` |
| 3.7 | Frontend: homepage tabs **Find help** \| **Find work**; sectioned lists; search bar + filters (**no map view** for gigs in MVP — aligns with §5 / Decision #5). | `PLANNED` |
| 3.8 | Small “People offering help near you” strip on Find help (§20) — optional MVP. | `PLANNED` |

---

## Phase 4 — Messaging

**Status:** `PLANNED`
Maps to §5 Messaging, entity **Message** (§3).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 4.1 | Schema: `messages` (gig_id, sender_id, receiver_id, content, created_at); **threading** must support **many concurrent conversations** per user ([System rules — Messaging concurrency](docs/system-rules.md#messaging-concurrency)) — prefer `conversation_id` (or gig + pair + uniqueness rules) rather than assuming one thread per user pair. | `PLANNED` |
| 4.2 | API: list messages for a gig (authorization: participants only); send message. | `PLANNED` |
| 4.3 | Real-time strategy:
- MVP: polling
- Phase B: WebSocket upgrade (same API contract) | `PLANNED` |
| 4.4 | Progressive reveal of identity per conversation stage (§8) — implement fields exposed per relationship state. | `PLANNED` |
| 4.5 | **Notifications — email (MVP):** new message, agreement lifecycle updates; wire to message/agreement events (requires 4.2 + later 5.x events). | `PLANNED` |
| 4.6 | **Notifications — in-app (MVP):** store/display notification feed; mark read; link deep into thread or agreement. | `PLANNED` |
| 4.7 | **Push notifications:** Phase B with native apps (same event sources as 4.5–4.6). | `PLANNED` |
| 4.8 | Frontend: thread UI; CTA **Hire this person** (entry to agreements). | `PLANNED` |

---

## Phase 5 — Agreements (trust core)

**Status:** `PLANNED`
Maps to §3 **Agreement**, §5 Agreement & completion flows, §6 checklist rules.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 5.1 | Schema: `agreements` (gig_id, **client_id**, worker_id, scheduled_time, price, location, checklist JSON, status, timestamps — `employer_id` legacy alias). | `PLANNED` |
| 5.2 | State machine (MVP):
PENDING → CONFIRMED → COMPLETED | CANCELLED
DISPUTED deferred to Phase B | `PLANNED` |
| 5.3 | API: create draft from gig (pre-fill time, price, checklist, location); worker confirm; lock checklist on CONFIRMED. | `PLANNED` |
| 5.4 | Trigger gig auto-close on first binding agreement (coordinate with §9). | `PLANNED` |
| 5.5 | Completion flow: symmetric two-sided claims (see `giggi.md` §5.E + gig-completion journey); legacy “employer-first” wording **obsolete**. | `PLANNED` |
| 5.6 | Frontend: hire flow, agreement detail, status badges. | `PLANNED` |

---

## Phase 6 — Reviews (double-sided / double-blind experiment in MVP)

**Status:** `PLANNED`

Treat double-blind as an **experiment**, not a final immutable system: ship early, measure, keep flags/config so behavior can change post-MVP.

Maps to §3 **Review**, §5 Review flow (§5.F), §7 reputation fields.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 6.1 | Schema: `reviews` (agreement_id, reviewer, reviewee, ratings, comment, timestamps); **pre-reveal** storage (content hidden to counterparty); uniqueness per agreement+reviewer; fields to support **edit until reveal** and **reveal reason** (mutual vs timeout). | `PLANNED` |
| 6.2 | **MVP rules (double-blind):** After eligible completion, each party may submit a review; **counterparty cannot see** that review until reveal. **Immediate reveal** when **both** have submitted. **Auto-reveal** after **7 days** from first submission window start (or from agreement completion — pick one rule in implementation and document). Reviews **editable by author until reveal** (then lock). | `PLANNED` |
| 6.3 | API: create/update review (pre-reveal); validation for edit-until-reveal; reveal endpoint or internal transition on dual-submit; no partial visibility of peer’s text before reveal. | `PLANNED` |
| 6.4 | Job/cron: **7-day** timeout → reveal whatever is present (one-sided reveal allowed after timeout — product: show single review if only one submitted). | `PLANNED` |
| 6.5 | Aggregate user rating / review_count / dimension scores **from revealed reviews only** (or document if one-sided counts). | `PLANNED` |
| 6.6 | Frontend: post-completion review composer; **draft / waiting for peer / revealed** UX; edit until reveal; clear copy that this is an early trust experiment. | `PLANNED` |
| 6.7 | **Experiment metrics** (instrument + dashboard or export): **% of users who submit a review**; **% one-sided reviews**; **time to second review**; **% revealed by mutual submit vs timeout**; **rating variance** (or distribution) for **mutual vs timeout** cohorts; optional funnel from “completion” → “opened review form” → “submitted”. | `PLANNED` |

---

## Phase 7 — AI abstraction (Core MVP feature)

**Status:** `PLANNED`
Maps to §10–§12, §5 posting AI assist, §13 moderation flags.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 7.1 | Define `AIService` interface: classify(text), generateChecklist (and any tagging helpers). | `PLANNED` |
| 7.2 | Implement one provider (OpenAI or Anthropic **(DECISION)**) behind env `AI_PROVIDER`. | `PLANNED` |
| 7.3 | Wire triggers: on gig submit (suggestions), on agreement creation (checklist assist) — never auto-apply without user confirm (§11). | `PLANNED` |
| 7.4 | Model routing: cheaper model for classification/tagging; stronger for checklist (§12). | `PLANNED` |
| 7.5 | Caching for repeated prompts (Redis) (§12). | `PLANNED` |
| 7.6 | Moderation: AI flag + reduce visibility / flag for manual review — no auto-ban (§13). | `PLANNED` |
| 7.7 | AI triggers:
- on gig submit (category + tags + checklist suggestion)
- on agreement creation (checklist refinement)
User must confirm all AI outputs. | `PLANNED` |
| 7.8 | AI-assisted search: expand user queries (synonyms, intent matching). | `PLANNED` |

---

## Phase 8 — Reputation, cancellation, disputes (MVP depth)

**Status:** `PLANNED`
Maps to **§7.1** trust composite, §7 metrics, §14, §3 **Dispute**, [soft disputes](docs/system-rules.md#soft-disputes).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 8.1 | Track cancellations, no-shows, completion mismatch, and related signals from agreement + completion flows (feeds §7.1 inputs). | `PLANNED` |
| 8.2 | Compute **§7.1 `trustComposite`** (configurable weights); persist aggregates for **ranking** (§19) and UI (**stars + review count** + qualitative chips only — never expose raw composite formula in UI). | `PLANNED` |
| 8.3 | Soft penalties: visibility reduction, posting cooldown (rules engine, configurable). | `PLANNED` |
| 8.4 | Schema + API for **Dispute** minimal path **(DECISION)** vs full workflow. | `PLANNED` |

---

## Phase 9 — Polish, ops, launch prep

**Status:** `PLANNED`

| Step | Description | Status |
| ---- | ----------- | ------ |
| 9.1 | Rate limiting, abuse basics, audit logs for sensitive actions. | `PLANNED` |
| 9.2 | Error monitoring and logging (provider **(DECISION)**). | `PLANNED` |
| 9.3 | Seed/staging data; E2E smoke tests for critical flows (post → message → hire → complete → review). | `PLANNED` |
| 9.4 | Performance pass on feed and geo queries. | `PLANNED` |
| 9.5 | Accessibility and mobile-first pass on main flows. | `PLANNED` |

---

## Phase B — Explicitly out of MVP (from giggi.md)

**Status:** `DEFERRED` (not in Phase A execution until roadmap amendment)

- Payments / escrow (§2, §16)
- Advanced moderation AI, AI dispute resolution (§2, §16)
- Full **ML** recommendation / learning-to-rank (beyond §19 **hand-tuned** weighted interest + §7.1 trust composite in MVP) (§2, §16)
- Deep **personalisation** (behavioural profiles beyond current signal set) (§16)
- Tier 3 ID verification (§8)
- Premium subscription features (§8) — unless promoted by **Decisions #7**
- Local LLM deployment (§16)
- Smart defaulting tab from behavior (§20 future)
- **Discovery / feed map view** (map + list sync, many gigs on map) — MVP per Decision #5 is list/search/filters only; optional single-gig map is Phase 2 **2.11** only

---

## Suggested execution order (dependency-aware)

1. Phase **0** → **1** → **2** (core data + auth)
2. **3** (discovery) can overlap after **2.6** minimally
3. **4** messaging — includes **4.5–4.7 notifications** once message send (4.2) exists; **4.5 email** and **4.6 in-app** tighten after **5** if agreement emails need agreement state hooks
4. **5** agreements → **6** reviews (double-blind experiment + metrics)
5. **7** AI can start after **2** API exists; UI integration ties to posting/agreement steps
6. **8** after **5–6** have stable events
7. **9** continuous / end of MVP

**Clarification:** Steps **4.5–4.7** are **part of Phase 4** (not a separate phase number). Implement **in-app notifications (4.6)** early enough to surface message events; **email (4.5)** can follow the same event bus.

---

## Changelog

| Date       | Change                    |
| ---------- | ------------------------- |
| 2026-04-13 | Initial roadmap from giggi.md |
| 2026-04-14 | Double-blind MVP experiment (7d timeout, mutual reveal, edit until reveal, metrics); no discovery map MVP, OSM optional on gig detail only; notifications folded into Phase 4 as 4.5–4.7; Decision #5/#9 aligned |
| 2026-04-15 | Product principles: ranking = context-weighted interest (§19), trust = §7.1 composite (not locality-only). Phase 3.4 / 8.x / 4.1 / Phase B aligned; companion docs + Decision #10 (3d vs 7d feedback); payment hints Phase 2 |

When you approve edits, update this table and phase/step statuses as work completes.
