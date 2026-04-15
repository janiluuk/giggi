# Persona: Client / Geek Poster (posts gigs, hires workers) — documentation only

In **docs and code**, **client** means the party who **posted the gig** and **initiates hire** for a given **agreement** context. It is **not** a permanent account label: the same person can act as a **worker** on another gig. See [Personas README](README.md) and [`giggi.md` §1.2](../../giggi.md#giggi-1-2).

Someone who **needs work done**: publishes a listing, talks to workers (possibly several at once for one gig), sends **Hire**, negotiates the **agreement**, may **cancel**, participates in **completion** and **feedback**.

**Related product rules:** [System rules](../system-rules.md) (soft disputes, **payment timing/method** on gig + required on agreement, messaging concurrency).

---

## Jobs to be done

- Publish a clear gig fast (optional AI assist); set **payment hints** on the listing when useful.
- Compare or chat with **multiple workers** in parallel for the same gig; **hire** more than one worker when the job needs a crew (separate agreements).
- Lock a fair **agreement** (checklist, pay timing/method, schedule).
- Close the gig with **completion** and honest **feedback**; handle friction via **soft dispute** paths, not ad-hoc rulings in MVP.

---

### Goals
- Describe a task quickly
- Find a suitable person fast
- Ensure the work is done as expected
- Avoid wasting time with unreliable workers

---

### Behaviors
- Often starts with a vague idea (“need cleaning help”)
- May browse workers before posting
- Prefers quick interaction over formal hiring
- May talk to multiple people before choosing

---

### Needs
- Easy gig creation (minimal typing)
- Help structuring the task (AI suggestions)
- Ability to compare workers quickly
- Clear agreement before hiring

---

### Pain Points
- Not finding suitable workers
- Workers not showing up
- Miscommunication about expectations
- Time wasted in back-and-forth chat

---

### Trust Signals That Matter
- Worker rating
- Completion rate
- No-show / cancellation history
- Clear communication in chat

---

### UX Implications
- Creation flow must be extremely simple (prompt-based)
- AI should help structure the gig
- Chat should lead naturally to hiring
- Agreement should remove ambiguity

## End-to-end journey map

| Order | Journey | Client’s experience (doc terminology) |
| ---: | --- | --- |
| 1 | [Home → browse → chat](../journeys/home-to-chat.md) | Opens app; may browse or go straight to **messaging** / inbox. **Sign-in** to chat when needed. |
| 2 | [Browse → create ad](../journeys/browse-to-create-ad.md) | **Core for hiring use case** — search/browse (including **worker-focused** search), optional prompt into **create ad** path. |
| 3 | [Gig creation](../journeys/gig-creation.md) | **Core** — auth, creation source, AI pre-fill, publish listing; optional **payment** hints on gig. |
| 4 | [Browse → hire](../journeys/browse-to-hire.md) | **Core** — **Client opens messaging** → existing or new chat → optional **gig attachment** → **Hire** → draft. |
| 5 | [Agreement negotiation](../journeys/agreement-negotiation.md) | **Core** — sends/reviews versions; **payment timing & method** required and visible on every version. |
| 6 | [Cancellation](../journeys/cancellation-flow.md) | **Branch** — client may **cancel**; notify worker; contested facts → [soft disputes](../system-rules.md#soft-disputes). |
| 7 | [No-show](../journeys/no-show-flow.md) | **Branch** — if worker (or both) absent; notifications; then completion flow. |
| 8 | [Gig completion](../journeys/gig-completion.md) | **Core** — submits **completion claim**; mismatch → soft dispute UX. |
| 9 | [Feedback flow](../journeys/feedback-flow.md) | **Core** — rate the other party; reveal rules apply. |

**Typical happy path (short):** 1 → 2 → 3 → 4 → 5 → 8 → 9 (with 6–7 only when something goes wrong).

---

## Notes for design & eng

- **Multiple chats per gig** and **multiple hires** mean inbox and gig detail must show **thread + agreement state** clearly ([messaging concurrency](../system-rules.md#messaging-concurrency), [`giggi.md` §3 Agreement](../../giggi.md#giggi-3-agreement) — many agreements per `gig_id`).
- In agreement context, the **client** usually clicks **Hire** first; **UI strings** should still use **natural language** (names, “How was it working with…?”), not “your client” as a global role — see [`giggi.md` §1.2](../../giggi.md#giggi-1-2) and [`../ui/README.md`](../ui/README.md).
