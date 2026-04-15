# Persona: Worker / Geek Seeker (finds gigs, gets hired) — documentation only

In **docs and code**, **worker** means the party **performing the gig** under a given **agreement** (or chatting toward hire). It is **not** a permanent account label: the same person can be a **client** on another gig. See [Personas README](README.md) and [`../../giggi.md`](../../giggi.md) §1.2.

Someone who **earns from gigs**: discovers work, messages people who posted listings, may be hired on an agreement, shows up (or not), completes the **completion** step, and leaves **feedback**.

**Related product rules:** [System rules](../system-rules.md) (soft disputes, payment fields as **read** on agreement, messaging concurrency).

---

## Jobs to be done

- Find relevant gigs quickly (location, urgency, category).
- Talk to people who posted gigs without friction; keep **many parallel chats** across gigs if needed.
- Understand pay intent before committing; **accept** a clear agreement (timing, method, checklist).
- Close the loop honestly after the gig (completion + feedback).

---

### Behaviors
- Scrolls feed quickly (like social media)
- Decides in seconds whether a gig is relevant
- Prefers chat over formal applications
- May contact multiple gigs at once

---

### Needs
- Clear title and category
- Visible compensation
- Location relevance (nearby or remote)
- Trust signals (rating, past activity)

---

### Pain Points
- Vague descriptions (“clean house” without detail)
- Hidden expectations
- Unresponsive posters (**clients** in doc terms)
- Fear of unfair treatment or non-payment

---

### Trust Signals That Matter
- **Client** / poster reputation (ratings, history)
- Clear agreement before work
- Fair feedback system
- Completion history

---

### UX Implications
- Feed must be fast and scannable
- Gig cards must be text-first and structured
- “Chat” must be one-click and frictionless
- Agreement must clarify expectations clearly

---

## End-to-end journey map

| Order | Journey | Worker’s experience |
| ---: | --- | --- |
| 1 | [Home → browse → chat](../journeys/home-to-chat.md) | Opens app, browses, may hit **sign-in** to chat. Primary entry. |
| 2 | [Browse → create ad](../journeys/browse-to-create-ad.md) | **Secondary** — someone acting as worker might still **post an offer** or follow “can’t find a worker → create ad” paths; not every worker’s core loop. |
| 3 | [Gig creation](../journeys/gig-creation.md) | **Secondary** — only when **creating** a listing, not when only applying. |
| 4 | [Browse → hire](../journeys/browse-to-hire.md) | **Core** — **Worker clicks gig** → detail → **Chat** with gig context → counterparty (**client** in doc terms) may **Hire**. |
| 5 | [Agreement negotiation](../journeys/agreement-negotiation.md) | **Core** — reviews draft, **accept / edit / reject**; must see **payment timing & method** on the agreement. |
| 6 | [Cancellation](../journeys/cancellation-flow.md) | **Branch** — worker may **cancel** before completion; may hit **soft dispute** if accounts conflict. |
| 7 | [No-show](../journeys/no-show-flow.md) | **Branch** — at start time: attest attendance; may be marked no-show or dispute narrative → [soft disputes](../system-rules.md#soft-disputes). |
| 8 | [Gig completion](../journeys/gig-completion.md) | **Core** after work window — submits **completion claim**; mismatch → soft dispute UX. |
| 9 | [Feedback flow](../journeys/feedback-flow.md) | **Core** — stars + optional detail; reveal rules apply. |

**Typical happy path (short):** 1 → 4 → 5 → 8 → 9 (with 6–7 only when something goes wrong).

---

## Notes for design & eng

- **Inbox** must stay legible with **many threads** ([messaging concurrency](../system-rules.md#messaging-concurrency)).
- Worker often **does not** initiate Hire; they still need clarity when the **client** sends an agreement draft — **surface copy** should use **names**, not “the client” as a cold label ([`../../giggi.md`](../../giggi.md) §1.2).
