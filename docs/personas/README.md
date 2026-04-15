# Personas (E2E experience maps)

Each persona file maps **documentation roles** to **which journeys** they touch, in roughly the same order as [`giggi.md` §1.1](../../giggi.md#giggi-1-1). Journey diagrams stay in [`../journeys/`](../journeys/README.md); personas do **not** duplicate Mermaid.

---

## Naming (documentation & code only)

| Persona doc | Term in docs / schema | Meaning in context |
| --- | --- | --- |
| [Worker](worker.md) | **Worker** | The party **doing the gig** under a given **agreement** (or applying via chat toward one). |
| [Client](client.md) | **Client** | The party who **posted the gig** and **initiates hire** for that agreement. |

**Important**

- **No global role:** a **user** is never permanently a “worker” or “client”. The same account can post one gig and take another. **Worker** and **client** describe the **relationship for that gig or agreement**, not profile types.
- **UI copy:** prefer **soft, natural language** — e.g. *“How was your experience with Anna?”* — not rigid labels like *“Leave feedback for your client.”* See [`giggi.md` §1.2](../../giggi.md#giggi-1-2) and [`../ui/README.md`](../ui/README.md).

---

## Contents

| Doc | Focus |
| --- | --- |
| [Worker — find gigs & get hired](worker.md) | Discovery → chat → hire → agreement → execute → complete → feedback (+ branches). |
| [Client — post gigs & hire](client.md) | Create listing → chat / hire → agreement → execute → complete → feedback (+ branches). |
