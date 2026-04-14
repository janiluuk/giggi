# Gig Marketplace — Technical Roadmap

This document breaks [`giggi.md`](giggi.md) into **phases** and **executable steps**. It is the source of truth for implementation order and status.

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
5. **Maps (optional MVP):** provider (Mapbox, Google Maps, OpenStreetMap stack) or ship **list + filters only** in MVP and add maps later.
6. **AI default provider:** OpenAI vs Anthropic vs local — env-driven abstraction is planned; pick first provider for dev/staging.
7. **Premium / templates / monetisation:** [`giggi.md`](giggi.md) describes templates and premium limits; **MVP “Included”** does not list payments or premium. Confirm: **exclude** paid tiers and template limits from Phase A, or **include** schema + UI stubs only.
8. **Disputes in MVP:** Entity exists; full dispute workflow may be minimal. Confirm: **PENDING/COMPLETED/CANCELLED only** first, or **full DISPUTED path** with admin tooling.
9. **Double-blind review timeout:** e.g. 7 / 14 / 30 days until reveal if one party never submits — pick a default.

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
Maps to §3 **Gig**, §4 categories & intent modifiers, §9 expiration rules, §19 feed inputs, §20 posting intent.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 2.1 | Seed data: flat category tree (parent/child or single table with path) matching §4. | `PLANNED` |
| 2.2 | Schema: `gigs` with type REQUEST \| OFFER, title, description, category, tags JSON, location_type, location_data (geo + neighbourhood), compensation fields, effort_level, urgency, expires_at, created_by, status (active/closed/expired). | `PLANNED` |
| 2.3 | Align **urgency** enum with feed sections (ASAP, SCHEDULED, RECURRING, FLEXIBLE vs giggi §3 `urgency` — resolve naming in implementation). | `PLANNED` |
| 2.4 | Service: compute `expires_at` from urgency + duration estimates (§9); optional message-activity extension. | `PLANNED` |
| 2.5 | Auto-close gig when agreement created (§9). | `PLANNED` |
| 2.6 | API: create/update gig (auth + tier checks), get gig by id, list with filters (location, urgency, category). | `PLANNED` |
| 2.7 | Geo queries: index for proximity (PostGIS or earth_distance — **(DECISION)**). | `PLANNED` |
| 2.8 | Frontend: “Post” flow with **I need help** / **I offer help** (§20); gig form with intent modifiers. | `PLANNED` |
| 2.9 | Optional: **free-text first** posting step before structured form (pairs with Phase 7 AI). | `PLANNED` |
| 2.10 | Re-engagement hooks: on expiration, API/events for repost / edit / save template (template persistence may be **DEFERRED** per monetisation decision). | `PLANNED` |

---

## Phase 3 — Discovery, search, homepage feed

**Status:** `PLANNED`  
Maps to §5 Discovery, §19 homepage sections & ranking, §20 Find help / Find work.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 3.1 | API: search + filter endpoint(s); pagination. | `PLANNED` |
| 3.2 | Feed endpoint: context `find_help` vs `find_work` (filter gig type + sections). | `PLANNED` |
| 3.3 | Implement section queries: **Urgent Now**, **Nearby & Relevant**, **New Gigs**, **Flexible & Recurring** (§19–§20). | `PLANNED` |
| 3.4 | Blended score function (weights configurable): urgency, proximity, freshness, engagement placeholder, relevance placeholder. | `PLANNED` |
| 3.5 | Urgent decay (`exp(-time_since_post)` or discrete tiers) and soft quotas (§19). | `PLANNED` |
| 3.6 | Track lightweight engagement (message count, optional click events) for ranking. | `PLANNED` |
| 3.7 | Frontend: homepage tabs **Find help** \| **Find work**; sectioned lists; search bar + filters. | `PLANNED` |
| 3.8 | Optional map view (§5): **(DECISION)** provider or defer. | `PLANNED` |
| 3.9 | Small “People offering help near you” strip on Find help (§20) — optional MVP. | `PLANNED` |

---

## Phase 4 — Messaging

**Status:** `PLANNED`  
Maps to §5 Messaging, entity **Message** (§3).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 4.1 | Schema: `messages` (gig_id, sender_id, receiver_id, content, created_at); thread by gig + pair. | `PLANNED` |
| 4.2 | API: list messages for a gig (authorization: participants only); send message. | `PLANNED` |
| 4.3 | Real-time: WebSocket or SSE or polling — **(DECISION)** based on hosting and scale. | `PLANNED` |
| 4.4 | Progressive reveal of identity per conversation stage (§8) — implement fields exposed per relationship state. | `PLANNED` |
| 4.5 | Frontend: thread UI; CTA **Hire this person** (entry to agreements). | `PLANNED` |

---

## Phase 5 — Agreements (trust core)

**Status:** `PLANNED`  
Maps to §3 **Agreement**, §5 Agreement & completion flows, §6 checklist rules.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 5.1 | Schema: `agreements` (gig_id, employer_id, worker_id, scheduled_time, price, location, checklist JSON, status, timestamps). | `PLANNED` |
| 5.2 | State machine: PENDING → CONFIRMED → COMPLETED \| CANCELLED \| DISPUTED (scope **(DECISION)**). | `PLANNED` |
| 5.3 | API: create draft from gig (pre-fill time, price, checklist, location); worker confirm; lock checklist on CONFIRMED. | `PLANNED` |
| 5.4 | Trigger gig auto-close on first binding agreement (coordinate with §9). | `PLANNED` |
| 5.5 | Completion flow: employer outcome (completed / minor issues / not completed); worker confirm or dispute path **(DECISION)**. | `PLANNED` |
| 5.6 | Frontend: hire flow, agreement detail, status badges. | `PLANNED` |

---

## Phase 6 — Reviews (double-sided / double-blind)

**Status:** `PLANNED`  
Maps to §3 **Review**, §5 Review flow, §7 reputation fields.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 6.1 | Schema: `reviews` (agreement_id, reviewer, reviewee, ratings, comment, created_at); uniqueness constraints. | `PLANNED` |
| 6.2 | Business rules: both submit independently; reveal after both OR timeout **(DECISION: timeout duration)**. | `PLANNED` |
| 6.3 | API: submit review (hidden until reveal); cron/job for timeout reveal. | `PLANNED` |
| 6.4 | Aggregate user rating / review_count / dimension scores for display. | `PLANNED` |
| 6.5 | Frontend: review form post-completion; “pending / revealed” states. | `PLANNED` |

---

## Phase 7 — AI abstraction (MVP scope)

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
| 7.7 | Frontend: show AI suggestions as editable chips/fields before confirm. | `PLANNED` |

---

## Phase 8 — Reputation, cancellation, disputes (MVP depth)

**Status:** `PLANNED`  
Maps to §7, §14, §3 **Dispute**.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 8.1 | Track cancellations and no-shows from agreement outcomes. | `PLANNED` |
| 8.2 | Update user aggregates: cancellation_rate; reliability from reviews/agreements. | `PLANNED` |
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
- Full recommendation engine (§2)
- Trust scoring algorithm as advanced product (§16)
- Tier 3 ID verification (§8)
- Premium subscription features (§8) — unless promoted by **Decisions #7**
- Local LLM deployment (§16)
- Smart defaulting tab from behavior (§20 future)
- Homepage AI ranking (§19 future)

---

## Suggested execution order (dependency-aware)

1. Phase **0** → **1** → **2** (core data + auth)  
2. **3** (discovery) can overlap after **2.6** minimally  
3. **4** messaging → **5** agreements → **6** reviews  
4. **7** AI can start after **2** API exists; UI integration ties to posting/agreement steps  
5. **8** after **5–6** have stable events  
6. **9** continuous / end of MVP

---

## Changelog

| Date       | Change                    |
| ---------- | ------------------------- |
| 2026-04-13 | Initial roadmap from giggi.md |

When you approve edits, update this table and phase/step statuses as work completes.
