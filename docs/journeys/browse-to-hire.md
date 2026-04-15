# Browse → hire (worker vs employer entry)

How **chat with gig context** is reached from a **worker** path (gig detail) vs an **employer** path (messaging), then **Hire** → AI context → **agreement draft**. Next: [Agreement negotiation](agreement-negotiation.md). Background trust rules: [`../../giggi.md`](../../giggi.md) §5.D.

```mermaid
flowchart TD
    A{Entry point?} -->|Worker clicks gig| B[View gig details]
    A -->|Employer opens messaging| C{Entry type?}

    B --> D[Click Chat]
    D --> E[Chat opens with gig context]

    C -->|Worker initiated chat| F[Open existing chat with gig context]
    C -->|Employer starts chat| G[Select user / start new chat]

    G --> H{Attach a gig to chat?}
    H -->|Yes| I[Choose which gig to show in chat]
    H -->|No| J[Continue without gig]

    E --> K[Chat]
    F --> K
    I --> K
    J --> K

    K --> L[Employer clicks Hire]

    L --> M[AI gathers context from chat and attached gig if available]
    M --> N[Generate agreement draft]
```
