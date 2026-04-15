# Home → browse → chat

High-level path from opening the app to entering chat, including **home variant** by auth and **sign-in** when opening chat while signed out.

```mermaid
flowchart TD
    A[Open App] --> B{Signed in?}

    B -->|No| C1[Generic Home]
    B -->|Yes| C2[Curated Home]

    C1 --> E[Browse Gigs]
    C2 --> E

    E --> F[Open Chat]

    F --> G{Signed in?}

    G -->|No| D[Sign In Page]
    G -->|Yes| H[Chat]

    D --> H
```

**Concurrency:** opening **Chat** is not limited to a single gig or thread. Workers may have **many active chats** (different gigs/posters); posters may have **several threads per gig**. See [System rules — Messaging concurrency](../system-rules.md#messaging-concurrency).
