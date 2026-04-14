# Gig Marketplace Platform (Working Name)

## 1. Product Definition

A hyper-local marketplace for **irregular, one-off gigs** where:

* Posting is **fast and effortless**
* Discovery is **location-based and intent-driven**
* Trust is built gradually through **agreements, reviews, and verification**
* AI assists users but does not replace user control

Core principle:

> Structured UI + Open marketplace + AI-assisted workflows

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
* effort_level (QUICK | NORMAL | HEAVY)
* urgency (NOW | TODAY | WEEK | FLEXIBLE)
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

---

### Agreement (CRITICAL ENTITY)

* id
* gig_id
* employer_id
* worker_id
* scheduled_time
* price
* location
* checklist (JSON array)
* status (PENDING | CONFIRMED | COMPLETED | DISPUTED | CANCELLED)
* created_at

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

---

## 5. User Flow

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

---

### C. Messaging Flow

* Users communicate freely
* No structured application system
* CTA: "Hire this person"

---

### D. Agreement Flow (Core Trust System)

1. Employer clicks "Hire"

2. System pre-fills:

   * time
   * price
   * checklist
   * location

3. Worker confirms

4. Agreement becomes locked

---

### E. Completion Flow

After job:

* Employer selects:

  * completed
  * minor issues
  * not completed

* Worker confirms or disputes

---

### F. Review Flow (Double-Blind — MVP experiment)

Double-blind reviews ship **early in MVP** as a **deliberate experiment**, not as a final, frozen policy. Implementation should use **feature flags / config** so timeouts and rules can change as we learn.

**MVP behavior**

* After an agreement is **eligible for review** (per completion rules), each party may **submit** a review; the **counterparty cannot see** the other’s review text or ratings until **reveal**.
* **Immediate reveal** when **both** parties have submitted.
* **Auto-reveal after 7 days** if both reviews are not yet in (timeout path); define the **start of the 7-day window** in implementation (e.g. from agreement completion or from first submission) and document it consistently.
* Reviews remain **editable by the author until reveal**; after reveal, they are **locked** (except any future admin/dispute tooling in later phases).

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

### Employer metrics:

* fairness
* cancellation rate
* dispute rate

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

---

## 14. Cancellation System

Track:

* no-shows
* cancellations

Soft penalties:

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
* AI dispute resolution
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

### Homepage Structure (MVP)

The homepage is divided into sections:

#### ⚡ Urgent Now

* Shows gigs with urgency = ASAP
* Includes gigs expiring soon
* Limited to a small number of items (e.g. 5–10)
* Sorted by:

  * time remaining
  * proximity

---

#### 📍 Nearby & Relevant

* Main feed
* Mix of all urgency types
* Sorted by blended ranking score:

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

* Gigs with:

  * urgency = FLEXIBLE
  * urgency = RECURRING
* Longer-term opportunities
* Lower time sensitivity

---

### Ranking Algorithm (Simplified)

Each gig is assigned a score:

```ts
score =
  (urgency_weight * urgency_score) +
  (proximity_weight * distance_score) +
  (freshness_weight * recency_score) +
  (engagement_weight * interaction_score) +
  (relevance_weight * user_preference_score)
```

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

* people who need help (employers)
* people who offer help (workers)

The system does NOT enforce fixed roles.
Instead, it uses **intent-based context switching**.

---

### Core Principle

> Users are not “workers” or “employers” — they are both.
> The UI adapts to what they want to do at the moment.

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
* No separate “worker mode” or “employer mode”
* No mixed, confusing feeds

---

### Design Principle

> Separate by intent at interaction, not by identity at entry.

---

END
