# Gig Marketplace — Technical Roadmap

This document breaks [`giggi.md`](giggi.md#giggi-1-1) into **phases** and **executable steps**. It is the source of truth for implementation order and status.

**Companion docs:** [User journeys](docs/journeys/README.md) · [System rules](docs/system-rules.md) (soft disputes, payment fields, messaging concurrency, trust/ranking pointers) · [UI specs](docs/ui/README.md) (tokens, components, home shell, parity table) · [Personas](docs/personas/README.md) (worker / client, contextual roles).

## Product Principles (Guiding Implementation)

- Mobile-first UX across web and native surfaces
- AI-assisted flows are core, not optional
- **Ranking & relevance (MVP):** ordering uses **weighted interest scores** that depend on **context** (gig feed vs gig search vs worker search vs profile lists) — [`giggi.md` §19 — MVP weighted interest score](giggi.md#giggi-19-interest). **Gig discovery feed:** **location** has the **largest default weight** but is **one of several** signals (urgency, freshness, category, trust; engagement in *Nearby & Relevant* per [§19](giggi.md#giggi-19-ranking-blend)). **Trust** for ranking comes from the **[§7.1](giggi.md#giggi-7-1) composite** (reviews + completion + behaviour), not stars alone — UI still shows honest **average stars + count** plus qualitative chips ([§7.1](giggi.md#giggi-7-1)).
- **Roles in product:** **Worker** / **client** are **agreement-context** labels in docs and schema — not permanent profile types; UI favours **names** and natural copy ([`giggi.md` §1.2](giggi.md#giggi-1-2)).
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

## Definition of done (applies to every phase)

- Functional implementation merged behind stable schema/API contracts.
- Automated tests added at the right level (unit + integration; E2E where the phase introduces a cross-surface flow).
- UI-affecting changes include screenshots in `docs/screenshots/phase-<n>/...` for key states (mobile + desktop where relevant; light/dark when specified).
- GitHub workflow checks are updated so new tests run in PRs; screenshot artifacts are uploaded on failure (or on baseline refresh workflow).
- Mobile-impacting changes also pass both platform builds (`ios` and `android`) before merge.
- Docs updated when behavior changed (journey, system-rule, UI spec, or roadmap step text).

---

## Decisions made

These execution decisions are now locked into the roadmap.

1. **Backend framework:** use **Next.js** for the backend/application layer in Phase A (single stack, shared types/contracts).
2. **Hosting:** deploy to a **self-hosted local cluster**; CI/CD must be able to deploy there once credentials are provided.
3. **Phone verification (Finland):** implement a **budget-first provider adapter** so the cheapest FI-compatible SMS provider can be swapped via config/env later.
4. **OAuth:** **Google-only** initially; additional providers deferred.
5. **Maps (resolved for MVP):** No **browse / homepage / discovery map** of gigs in MVP — **list + search + filters** only. Optional **single-gig detail** map uses **OpenStreetMap** now; other providers can be added later.
6. **AI default provider:** use a **local Ollama** provider first, behind the existing env-driven abstraction for dev/staging.
7. **Premium / templates / monetisation:** **exclude paid tiers** from Phase A, but **include template schema + UI stubs**.
8. **Disputes in MVP:** implement the **full DISPUTED path with admin tooling** in MVP.
9. **Double-blind review timeout:** **7-day** auto-reveal; **immediate reveal** when both parties have submitted. Tunable via config for experiments (see Phase 6).
10. **One-sided feedback visibility:** use the same **7-day** config surface as the double-blind timeout so docs, UI copy, and jobs stay aligned.
11. **Visual regression tooling:** use **Playwright snapshots**.
12. **GitHub workflow policy:** require **fast CI + E2E + visual checks** on PRs; longer suites also run on **every PR**.
13. **Mobile stack:** use **React Native** for iOS and Android apps; start with **self-signed/internal builds**.

---

## Platform Strategy

### Phase A (MVP)
- Web application (Next.js), mobile-first responsive design
- PWA support (installable on mobile)
- Mobile apps are built in **React Native** for iOS and Android, sharing API/domain contracts with the web app

### Phase B
- Native enhancements by platform (deeper platform-specific UX beyond shared MVP flows)

### Requirements
- All APIs must be mobile-compatible from day one
- UI components designed for touch-first interaction
- Separate build targets and artifacts: `web`, `ios`, `android`

---

## Phase 0 — Project foundation

**Status:** `PLANNED`

Goal: repo, tooling, environments, and conventions so later phases plug in cleanly.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 0.1 | Initialize repo for the chosen Phase A stack: **Next.js app/backend** plus shared packages for types, API contracts, and domain logic. | `PLANNED` |
| 0.2 | TypeScript, lint, format, test runner; pre-commit optional. | `PLANNED` |
| 0.3 | Environment config pattern (`AI_PROVIDER=ollama`, DB URLs, OAuth secrets, cluster deploy secrets) — no secrets in repo. | `PLANNED` |
| 0.4 | Docker Compose (or equivalent): PostgreSQL + Redis for local dev. | `PLANNED` |
| 0.5 | Database migration tool (e.g. Prisma, Drizzle, TypeORM) aligned with the chosen Next.js stack and deployment model. | `PLANNED` |
| 0.6 | GitHub Actions baseline CI: lint, typecheck, unit tests on PR + push; cache dependencies and test artifacts. | `PLANNED` |
| 0.7 | Add workflow jobs for integration/E2E and **Playwright visual regression** checks, including artifact upload for failed runs. | `PLANNED` |
| 0.8 | Establish screenshot conventions: path (`docs/screenshots/phase-<n>/...`), naming, Playwright baseline refresh process, and PR checklist. | `PLANNED` |
| 0.9 | Initialize **React Native** app projects for iOS and Android with shared API/domain packages and env-configurable API/base URLs. | `PLANNED` |
| 0.10 | Add separate GitHub Actions build workflows/jobs for `web`, `ios`, and `android`; publish artifacts independently per platform. | `PLANNED` |
| 0.11 | Define mobile signing/config secrets strategy for **self-signed/internal builds** first (bundle IDs, provisioning profiles, Android keystore) for CI/CD readiness. | `PLANNED` |
| 0.12 | Define CI/CD deployment workflow for the **self-hosted local cluster**: environment secrets, runner/network access, deploy command, health checks, and rollback path. | `PLANNED` |

---

## Phase 1 — Authentication & user system

**Status:** `PLANNED`
Maps to [`giggi.md` §18 item 1](giggi.md#giggi-18), entities **User** / **Profile** ([§3](giggi.md#giggi-3)), identity **Tier 1–2** ([§8](giggi.md#giggi-8)).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 1.1 | PostgreSQL schema: `users` (id, nickname, email, phone, flags, rating aggregates placeholder, cancellation fields, timestamps). | `PLANNED` |
| 1.2 | Schema: `profiles` (user_id, bio, skills, resume_data JSON, visibility_level). | `PLANNED` |
| 1.3 | Email + password auth **or** magic link — confirm product preference **(DECISION)** if not specified in giggi. | `PLANNED` |
| 1.4 | Google OAuth integration only for Phase A; keep provider abstraction ready for later expansion. | `PLANNED` |
| 1.5 | Session/JWT strategy; secure cookies if web; CSRF where applicable. | `PLANNED` |
| 1.6 | Phone verification flow (Finland-first): send code, verify, set `is_phone_verified`, **Tier 2** capabilities flag; keep SMS provider behind a swap-friendly adapter/config boundary. | `PLANNED` |
| 1.7 | API: register, login, logout, current user, profile CRUD. | `PLANNED` |
| 1.8 | Enforce **Tier 1 vs Tier 2** rules on endpoints (browse/message/post limits, sensitive categories blocked for Tier 1) per [§8](giggi.md#giggi-8). | `PLANNED` |
| 1.9 | Frontend: auth screens, profile basics, verification UI. | `PLANNED` |
| 1.10 | Tests: auth/session security cases, tier-gated endpoint access, phone verification success/failure paths. | `PLANNED` |
| 1.11 | Screenshots: sign-in, sign-up, phone verification, and profile basics states (idle/error/success). | `PLANNED` |

---

## Phase 2 — Categories, gigs, expiration

**Status:** `PLANNED`
Maps to [§3 **Gig**](giggi.md#giggi-3-gig) (including optional **payment timing / method** hints — [System rules — Payment timing](docs/system-rules.md#payment-timing)), [§4](giggi.md#giggi-4) categories & intent modifiers, [§9](giggi.md#giggi-9) expiration rules, [§19](giggi.md#giggi-19) feed inputs, [§20](giggi.md#giggi-20) posting intent.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 2.1 | Seed data: flat category tree (parent/child or single table with path) matching [§4](giggi.md#giggi-4). | `PLANNED` |
| 2.2 | Schema: `gigs` with type REQUEST \| OFFER, title, description, category, tags JSON, location_type, location_data (geo + neighbourhood), compensation fields, effort_level, urgency, expires_at, created_by, status (active/closed/expired), optional payment timing/method preference fields. | `PLANNED` |
| 2.3 | Align **urgency** enum with feed sections (ASAP, SCHEDULED, RECURRING, FLEXIBLE vs [§3 **Gig** `urgency`](giggi.md#giggi-3-gig) — resolve naming in implementation). | `PLANNED` |
| 2.4 | Service: compute `expires_at` from urgency + duration estimates ([§9](giggi.md#giggi-9)); optional message-activity extension. | `PLANNED` |
| 2.5 | Auto-close gig when agreement created ([§9](giggi.md#giggi-9)). | `PLANNED` |
| 2.6 | API: create/update gig (auth + tier checks), get gig by id, list with filters (location, urgency, category). | `PLANNED` |
| 2.7 | Location system: store lat/lng + neighbourhood; basic radius queries (no PostGIS in MVP). | `PLANNED` |
| 2.8 | Frontend: “Post” flow with **I need help** / **I offer help** ([§20](giggi.md#giggi-20)); gig form with intent modifiers. | `PLANNED` |
| 2.9 | Optional: **free-text first** posting step before structured form (pairs with Phase 7 AI). | `PLANNED` |
| 2.10 | Re-engagement hooks: on expiration, API/events for repost / edit / save template; implement template persistence schema + UI stubs, but defer premium gating/limits. | `PLANNED` |
| 2.11 | **Optional** gig-detail map only (no discovery map in MVP): OpenStreetMap (Leaflet or MapLibre), single gig’s location on **gig detail** screen. Browse / feed / homepage stays **list + search + filters** — no map of many gigs. | `PLANNED` |
| 2.12 | Implement payment timing/method rules from [System rules — Payment timing](docs/system-rules.md#payment-timing): optional on gig, default timing `after_completion`, conditional identifier fields for cash/mobile/bank methods. | `PLANNED` |
| 2.13 | Gig creation journey parity ([Gig creation](docs/journeys/gig-creation.md)): worker-search prompt vs blank prompt source, AI pre-fill, required-field loop, review+publish. | `PLANNED` |
| 2.14 | Tests + screenshots: gig create/edit/publish, expiration auto-close, payment preference defaults/validation, and map/no-map variants. | `PLANNED` |

---

## Phase 3 — Discovery, search, homepage feed

**Status:** `PLANNED`
Maps to [§5](giggi.md#giggi-5) Discovery, **[§19](giggi.md#giggi-19)** homepage sections & **MVP weighted interest** (default gig-feed blend + search / profile variants), **[§7.1](giggi.md#giggi-7-1)** trust as a rank input, [§20](giggi.md#giggi-20) Find help / Find work, and UI specs in [Home screen](docs/ui/screens/home.md), [Feed list](docs/ui/components/feed-list.md), [Gig card](docs/ui/components/gig-card.md).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 3.1 | API: search + filter endpoint(s); pagination. | `PLANNED` |
| 3.2 | Feed endpoint: context `find_help` vs `find_work` (filter gig type + sections). | `PLANNED` |
| 3.3 | Implement section queries: **Urgent Now**, **Nearby & Relevant**, **New Gigs**, **Flexible & Recurring** ([§19](giggi.md#giggi-19)–[§20](giggi.md#giggi-20)). | `PLANNED` |
| 3.4 | **Blended interest score** per [§19](giggi.md#giggi-19-interest): normalise factors to 0–1; **default gig discovery blend** (starting weights, config-tunable): `location 0.30 + urgency 0.25 + freshness 0.20 + category 0.15 + trust 0.10` (+ **engagement** term for *Nearby & Relevant* per [§19 ranking blend](giggi.md#giggi-19-ranking-blend) / cold-start rules). Implement **separate** ranking paths for **gig search**, **worker search**, and **profile / worker lists** per [§19](giggi.md#giggi-19-interest) priority tables. **Do not** expose raw scores in UI ([`docs/ui/README.md`](docs/ui/README.md)). | `PLANNED` |
| 3.5 | Urgent decay (`exp(-time_since_post)` or discrete tiers) and soft quotas ([§19](giggi.md#giggi-19)). | `PLANNED` |
| 3.6 | Track lightweight engagement (message count, optional click events) for ranking. | `PLANNED` |
| 3.7 | Build Home shell per [UI screen spec](docs/ui/screens/home.md): top app menu, mobile bottom bar, fixed desktop left-nav vs mobile secondary menu, and optional right rail behavior. | `PLANNED` |
| 3.8 | Implement nav/filter interactions: location radius control, Home reset behavior, category nesting + starred categories, saved searches, and `Gigs offer` scoped feed. | `PLANNED` |
| 3.9 | Implement sort strip (**Best / Popular / Latest / Urgent**) and scroll-threshold refresh behavior with documented ordering contracts per page context. | `PLANNED` |
| 3.10 | Implement [Feed list](docs/ui/components/feed-list.md) and [Gig card](docs/ui/components/gig-card.md) specs: flat rows, list-owned separators, chips/tier rules, footer action hit hierarchy, accessibility labels. | `PLANNED` |
| 3.11 | Small “People offering help near you” strip on Find help ([§20](giggi.md#giggi-20)) — optional MVP. | `PLANNED` |
| 3.12 | Tests: ranking contract by context (home/search/saved), filters/sort behavior, infinite scroll, and accessibility assertions for card actions. | `PLANNED` |
| 3.13 | Screenshots: Home (mobile + desktop), left-nav/secondary-menu states, sort modes, feed list states (loading/empty/error), and gig card variants (with/without image, urgency/payment chips, light/dark). | `PLANNED` |

---

## Phase 4 — Messaging

**Status:** `PLANNED`
Maps to [§5](giggi.md#giggi-5-c) Messaging, entity **Message** ([§3](giggi.md#giggi-3)).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 4.1 | Schema: `conversations` + `messages` with optional `attached_gig_id`; support many concurrent threads per user and many threads/agreements per gig ([System rules — Messaging concurrency](docs/system-rules.md#messaging-concurrency)). | `PLANNED` |
| 4.2 | API: list conversations, list messages per conversation, send message, start conversation (with optional gig attachment), participant-only authorization. | `PLANNED` |
| 4.3 | Real-time strategy:
- MVP: polling
- Phase B: WebSocket upgrade (same API contract) | `PLANNED` |
| 4.4 | Progressive reveal of identity per conversation stage ([§8](giggi.md#giggi-8)) — implement fields exposed per relationship state. | `PLANNED` |
| 4.5 | **Notifications — email (MVP):** new message, agreement lifecycle updates; wire to message/agreement events (requires 4.2 + later 5.x events). | `PLANNED` |
| 4.6 | **Notifications — in-app (MVP):** store/display notification feed; mark read; link deep into thread or agreement. | `PLANNED` |
| 4.7 | **Push notifications:** Phase B with native apps (same event sources as 4.5–4.6). | `PLANNED` |
| 4.8 | Frontend journey parity ([Browse → hire](docs/journeys/browse-to-hire.md)): worker path (gig detail → chat), client path (inbox existing/new chat), optional attach-gig flow, CTA **Hire this person**. | `PLANNED` |
| 4.9 | Tests + screenshots: multi-thread inbox legibility, gig-attached vs unattached chat states, hire CTA availability rules, notification deep links. | `PLANNED` |

---

## Phase 5 — Agreements (trust core)

**Status:** `PLANNED`
Maps to [§3 **Agreement**](giggi.md#giggi-3-agreement), [§5](giggi.md#giggi-5) Agreement & completion flows, [§6](giggi.md#giggi-6) checklist rules.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 5.1 | Schema: `agreements` + `agreement_versions` (immutable send history) including required payment timing/method fields, schedule/location/checklist/compensation payload, and accept/reject audit fields. | `PLANNED` |
| 5.2 | Negotiation state machine per [Agreement negotiation](docs/journeys/agreement-negotiation.md): send/review/edit/reject loops with validity gates (scheduled start, gig expiration, or 48h since latest proposal). | `PLANNED` |
| 5.3 | API: create draft from gig/chat context, send revised version, accept exact version, reject, and enforce “sent versions cannot be mutated”. | `PLANNED` |
| 5.4 | Locking rules: both parties must accept the same version; lock agreement/checklist only at mutual acceptance; trigger gig auto-close on first binding agreement ([§9](giggi.md#giggi-9)). | `PLANNED` |
| 5.5 | Implement required agreement payment fields from [System rules — Payment timing](docs/system-rules.md#payment-timing): timing+method visible on every version, conditional identifier field validation. | `PLANNED` |
| 5.6 | Completion state machine per [Gig completion](docs/journeys/gig-completion.md): two-sided claims, matched outcome mapping, mismatch path, one-sided timeout, unconfirmed timeout. | `PLANNED` |
| 5.7 | Cancellation flow per [Cancellation journey](docs/journeys/cancellation-flow.md): either side can cancel pre-completion, early/late classification via config, immediate counterpart notification, optional feedback routing. | `PLANNED` |
| 5.8 | No-show flow per [No-show journey](docs/journeys/no-show-flow.md): grace window, attendance attestation, structured no-show signals, then handoff to completion flow. | `PLANNED` |
| 5.9 | Frontend: agreement draft/revision timeline UI, accept/reject/edit controls, completion/cancellation/no-show prompts, and neutral soft-dispute copy entry points. | `PLANNED` |
| 5.10 | Tests + screenshots: negotiation expiry gates, version integrity, completion outcomes, cancellation/no-show branches, and agreement detail states. | `PLANNED` |

---

## Phase 6 — Feedback & reviews (double-sided / double-blind experiment in MVP)

**Status:** `PLANNED`

Treat double-blind as an **experiment**, not a final immutable system: ship early, measure, keep flags/config so behavior can change post-MVP.

Maps to [§3 **Review**](giggi.md#giggi-3-review), [§5.F](giggi.md#giggi-5-f), [Feedback flow](docs/journeys/feedback-flow.md), and [§7](giggi.md#giggi-7) reputation fields.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 6.1 | Schema: `reviews` with required overall stars, optional comment, optional dimension ratings JSON, pre-reveal storage, uniqueness per agreement+reviewer, edit-until-publish flags, reveal reason. | `PLANNED` |
| 6.2 | Implement one reveal policy clock: immediate mutual publish + **7-day** configured timeout auto-publish for one-sided submissions; the same config drives product copy and cron logic. | `PLANNED` |
| 6.3 | API: create/update feedback pre-publish; enforce only-agreement-linked reviews, edit-until-publish, and no partial visibility of peer content before reveal. | `PLANNED` |
| 6.4 | Job/cron: timeout publish transition and notifications; publish state moves are idempotent and auditable. | `PLANNED` |
| 6.5 | Aggregate rating/review counters from published reviews only; maintain separate aggregates for worker-focused and client-focused dimensions where relevant. | `PLANNED` |
| 6.6 | Frontend journey parity ([Feedback flow](docs/journeys/feedback-flow.md)): entry from chat/notification, short default form, optional detailed dimensions, category-specific skill questions, waiting/revealed states. | `PLANNED` |
| 6.7 | **Experiment metrics**: submission rate, one-sided rate, time-to-second-review, mutual vs timeout publish share, and rating distribution by publish cohort. | `PLANNED` |
| 6.8 | Tests + screenshots: feedback form variants, reveal timing edge-cases, one-sided auto-publish, edit lock after publish, and neutral role copy using names (not permanent labels). | `PLANNED` |

---

## Phase 7 — AI abstraction (Core MVP feature)

**Status:** `PLANNED`
Maps to [§10](giggi.md#giggi-10)–[§12](giggi.md#giggi-12), [§5](giggi.md#giggi-5-a) posting AI assist, [§13](giggi.md#giggi-13) moderation flags.

| Step | Description | Status |
| ---- | ----------- | ------ |
| 7.1 | Define `AIService` interface: classify(text), generateChecklist (and any tagging helpers). | `PLANNED` |
| 7.2 | Implement **Ollama** as the first provider behind env `AI_PROVIDER`, keeping the provider boundary pluggable for later OpenAI/Anthropic support. | `PLANNED` |
| 7.3 | Wire triggers: on gig submit (suggestions), on agreement creation (checklist assist) — never auto-apply without user confirm ([§11](giggi.md#giggi-11)). | `PLANNED` |
| 7.4 | Model routing: cheaper local model for classification/tagging; stronger local model for checklist generation ([§12](giggi.md#giggi-12)). | `PLANNED` |
| 7.5 | Caching for repeated prompts (Redis) ([§12](giggi.md#giggi-12)). | `PLANNED` |
| 7.6 | Moderation: AI flag + reduce visibility / flag for manual review — no auto-ban ([§13](giggi.md#giggi-13)). | `PLANNED` |
| 7.7 | AI triggers:
- on gig submit (category + tags + checklist suggestion)
- on agreement creation (checklist refinement)
User must confirm all AI outputs. | `PLANNED` |
| 7.8 | AI-assisted search: expand user queries (synonyms, intent matching). | `PLANNED` |
| 7.9 | Tests + screenshots: provider abstraction unit tests, moderation decision paths, and UI evidence for AI pre-fill/review-confirm flows (no auto-apply). | `PLANNED` |

---

## Phase 8 — Reputation & disputes (MVP depth)

**Status:** `PLANNED`
Maps to **[§7.1](giggi.md#giggi-7-1)** trust composite, [§7](giggi.md#giggi-7) metrics, [§14](giggi.md#giggi-14), [§3 **Dispute**](giggi.md#giggi-3-dispute), [soft disputes](docs/system-rules.md#soft-disputes).

| Step | Description | Status |
| ---- | ----------- | ------ |
| 8.1 | Track cancellations, no-shows, completion mismatch, and related signals from agreement + completion flows (feeds [§7.1](giggi.md#giggi-7-1) inputs). | `PLANNED` |
| 8.2 | Compute **[§7.1](giggi.md#giggi-7-1) `trustComposite`** (configurable weights); persist aggregates for **ranking** ([§19](giggi.md#giggi-19-interest)) and UI (**stars + review count** + qualitative chips only — never expose raw composite formula in UI). | `PLANNED` |
| 8.3 | Implement [soft dispute handling](docs/system-rules.md#soft-disputes): record mismatch/cancel-conflict/no-show-disagreement events and both-side submissions, show non-blaming acknowledgment copy, and support escalation into formal disputes. | `PLANNED` |
| 8.4 | Schema + API for the **full Dispute workflow** in MVP, including admin actions/tooling, audit history, agreement/gig linkage, and trust-signal integration. | `PLANNED` |
| 8.5 | Soft penalties: visibility reduction, posting cooldown (rules engine, configurable, fed by repeated behavioral signals). | `PLANNED` |
| 8.6 | Tests + screenshots: trust composite computations, dispute intake/escalation flows, admin dispute tooling states, and user-facing acknowledgment states. | `PLANNED` |

---

## Phase 9 — Polish, ops, launch prep

**Status:** `PLANNED`

| Step | Description | Status |
| ---- | ----------- | ------ |
| 9.1 | Rate limiting, abuse basics, audit logs for sensitive actions. | `PLANNED` |
| 9.2 | Error monitoring and logging (provider **(DECISION)**). | `PLANNED` |
| 9.3 | Seed/staging data; deterministic E2E smoke tests for critical flows (post → message → hire → negotiate → complete/no-show/cancel → feedback). | `PLANNED` |
| 9.4 | **Playwright** visual regression suite + screenshot baselines for core UI surfaces (home/feed/card/chat/agreement/feedback) with PR artifact diffs. | `PLANNED` |
| 9.5 | GitHub workflow hardening: required checks, concurrency controls, path filters, **fast CI + E2E + visual checks on every PR**, flaky-test quarantine policy, and release tags automation. | `PLANNED` |
| 9.6 | Performance pass on feed, ranking, and geo queries (targets + dashboards). | `PLANNED` |
| 9.7 | Accessibility and mobile-first pass on main flows (keyboard, focus order, contrast, tap target, reduced motion), with automated a11y checks in CI. | `PLANNED` |
| 9.8 | React Native app QA pass (iOS + Android): safe areas, OAuth/session handoff, deep links, permissions, offline/error handling, and parity with core web flows. | `PLANNED` |
| 9.9 | Separate pre-release lanes for native mobile apps: iOS and Android internal/self-signed distribution, each fed by its own build workflow. | `PLANNED` |
| 9.10 | CI/CD deployment to the **self-hosted local cluster** with environment promotion rules, health checks, and rollback/runbook verification. | `PLANNED` |

---

## Phase B — Explicitly out of MVP (from giggi.md)

**Status:** `DEFERRED` (not in Phase A execution until roadmap amendment)

- Payments / escrow ([§2](giggi.md#giggi-2), [§16](giggi.md#giggi-16))
- Advanced moderation AI, AI dispute resolution ([§2](giggi.md#giggi-2), [§16](giggi.md#giggi-16))
- Full **ML** recommendation / learning-to-rank (beyond [§19](giggi.md#giggi-19-interest) **hand-tuned** weighted interest + [§7.1](giggi.md#giggi-7-1) trust composite in MVP) ([§2](giggi.md#giggi-2), [§16](giggi.md#giggi-16))
- Deep **personalisation** (behavioural profiles beyond current signal set) ([§16](giggi.md#giggi-16))
- Tier 3 ID verification ([§8](giggi.md#giggi-8))
- Premium subscription features ([§8](giggi.md#giggi-8-premium)) — Phase A includes only template schema/UI stubs, not paid tiers or limits
- Advanced local LLM serving/ops beyond the initial Ollama integration (multi-node, GPU scheduling, or dedicated model infra) ([§16](giggi.md#giggi-16))
- Smart defaulting tab from behavior ([§20 — *Smart Defaulting (Future)*](giggi.md#giggi-20-future-defaulting))
- **Discovery / feed map view** (map + list sync, many gigs on map) — MVP per Decision #5 is list/search/filters only; optional single-gig map is Phase 2 **2.11** only

---

## Suggested execution order (dependency-aware)

1. Phase **0** → **1** → **2** (core data/auth plus CI/workflow/screenshot scaffolding, including React Native app setup and cluster deploy scaffolding)
2. **3** (discovery + Home/feed UI specs) can overlap after **2.6** minimally
3. **4** messaging — includes **4.5–4.7 notifications** once message send (4.2) exists; **4.5 email** and **4.6 in-app** tighten after **5** if agreement emails need agreement state hooks
4. **5** agreements/negotiation/completion (+ cancel/no-show branches) → **6** feedback/reviews
5. **7** AI can start after **2** API exists; UI integration ties to posting/agreement steps
6. **8** after **5–6** have stable trust/dispute events
7. **9** hardening and launch automation (E2E, visual regression, required GitHub checks, separate iOS/Android native release lanes, and cluster deployment automation)

**Mobile rollout rule:** ship **web first**, then ship **iOS** and **Android** React Native apps as separate build artifacts/channels, keeping core auth/discovery/messaging/agreement flows aligned across surfaces.

**Clarification:** Steps **4.5–4.7** are **part of Phase 4** (not a separate phase number). Implement **in-app notifications (4.6)** early enough to surface message events; **email (4.5)** can follow the same event bus.

---

## Changelog

| Date       | Change                    |
| ---------- | ------------------------- |
| 2026-04-13 | Initial roadmap from giggi.md |
| 2026-04-14 | Double-blind MVP experiment (7d timeout, mutual reveal, edit until reveal, metrics); no discovery map MVP, OSM optional on gig detail only; notifications folded into Phase 4 as 4.5–4.7; Decision #5/#9 aligned |
| 2026-04-15 | Product principles: ranking = context-weighted interest ([§19](giggi.md#giggi-19-interest)), trust = [§7.1](giggi.md#giggi-7-1) composite (not locality-only). Phase 3.4 / 8.x / 4.1 / Phase B aligned; companion docs + Decision #10 (3d vs 7d feedback); payment hints Phase 2 |
| 2026-04-15 | Synced roadmap to docs specs: Home/feed/gig-card UI contracts, agreement negotiation validity/versioning, cancellation/no-show/completion branches, feedback flow details, phase-level tests/screenshots, and GitHub workflow automation milestones. |
| 2026-04-15 | Mobile delivery clarified: React Native apps replace the earlier webview-first assumption; separate iOS/Android builds, internal signing/distribution, and native QA lanes added to roadmap phases. |
| 2026-04-15 | Decision sync applied: Next.js backend, self-hosted local-cluster deployment path, Ollama as first AI provider, Google-only OAuth, OSM detail map, template stubs without paid tiers, full dispute/admin path, Playwright visual regression, and required PR checks expanded to fast CI + E2E + visual on every PR. |

When you approve edits, update this table and phase/step statuses as work completes.
