# System rules (product)

Canonical **non-journey** rules: behaviour, copy expectations, and field rules that apply across flows. **Journey diagrams** stay in [`journeys/`](journeys/README.md). Product overview: [`../giggi.md`](../giggi.md#giggi-1-1).

When you add a new topic, append a **##** section below and a row in the [Table of contents](#table-of-contents).

---

## Table of contents

| Section | Summary |
| --- | --- |
| [Soft dispute handling (MVP)](#soft-disputes) | Mismatch / cancel conflict / no-show disagreement: acknowledge, record, no manual ruling. |
| [Payment timing and method](#payment-timing) | Optional on gig, required on agreement; methods, defaults, AI hints. |
| [Messaging concurrency](#messaging-concurrency) | Workers: many gigs/chats; poster: many chats per gig, many hires (agreements) per gig. |
| **Trust composite (MVP)** | Defined in [`../giggi.md` §7.1](../giggi.md#giggi-7-1) — reviews + completion + behaviour; UI shows stars + qualitative chip only. |
| **Interest / ranking (MVP)** | Weighted scores by context (feed, search, profiles) in [`../giggi.md` §19](../giggi.md#giggi-19-interest) — factors + example blends; **not** shown as raw numbers in UI. |

---

<a id="soft-disputes"></a>

## Soft dispute handling (MVP)

When something goes wrong between parties, the product **acknowledges the issue**, **collects structured input and feedback**, and **uses that signal to improve the system**. In **MVP** we **do not** manually resolve disputes, assign blame, or act as a court.

**Context:** [`../giggi.md` §1.1](../giggi.md#giggi-1-1), [§5.E](../giggi.md#giggi-5-e), [§13](../giggi.md#giggi-13)–[§14](../giggi.md#giggi-14).

### When triggered

- **Completion mismatch** — parties’ completion claims disagree ([Gig completion](journeys/gig-completion.md) mismatch path).
- **Cancellation conflict** — conflicting accounts or contested cancel ([Cancellation](journeys/cancellation-flow.md)).
- **No-show disagreement** — conflicting narratives about who attended ([No-show flow](journeys/no-show-flow.md)).

### User experience

Show a calm, non-accusatory message, for example:

> It looks like this gig didn’t go as expected.  
> We’re still improving the system and your feedback helps us make it better.

Tone: **empathy**, **no blame**, **clear that this is not a ruling**.

### Actions for the user

- **Submit feedback** (including optional free text: what happened).
- **Continue using the platform** (no forced escalation path in MVP).

### System behavior (MVP)

- **Record** the mismatch / conflict type and link to the gig or agreement.
- **Record both sides’** submissions when each party provides input.
- **Do not** attempt **manual resolution** by staff in MVP.
- **Do not** present a definitive “you are right / wrong” outcome to either party from the platform.

### Data usage

Use collected events (and optional text, with moderation where needed) to:

- Improve **matching** and ranking.
- Improve **AI** suggestions (drafting, checklists, prompts).
- **Detect bad actors** (patterns across gigs, not single-instance public shaming).
- **Refine trust scoring** over time, consistent with [`../giggi.md` §14](../giggi.md#giggi-14) and journey trust-signal notes.

<a id="future-soft-disputes"></a>

### Future — soft disputes (Phase B)

- Structured **dispute categories**
- **Evidence** upload (photos, messages export, etc.)
- Optional **mediation** or paid dispute resolution

Align with [`../giggi.md` §16](../giggi.md#giggi-16) (e.g. AI dispute resolution, trust scoring) when scoping.

---

<a id="payment-timing"></a>

## Payment timing and method

**MVP scope:** the platform does **not** process payments or escrow ([`../giggi.md` §2](../giggi.md#giggi-2), [§16](../giggi.md#giggi-16)). These fields exist so ads and **agreements** make **how and when** payment is expected **explicit**, reducing friction and disputes. All values are **disclosure + commitment** only until a payments product exists.

### Field location

| Stage | Role |
| --- | --- |
| **Gig / ad** | **Optional** hints: poster may set preferred payment timing and method so workers see intent early ([Gig creation](journeys/gig-creation.md), feed/card — [Gig card](ui/components/gig-card.md)). |
| **Agreement** | **Required** before lock: chosen **payment timing** and **payment method** must appear in the negotiated agreement text/UI so both parties accept the same version ([Agreement negotiation](journeys/agreement-negotiation.md), [`../giggi.md` §3 Agreement](../giggi.md#giggi-3-agreement), [§5.D](../giggi.md#giggi-5-d)). |

### Options — payment timing

| Value | Meaning |
| --- | --- |
| **After completion** | Default — pay when work is done (as defined in agreement / completion flow). |
| **Partial upfront + after completion** | Split: portion before / portion after; amounts belong in agreement compensation text or structured fields when you add them. |
| **Flexible / discuss in chat** | No fixed schedule in the ad; must still be **resolved to a concrete choice** (or explicit “flexible” copy) in the agreement before lock. |

**Default:** **After completion** everywhere a default applies (new gig form, agreement pre-fill when gig was silent).

### Options — payment methods

| Method | Follow-up UI |
| --- | --- |
| **Cash** | Require **contact / identifier field** (e.g. phone number) for how parties coordinate handoff — store only what product policy allows (PII rules). |
| **Mobile pay / Bank transfer** | Same: **input field** for the relevant number or identifier (e.g. phone for mobile pay, account reference if allowed in your region). |
| **Other compensation** | Free-text or structured “other” (barter, in-kind); no extra number field unless product adds one. |

Agreement UI must **show the selected method** (and timing) **explicitly** in the version both parties accept.

### AI suggestions (assist only)

AI may **suggest** defaults from **category** (user can override):

| Category / pattern | Suggested timing |
| --- | --- |
| Cleaning | After completion |
| Transport | After completion |
| Longer / multi-day gigs | Flexible / discuss in chat (then narrow in agreement) |

Suggestions feed **gig creation** and **agreement draft** pre-fill; they **never** auto-lock an agreement ([`../giggi.md` §10](../giggi.md#giggi-10), agreement journey AI rules).

### Implementation checklist

- [ ] Gig schema + create/edit form: optional timing + method; default timing = after completion.
- [ ] Agreement schema + draft + review: required timing + method; conditional detail field for cash / mobile / bank.
- [ ] Card + detail surfaces: show gig-level hints when present ([Gig card](ui/components/gig-card.md)).
- [ ] Copy and validation aligned with [`../giggi.md` §3](../giggi.md#giggi-3) and [§5.D](../giggi.md#giggi-5-d).

---

<a id="messaging-concurrency"></a>

## Messaging concurrency

**Worker (applicant) side**

- A worker may **chat and pursue as many gigs as they want in parallel** (many concurrent threads with different posters and/or gigs). The product does **not** force a single active “application” pipeline in MVP.

**Client (gig poster) side**

- For **one gig**, the poster may run **multiple concurrent chats** (e.g. several interested workers at once).
- The poster may **hire more than one worker for the same gig** when the work supports it (e.g. crew, shifts, multiple roles). Each hire is a **separate agreement** (`gig_id` shared, **distinct** `worker_id` / agreement row). Do not assume one chat or one agreement per gig.

**Product / UI**

- Inbox, notifications, and gig detail must make **thread identity** obvious (who, which gig, status) so parallel conversations stay legible.
- Journey references: [Home → chat](journeys/home-to-chat.md), [Browse → hire](journeys/browse-to-hire.md); narrative: [`../giggi.md` §5.C](../giggi.md#giggi-5-c).

