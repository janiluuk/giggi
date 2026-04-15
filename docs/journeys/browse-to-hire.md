# Browse → hire (worker vs client entry)

How **chat with gig context** is reached from a **worker** path (gig detail) vs a **client** path (messaging — doc term for gig poster), then **Hire** → AI context → **agreement draft**. The same gig may have **several parallel chats** (poster ↔ different workers); each **Hire** creates its own agreement. Workers may be in **many chats across gigs** at once — [System rules — Messaging concurrency](../system-rules.md#messaging-concurrency). Next: [Agreement negotiation](agreement-negotiation.md). Background trust rules: [`../../giggi.md`](../../giggi.md) §5.D. Roles: [`../../giggi.md`](../../giggi.md) §1.2.

```mermaid
flowchart TD
    A{Entry point?} -->|Worker clicks gig| B[View gig details]
    A -->|Client opens messaging| C{Entry type?}

    B --> D[Click Chat]
    D --> E[Chat opens with gig context]

    C -->|Worker initiated chat| F[Open existing chat with gig context]
    C -->|Client starts chat| G[Select user / start new chat]

    G --> H{Attach a gig to chat?}
    H -->|Yes| I[Choose which gig to show in chat]
    H -->|No| J[Continue without gig]

    E --> K[Chat]
    F --> K
    I --> K
    J --> K

    K --> L[Client clicks Hire]

    L --> M[AI gathers context from chat and attached gig if available]
    M --> N[Generate agreement draft]
```
