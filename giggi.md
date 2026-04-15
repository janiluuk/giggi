# Gig Marketplace Platform (Working Name)

## 1. Product Definition

A hyper-local marketplace for **irregular, one-off gigs** where:

* Posting is **fast and effortless**
* Discovery is **location-based and intent-driven**
* Trust is built gradually through **agreements, reviews, and verification**
* AI assists users but does not replace user control

Core principle:

> Structured UI + Open marketplace + AI-assisted workflows

### 1.1 Product backbone (vision and journey sequence)

**Synopsis.** People **post gigs**; others **browse**, enter conversations, and **get hired** through explicit agreements tied to real work. **Trust** compounds from **honest signals**—two-sided completion claims, structured behavioural markers (no-shows, cancellations), and **feedback** whose **visibility and timing the system controls** so neither side can easily steamroll the other. **Every other feature** (search, ranking, categories, AI drafting, verification, notifications, maps, and so on) exists to **support this spine**, not to replace it.

This product is built around a simple, repeatable loop:
- Someone posts a gig
- Others browse and engage
- Agreements are formed and completed
- Both parties provide feedback

Trust is not assumed — it is **systematically built** through structured agreements and controlled, fair feedback.

The platform ensures that:
- both parties have equal voice in outcomes
- feedback is collected and revealed fairly
- system signals (completion status, no-shows, cancellations) support honest evaluation

Every feature in the product exists to support this core flow:
**create → match → agree → perform → (complete or cancel) → review → build trust**

Over time, this loop creates a reliable ecosystem where:
- good actors are rewarded
- poor behavior is surfaced
- decisions become faster and safer for everyone

---

> The goal is not just to connect people, but to **enable trustworthy, repeatable transactions with minimal friction**.

**Journey diagrams** (read in this order; each file is the implementable navigation story for that leg):

1. [Home → browse → chat](docs/journeys/home-to-chat.md) — App entry, signed-out vs curated home, browse, chat auth gate.
2. [Browse → create ad](docs/journeys/browse-to-create-ad.md) — Search/browse, worker-focused results, prompt into create ad, sign-in, high-level create path.
3. [Gig creation](docs/journeys/gig-creation.md) — Start create gig, creation source, AI parse, pre-fill, required fields, publish.
4. [Browse → hire](docs/journeys/browse-to-hire.md) — Worker vs **client** (gig poster) entry into gig-context chat; Hire → agreement draft.
5. [Agreement negotiation](docs/journeys/agreement-negotiation.md) — Versioned draft, accept / edit / resend / reject, expiry rules, lock when both accept the same version.
6. [Cancellation](docs/journeys/cancellation-flow.md) — While agreement is active and gig not completed: **client** or **worker** may cancel, early vs late marks, immediate notify, agreement ends, optional feedback; trust signals only in MVP (no hard penalties).
7. [No-show](docs/journeys/no-show-flow.md) — At agreed gig **start**: waiting/grace window, user-driven attendance outcome (no auto check-in in MVP), marks and notifications, then **completion flow** opens for claims including *Did not happen*.
8. [Gig completion](docs/journeys/gig-completion.md) — After agreed **end** time: independent completion claims, match or mismatch, response window, then hand off to feedback.
9. [Feedback flow](docs/journeys/feedback-flow.md) — Required stars, optional text and dimensions, reveal rules, edit until publish.

[Index of journey files](docs/journeys/README.md). Add new charts under `docs/journeys/` and extend the list above when the backbone gains a new leg.

**Personas (E2E by role):** [Worker vs client journey maps](docs/personas/README.md) — who touches which leg of the spine, without duplicating diagrams.

**Conflicting outcomes (MVP):** when completion **mismatches**, **cancellation** is contested, or **no-show** narratives disagree, use **soft dispute handling** — acknowledge, collect input, improve the product; **no** manual adjudication in MVP. See [System rules — Soft disputes](docs/system-rules.md#soft-disputes).

**Payment timing / method (listings + agreements):** [System rules — Payment timing](docs/system-rules.md#payment-timing).

**Other product rules (non-journey):** extend the [system rules](docs/system-rules.md) table of contents as new topics appear (e.g. **messaging concurrency**: many chats per worker, many hires per gig).

### 1.2 Documentation roles & UI voice

* **Worker** and **client** are terms for **docs and code** (e.g. `worker_id`, `client_id` on an **agreement**). They describe **who is which side for that gig or agreement** — not a permanent user type. The same person can post one gig and take another.
* **Public UI** should prioritise **soft, natural language** and **names** over rigid role labels — e.g. *“How was your experience with Anna?”* rather than *“Leave feedback for your client.”* Implementation detail and copy standards: [UI specs index](docs/ui/README.md).
* Legacy implementations may still use a column name such as `employer_id`; treat it as the **client** side of the agreement when reading older code or DBs.

---

## 2. MVP Scope (Phase A - Minimal AI)

### Included:

* User authentication (email + Google)
* Phone verification (Finland-first)
* Create / browse gigs
* Messaging system
* Agreement system (core trust layer)
* Review system (double-sided, **double-blind in MVP as an experiment** — see §5.F)
* Basic AI:

  * Search recommendation
  * Gig creation auto completion
  * Agreement creation with checklists

### Excluded (Phase B):

* Payments / escrow
* Advanced moderation AI
* Dispute automation
* Recommendation engine

---

## 3. Core Entities (Database Model)

### User

* id
* nickname
* email
* phone_number
* is_phone_verified
* rating
* review_count
* cancellation_rate
* created_at

---

### Profile

* user_id
* bio
* skills
* resume_data (JSON)
* visibility_level

---

### Gig

* id
* type: (REQUEST | OFFER)
* title
* description
* category
* tags (JSON)
* location_type (ONSITE | REMOTE | WORKER_PLACE)
* location_data (geo + neighbourhood)
* compensation_type (FIXED | HOURLY | NEGOTIABLE)
* compensation_amount
* **Optional (payment intent on listing):** `payment_timing_preference` (AFTER_COMPLETION | PARTIAL_UPFRONT_THEN_COMPLETION | FLEXIBLE_DISCUSS) — default suggestion **after completion**; `payment_method_preference` (CASH | MOBILE_OR_BANK | OTHER) and optional `payment_contact_hint` when a method needs a number/identifier (disclosure only; **no** in-app payments in MVP)
* effort_level (QUICK | NORMAL | HEAVY)
* urgency (NOW | TODAY | WEEK | FLEXIBLE) — see **[Urgency and intent modifiers (alignment)](#urgency-and-intent-modifiers-alignment)** for mapping to feed/posting intent
* expires_at
* created_by

---

### Message

* id
* gig_id
* sender_id
* receiver_id
* content
* created_at
* **Concurrency:** the model must support **many concurrent conversations** per user (workers across gigs; **clients** with several candidates on one gig). Prefer a **thread / conversation id** (or equivalent) rather than implying a single channel per user pair — see [System rules — Messaging concurrency](docs/system-rules.md#messaging-concurrency).

---

### Agreement (CRITICAL ENTITY)

* id
* gig_id
* client_id (gig poster for this agreement; legacy code or DBs may name this `employer_id`)
* worker_id
* scheduled_time
* price
* location
* checklist (JSON array)
* **Required (payment clarity):** `payment_timing` (same enum as gig preference; must be **explicit** on the agreement — default pre-fill **after completion**); `payment_method` (CASH | MOBILE_OR_BANK | OTHER); `payment_contact_detail` **when** method is cash or mobile/bank (coordinating phone or allowed identifier — policy/PII as per region)
* status (PENDING | CONFIRMED | COMPLETED | DISPUTED | CANCELLED)
* created_at
* **Many workers on one gig:** several **agreement** rows may share the same `gig_id` with **different** `worker_id` when the **client** hires multiple people for that listing (parallel or sequential). Each agreement has its own lifecycle ([System rules — Messaging concurrency](docs/system-rules.md#messaging-concurrency)).

Full UX options, field behaviour, and AI hints: [System rules — Payment timing](docs/system-rules.md#payment-timing).

---

### Review

* id
* agreement_id
* reviewer_id
* reviewee_id
* rating
* reliability_score
* communication_score
* quality_score
* comment
* created_at
* **MVP experiment fields (conceptual):** visibility to counterparty until **reveal**; **updated_at** while **editable until reveal**; **revealed_at**; **reveal_reason** (e.g. mutual | timeout); config for **timeout duration** (default **7 days**)

---

### Dispute

* id
* agreement_id
* raised_by
* reason
* description
* status


---

### Templates

Free users:
- up to 3 templates

Premium users:
- unlimited templates
- auto-repost
- recurring scheduling

---


## 4. Category System

Flat, explicit categories:

* Cleaning & Home
** Home cleaning
** Window cleaning
** Laundry / ironing
** Dishwashing
** Deep cleaning / moving cleaning
* Repair & Handyman
** Furniture assembly & repair
** Small repairs (bike, door, lock, etc.)
** Electrical help
** Plumbing
** Car help
* Moving & Transport
** Carrying / lifting
** Driving & transport
** Recycling / dumping
* Yard & Outdoor
** Gardening
** Snow removal
** Leaf cleaning
** Lawn mowing
* Pets
** Dog walking
** Pet sitting
** Feeding visits
** Pet transport
* Care (kids, elderly)
** Babysitting (require high identification)
** Elderly help (require high identification)
** Companion visits (require high identification)
** Grocery help
* Lessons & Help
** School tutoring
** Language lessons
** Skill lessons (music, instruments, dancing, martial arts...)
** Personal trainer
* Digital & Creative
** Graphic design
** Translation
** Writing
** Video editing
** DJ / music production
** Computer & IT help
* Events & Temporary Work
** Bartending
** Serving
** Cooking
** Event setup / teardown
** Cloakroom
* Professional Services
** Accounting (require high identification)
** Legal advice (require high identification)
** CV help
** Business consulting
* Quick Tasks / Help Now
** Errands
** Queueing
** Pickup / drop-off
** “I need help now”
* Other

---

### Intent Modifiers (Core Differentiator)

Each gig includes:

* urgency:
** ASAP (high demand, instant matching)
** SCHEDULED (user picks date/time)
** RECURRING (weekly, monthly, etc.)
** FLEXIBLE (no strict time)
* estimated time per gig (optional):
** <1 hour
** 3-4 hours
** Half day
** Full day
* location: ONSITE / REMOTE / WORKER_PLACE

### Urgency and intent modifiers (alignment)

The **Gig** entity stores `urgency` as **`NOW` | `TODAY` | `WEEK` | `FLEXIBLE`**. **[Intent Modifiers](#intent-modifiers-core-differentiator)** describe user-facing concepts (**ASAP**, **SCHEDULED**, **RECURRING**, **FLEXIBLE**). Feeds, chips, and posting must **not** invent divergent third enums — follow the tables below until the schema adds explicit fields for scheduled and recurring gigs.

**Storage target (modifier → persisted shape)**

| Intent modifier (UX / chips) | Persisted as (contract) |
| --- | --- |
| **ASAP** | `urgency = NOW` |
| **SCHEDULED** | `urgency` value TBD when a gig-level **scheduled time** (or equivalent) exists on Gig — extend §3 Gig with fields when implemented |
| **RECURRING** | Recurrence fields on Gig (to add to §3), or extended enum — document when implemented |
| **FLEXIBLE** | `urgency = FLEXIBLE` |

**Display default (`Gig.urgency` → chip copy; localize)**

| `Gig.urgency` | Default chip / label |
| --- | --- |
| `NOW` | ASAP |
| `TODAY` | Today |
| `WEEK` | This week |
| `FLEXIBLE` | Flexible |

If product later decides **`TODAY` shares the ASAP chip** with `NOW`, state that explicitly here and in UI specs so chips stay consistent.

---

## 5. User Flow

**Canonical order and links:** the product spine and ordered journey files are in **§1.1**. The subsections below (A–G) are narrative summaries; detailed Mermaid lives in `docs/journeys/`—do not duplicate large diagrams here.

### A. Posting Flow

1. User types free text:
   "Need someone to clean my apartment tomorrow"

2. AI suggests:

   * category
   * checklist
   * price range
   * tags

3. User confirms → post created

---

### B. Discovery Flow

* Search-first UI
* Filters:

  * location
  * urgency
  * category
* **MVP:** **No map view** for browsing the catalogue, homepage, or feed — discovery is **list + search + filters** (location still drives ranking and text/structured location).
* **Optional MVP slice:** On **gig detail** only, an **OpenStreetMap**-based map (e.g. Leaflet or MapLibre) may show **that gig’s** location. There is **no** “all gigs on a map” experience in MVP.
* **Phase B / later:** Broader map experiences (e.g. map + list for discovery) can be added if metrics justify it.

### Location mode and match breadth (ranking)

Discovery and ranking use this mental model (the **gig card** only reflects each gig’s own `location_type` and location data — it does not imply match quality):

* **Remote** → broad match
* **At worker’s place** → stronger than distant on-site
* **Nearby on-site** → strongest match

---

### C. Messaging Flow

* Users communicate freely
* No structured application system
* CTA: "Hire this person"
* **Parallelism:** workers may chat and pursue **many gigs at once**; a **client** (gig poster) may keep **multiple concurrent threads** on the **same gig** (several candidates) and may **hire multiple workers** for that gig via **separate agreements**. Inbox and gig surfaces must stay clear per thread — [System rules — Messaging concurrency](docs/system-rules.md#messaging-concurrency).

---

### D. Agreement Flow (Core Trust System)

1. **Client** (gig poster for this thread) clicks "Hire"

2. System pre-fills:

   * time
   * price
   * checklist
   * location
   * **payment timing** and **payment method** (from gig preferences when set; otherwise defaults — **after completion** for timing) — both must be **visible and editable** in the draft; see [System rules — Payment timing](docs/system-rules.md#payment-timing)

3. Worker confirms

4. Agreement becomes locked

5. Until the gig is **completed**, either party may **cancel** (early vs late, notifications, signals): [Cancellation](docs/journeys/cancellation-flow.md).

---

### E. Completion Flow

After the **agreed gig end time**, completion opens for **both** parties independently (**symmetric** — neither side is assumed to report first). Full diagram and rules: [Gig completion](docs/journeys/gig-completion.md). **At agreed start time**, no-show / attendance handling (grace, user input, signals, then opening completion) — [No-show flow](docs/journeys/no-show-flow.md).

* Each side picks one of: **completed as agreed** · **partially completed** · **did not happen** (human wording in UI).
* **Both match** on the same tier → system adopts that outcome.
* **Disagree** → flag **mismatch / disputed** outcome; surface **soft dispute** UX (acknowledge, optional description, record both sides — **no** manual resolution in MVP): [System rules — Soft disputes](docs/system-rules.md#soft-disputes).
* **Response window** ends with only one submission → store **one-sided** outcome; other side **no response**.
* **Neither** submits → **unconfirmed**.
* Track **structured trust signals** separately from free-text feedback (worker/**client** no-show, cancellations by side) for reputation even when reviews are missing.

---

### F. Review / feedback flow (Double-Blind — MVP experiment)

Experience ratings after completion: form, optional dimensions, reveal timing, and copy rules — [Feedback flow](docs/journeys/feedback-flow.md). **Completion** answers *what happened*; **feedback** answers *how it was* (including limited wording when the gig **did not happen**).

Double-blind reviews ship **early in MVP** as a **deliberate experiment**, not as a final, frozen policy. Implementation should use **feature flags / config** so timeouts and rules can change as we learn.

**MVP behavior**

* After an agreement is **eligible for review** (per completion rules), each party may **submit** feedback; the **counterparty cannot see** the other’s text or star ratings until **reveal** (see journey doc for mutual vs one-sided paths).
* **Immediate reveal** when **both** parties have submitted.
* **Timeout reveal:** the journey doc uses **3 days** for auto-publish of **one-sided** feedback when the other party never submits; **§5.F historically used 7 days** for “both not yet in” double-blind — **reconcile to one clock** (or separate named timers) in config before ship.
* Feedback remains **editable by the author until publish**; after publish, it is **locked** (except any future admin/dispute tooling in later phases).

**Evaluation metrics (instrument from day one)**

* % of users who **submit** a review (of those eligible)
* % of **one-sided** reviews (only one party submitted before reveal)
* **Time to second review** (latency between first and second submission, when both exist)
* % of reveals due to **mutual submit** vs **timeout**
* **Rating variance / distribution** comparing **mutual-reveal** vs **timeout-reveal** cohorts (and optionally vs a future control if A/B tests are added)

Use these metrics to decide whether to keep, tune, or simplify double-blind post-MVP.

---

### G. Re-engagement Flow

On expiration:
- prompt user to:
  - repost
  - edit & repost
  - save as template

---

## 6. Structured Checklist System

Problem:

* Vague descriptions lead to disputes

Solution:

* Convert description → structured checklist

Example:

Cleaning checklist:

* Vacuum floors
* Mop floors
* Clean bathroom
* Clean kitchen
* Dust surfaces

Rules:

* Checklist is editable before agreement
* Locked after confirmation
* Used for dispute resolution

---

## 7. Reputation System

### Worker metrics:

* reliability (no-shows)
* quality
* communication

### Client metrics (posting party, doc terminology):

* fairness
* cancellation rate
* dispute rate

### 7.1 MVP trust composite (reviews + behaviour + completion)

**Principle:** trust is **not** only average star rating. For **MVP**, a single **internal trust composite** (0–1) combines **reviews**, **agreement outcomes** (completion, mismatch), and **behaviour signals** (no-show, cancellation). **Weights are config** — values below are the **default starting point**; tune with data.

#### Definitions (per user, agreement-scoped)

| Signal | Meaning | Denominator / scope |
| --- | --- | --- |
| **reviewScore** | Mean of **1–5 star** ratings received (published reviews). Optional later: **recency weights** on each review. | — |
| **completionRate** | Agreements that ended in a **successful completed** outcome vs agreements that **reached lock** (browse/chat only **excluded**). | `completed_agreements / total_locked_agreements` |
| **noShowRate** | No-show events attributed to this user vs **total_locked_agreements**. | Strongest negative; treat as **critical** in product policy. |
| **cancellationRate** | Cancellations attributed to this user vs **total_locked_agreements**. **Late** cancellations should weigh **more** in the numerator (e.g. config multiplier on late count before dividing by total) — exact rule in implementation config. |
| **mismatchRate** | **Mismatched** completion outcomes (see [Gig completion](docs/journeys/gig-completion.md)) vs **total_locked_agreements**. Captures conflict / disagreement. |

**Not in the default v0 composite (track for analytics & future dampening):** `mismatchRate` may feed a **separate** demotion or an added term `- (mismatchRate * β)` once β is calibrated — not part of the initial sum below until product turns it on.

#### Normalise to 0–1 before combining

* **reviewScore₁** = `(average star rating) / 5`.
* **completionRate**, **noShowRate**, **cancellationRate**, **mismatchRate** (if used): each in **\[0, 1\]** as ratio of counts to **total_locked_agreements** (handle **cold start**: if denominator is 0, skip composite or treat as “New” — see UI).

#### Default composite (engineering / product doc — **not shown in UI**)

```
trustComposite =
    (reviewScore₁ × 0.50)
  + (completionRate   × 0.25)
  − (noShowRate       × 0.15)
  − (cancellationRate × 0.10)
```

Clamp or re-normalise output to **\[0, 1\]** after summing if needed.

#### What the UI shows (**do not** expose the formula)

* **Stars + reviews:** show **average star rating** (1–5) and **count**, e.g. `⭐ 4.7 (32 reviews)` — this is the **familiar** review line.
* **Trust chip (qualitative):** derive from **trustComposite** + activity thresholds, e.g. **Reliable** · **New** · **Low activity** (exact strings are product copy; tune thresholds in config).

**Suggested MVP chip logic (starting point):**

* **New:** few locked agreements (e.g. **fewer than 3**) **or** very few reviews (e.g. **fewer than 5**).
* **Low activity:** no completed agreement in a long window (e.g. **90 days**) **or** very low `completionRate` with enough volume — config.
* **Reliable:** `trustComposite` above a threshold **and** enough volume (e.g. **at least 5** locked agreements) **and** not dominated by high `noShowRate` / `cancellationRate`.

Bad chips / risk states (e.g. high no-show) can be separate copy — align with [System rules — Soft disputes](docs/system-rules.md#soft-disputes) and moderation (§13).

---

## 8. Identity System

### Tier 1:

* nickname only
** can browse
** can send message
** can post limited number of gigs
** limited visibility
** cannot access sensitive categories

### Tier 2:

* phone verified (badge)
** full posting
** better visibility
** can receive reviews
** can be selected in agreements

### Tier 3 (future):

* ID verified
** access to sensitive categories
** higher trust badge
** priority matching

---

### Progressive identity reveal:

* browsing → minimal info
* messaging → partial
* agreement → full

---

### Premium (subscription layer)
* Paid users
** access to featured gigs
** auto-renew
** advanced analytics
** priority notifications
** other premium features

---

## 9. Expiration & Monetisation

Expiration is determined based on urgency and duration.

#### Urgency-based rules:

- ASAP → 24–48 hours
- Scheduled → until scheduled time + buffer
- Recurring → no expiration (auto-refresh required)
- Flexible → 5–7 days

#### Duration adjustment:

- <1h → shorter expiration
- 1–3h → standard
- Half-day → +1–2 days
- Full-day → +2–3 days

#### Additional rules:

- Listing auto-closes when agreement is created
- Activity (messages) may extend expiration slightly
---

### Monetisation:

* paid renewals
* featured listings
* priority ranking

---

## 10. AI Architecture (IMPORTANT)

### AI Abstraction Layer

```
interface AIService {
  classify(text): Category
  generateChecklist(data): Checklist
}
```

---

### Providers (pluggable)

```
class OpenAIProvider implements AIService {}
class AnthropicProvider implements AIService {}
class LocalModelProvider implements AIService {}
```

---

### Usage example:

```
ai.generateChecklist({
  category: "cleaning",
  description: "clean my apartment"
})
```

Payment **timing** suggestions by category (cleaning / transport → after completion; longer gigs → flexible) belong in the same assist layer — see [System rules — Payment timing](docs/system-rules.md#payment-timing); never override explicit user choices on the agreement.

---

### Configuration:

```
AI_PROVIDER=openai
```

---

## 11. AI Usage Rules

* AI suggests → user confirms
* Never auto-enforce decisions
* Trigger AI only:

  * on submit
  * on agreement creation

---

## 12. Cost Control Strategy

* Cache repeated prompts
* Use cheap models for:

  * classification
  * tagging
* Use stronger models only for:

  * checklist generation

---

## 13. Safety & Moderation (MVP)

* AI flags risky content
* No automatic bans
* Reduce visibility instead

**Soft disputes** (completion mismatch, cancellation conflict, no-show disagreement): the platform **records** both sides’ input and **does not** manually resolve or assign blame in MVP; copy and data rules — [System rules — Soft disputes](docs/system-rules.md#soft-disputes).

---

## 14. Cancellation System

Journey (who cancelled, early vs late, notifications, optional feedback, signals): [Cancellation](docs/journeys/cancellation-flow.md). If parties **conflict** on what happened (contested cancel, contradictory accounts), treat as **soft dispute** — [System rules — Soft disputes](docs/system-rules.md#soft-disputes).

Track:

* no-shows
* cancellations (by side; **late** vs early — see journey doc for “late” window, e.g. 12–24h before start)

Soft penalties (post-MVP / policy; **MVP** is signal-only per journey doc):

* reduced visibility
* temporary posting cooldown

---

## 15. Tech Stack Suggestion

### Backend:

* Node.js (NestJS or Express)
* PostgreSQL
* Redis (caching)

### Frontend:

* React / Next.js
* Mobile-first design

### Infra:

* Docker
* Deploy on cloud or self-hosted

---

## 16. Future Expansion (Phase B)

* Payment / escrow system
* AI dispute resolution (see also structured disputes / mediation in [System rules — Future soft disputes](docs/system-rules.md#future-soft-disputes))
* advanced recommendation system
* trust scoring algorithm
* local LLM deployment

---

## 17. Core Philosophy

* Fast to use
* Hard to abuse
* AI-assisted, human-controlled

---

## 18. Development Priority

1. Authentication + user system
2. Gig creation + search
3. Messaging
4. Agreement system
5. Review system
6. AI integration (basic)
7. Reputation scoring

## 19. Homepage Feed & Ranking System

### Overview

The homepage feed is designed to balance:

* urgency (real-time demand)
* relevance (user interest + location)
* freshness (new content)

The system avoids simple sorting (e.g. “urgent first”) and instead uses a **sectioned feed + blended ranking approach**.

---

### MVP weighted interest score (contextual ranking)

**Goal:** show the most **relevant** rows (**gigs** or **people**) for the **current user**, **page**, and **session context**. Everything below is **normalized to 0–1** per factor before weighting; **weights are config** (defaults are starting points).

#### Factors (building blocks)

| Factor | Meaning (MVP) |
| --- | --- |
| **locationScore** | **Nearby → high**, **remote → medium**, **far → low** (viewer ↔ gig or viewer ↔ worker, per product rules). |
| **urgencyScore** | **ASAP / equivalent → high**, **scheduled → medium**, **flexible → lower** (see [Urgency alignment](#urgency-and-intent-modifiers-alignment)). |
| **freshnessScore** | **Time decay**: newer → higher, older → lower (`created_at` or equivalent). |
| **categoryScore** | Match to **past behaviour** (implicit) and/or **current search / filter intent**. |
| **trustScore** | **Ranking input** derived from **[§7.1](#71-mvp-trust-composite-reviews--behaviour--completion)** (`trustComposite` or a **monotone** map of it to \[0, 1\]) so higher-trust entities rank higher when this term applies. |
| **engagementScore** | **Chats**, **saves**, and similar light signals (omit or renormalize when unknown — see [Cold start](#cold-start-zero-or-unknown-engagement) below). |
| **keywordMatch** | **Search only**: textual / structured relevance to query. |
| **responsiveness** | **Profile / worker lists** (e.g. reply latency, accept rate) — **MVP** may use **simple proxies** until real metrics exist; **TBD** in config. |

#### Context: which factors matter most (priority order)

| Context | Priority order (first = most influential) |
| --- | --- |
| **Gig feed** (discovery) | `location` → `urgency` → `freshness` → `category` → `trust` (and optionally **`engagement`** in the **Nearby & Relevant** blend per [Ranking blend](#ranking-blend-nearby--relevant) below). |
| **Profile list** (worker discovery) | `trust` → **category / skill fit** → **`responsiveness`** → `location` |
| **Gig search** (intent-driven) | **`keywordMatch`** → `category` → `location` → `urgency` → `freshness` → `trust` |
| **Worker search** (intent-driven) | **`keywordMatch`** → `category` → `trust` → `location` → `freshness` |

#### Example blends (not code — **defaults**, tune in config)

**Gig feed (global discovery strip / default blend):**

```
interestScore =
  locationScore  * 0.30
+ urgencyScore   * 0.25
+ freshnessScore * 0.20
+ categoryScore  * 0.15
+ trustScore     * 0.10
```

**Worker search:**

```
interestScore =
  keywordMatch   * 0.40
+ categoryScore  * 0.20
+ trustScore     * 0.20
+ locationScore  * 0.10
+ freshnessScore * 0.10
```

**Gig search (starting-point weights — align with priority row above):**

```
interestScore =
  keywordMatch   * 0.35
+ categoryScore  * 0.20
+ locationScore  * 0.15
+ urgencyScore   * 0.10
+ freshnessScore * 0.10
+ trustScore     * 0.10
```

**Profile / worker list (worker discovery — starting-point weights):**

```
interestScore =
  trustScore         * 0.35
+ categorySkillScore * 0.25
+ responsiveness     * 0.20
+ locationScore      * 0.20
```

(`categorySkillScore` = category / skill fit for the listing or filter context.)

**UI:** do **not** show raw `interestScore` or weights to end users. Use **ordering**, sectioning, and light **badges** / copy only.

---

### Homepage Structure (MVP)

The homepage is divided into sections:

#### ⚡ Urgent Now

* Shows **ASAP-equivalent** gigs (see **[Urgency and intent modifiers (alignment)](#urgency-and-intent-modifiers-alignment)** — e.g. `urgency = NOW` on Gig until schema extends)
* Includes gigs **expiring soon** (per expiration rules)
* Limited to a small number of items (e.g. 5–10)
* Sorted by:

  * time remaining
  * proximity

---

#### 📍 Nearby & Relevant

* Main feed
* Mix of all urgency types
* Sorted by **blended ranking score** for **this section only** (see **Per-section scoring** and **Ranking blend (Nearby & Relevant)** below):

  * proximity (primary)
  * freshness
  * engagement (messages, clicks)
  * light urgency boost

---

#### 🆕 New Gigs

* Recently created gigs
* Sorted by creation time (newest first)
* Helps ensure visibility for new posts

---

#### 🔁 Flexible & Recurring

* Longer-term opportunities; **lower time sensitivity** than the Urgent strip.
* **Flexible:** `urgency = FLEXIBLE` on Gig (see §3 Gig and **[alignment](#urgency-and-intent-modifiers-alignment)**).
* **Recurring:** use **[Intent Modifiers](#intent-modifiers-core-differentiator)** concept **RECURRING** — persist with **recurrence fields on Gig** (or extended `urgency` / enums) when added to §3; **do not** treat `urgency = RECURRING` as a Gig enum value until the schema explicitly defines it.

---

### Per-section scoring

**MVP contract:** each homepage **section** uses its **own** simplified score or sort — **not** one global formula for every row. The UI composes sections in product order; **each section’s ranker** only uses the signals that matter for that strip.

| Section | Ranking intent (simplified) |
| --- | --- |
| **Urgent Now** | Small cap; **time remaining** primary, **proximity** secondary; eligibility = ASAP-equivalent + expires-soon rules. |
| **Nearby & Relevant** | Full **weighted blend** (formula below); proximity-heavy. |
| **New Gigs** | **`created_at` descending**; optional weak tie-breakers only. |
| **Flexible & Recurring** | **Filter** by eligibility (flexible + recurring per schema when ready); **mild** ordering (e.g. proximity or recency) — not the same blend as Nearby unless product explicitly reuses it. |

---

### Ranking blend (Nearby & Relevant)

For the **main** section, each eligible gig gets a **section-local** score from normalized factors:

```ts
nearby_relevant_score =
  (urgency_weight * urgency_score) +
  (proximity_weight * distance_score) +
  (freshness_weight * recency_score) +
  (engagement_weight * interaction_score) +
  (relevance_weight * user_preference_score)
```

Other sections use **subsets** of these factors or **pure sorts** as in the table above.

---

### Score normalization and weights

* Map each raw signal to a **comparable subscore** (e.g. **0–1**): distance → `distance_score`, age → `recency_score`, etc., so weights are interpretable.
* **`_*_weight`** values are **tunable** (config / feature flags); record **defaults** when the ranker ships. If a section **drops** a term (e.g. New Gigs has no engagement), **renormalize** weights for that section so total influence stays intentional.

---

### Cold start (zero or unknown engagement)

When **interaction** data is missing or near-zero for a gig (new post, new user, or sparse telemetry):

* **Recommended for MVP — term dropping + renormalization:** for **Nearby & Relevant**, treat engagement as **unknown** for that gig: **omit** the engagement term from the blend and **redistribute** its weight across **proximity**, **freshness**, and **relevance** (and light urgency) so `engagement_weight * 0` does **not** bury new listings.

* **Alternative — neutral prior:** instead of omitting, map unknown engagement to a **mid prior** (e.g. **0.4–0.5** on a 0–1 scale) and replace it with real `interaction_score` as impressions and actions accrue; tune the prior down as data density increases.

* **Instrumentation:** log **impressions**, **taps**, and **messages** with **feed position** so cold start can be measured and the chosen rule validated.

---

### Key Principles

* Urgency influences ranking but does not dominate it
* No single factor should exceed ~40% influence
* Prevent feed domination by any single category or urgency type

---

### Urgency Handling

* ASAP gigs:

  * boosted in "Urgent Now" section
  * decay quickly over time

* Scheduled gigs:

  * increase visibility as scheduled time approaches

* Flexible gigs:

  * stable visibility over longer period

* Recurring gigs:

  * re-surface periodically

---

### Time Decay (Important Mechanism)

Urgent gigs lose visibility quickly if not engaged:

```ts
urgency_score = base_score * exp(-time_since_post)
```

---

### Feed Diversity (Soft Quotas)

To prevent imbalance:

* Limit urgent gigs to ~30–40% of visible items
* Ensure mix of:

  * categories
  * urgency types
  * new vs older listings

---

### User Interaction (MVP)

* No homepage toggle required
* Users can:

  * search via search bar
  * apply filters (category, location, urgency)
* **No map-based discovery** in MVP (see §5.B); optional **single-gig** map on detail only.

---

### Future Enhancements

* personalization based on user behavior
* AI-assisted ranking
* dynamic section ordering
* smart resurfacing of relevant gigs
* **Map + list** discovery (many gigs on a map) if product data supports it

---

### Design Principle

> Urgency should influence visibility — not control it.

---

## 20. Dual-Sided UX (Find Help vs Find Work)

### Overview

The platform supports users acting as both:

* people who need help (**clients** in agreement context — doc/code term, not a permanent profile type)
* people who offer help (**workers** in agreement context — same caveat)

The system does NOT enforce fixed roles.
Instead, it uses **intent-based context switching**.

---

### Core Principle

> Users are not permanently “workers” or “clients” — the same person can do both.
> The UI adapts to what they want to do at the moment, with **natural language** over rigid role labels ([§1.2](#12-documentation-roles--ui-voice)).

---

### Homepage Behavior (MVP)

#### Default View

* Default tab: **Find help**
* Shows gigs where users can hire someone
* This is the primary entry point

---

#### Context Toggle

At the top of the homepage:

```plaintext
🔍 Find help   |   💼 Find work
```

---

#### Behavior

* Toggle switches **context**, not user role
* Instant switch (no reload, no onboarding)
* Does not change user identity or permissions

---

### Feed Behavior Per Context

#### 🔍 Find Help (Default)

Shows:

* gigs posted by others requesting help

Sections:

* Urgent Now
* Nearby & Relevant
* New Gigs

---

#### 💼 Find Work

Shows:

* gigs users can perform (job opportunities)

Sections:

* Urgent Jobs
* Nearby Jobs
* New Opportunities

---

### Posting Flow

When user clicks “Post”:

```plaintext
What do you want to post?

[ I need help ]
[ I offer help ]
```

---

#### Behavior

* User selects intent per post
* No permanent role assignment
* Same user can create both types

---

### Optional Mixed Discovery (Limited)

To support exploration without confusion:

#### Small section on homepage:

“💡 People offering help near you”

* limited to 3–5 items
* secondary to main feed
* does not dominate UI

---

### Smart Defaulting (Future)

System may adjust default tab based on behavior:

* frequent hiring → default to “Find help”
* frequent working → default to “Find work”

Rules:

* always reversible
* no hard lock-in

---

### What This Avoids

* No forced role selection at onboarding
* No separate “worker mode” or “client mode”
* No mixed, confusing feeds

---

### Design Principle

> Separate by intent at interaction, not by identity at entry.

---

END
