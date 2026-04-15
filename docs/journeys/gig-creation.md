# Gig creation (AI-assisted form)

From **Start Create Gig** through auth, **creation source** (worker search vs blank), prompt assembly, **AI parse → pre-fill**, user completion of required fields, review, and publish. Expands the “Create Gig Flow” step in [Browse → create ad](browse-to-create-ad.md).

```mermaid
flowchart TD
    A[Start Create Gig] --> B{Signed in?}

    B -->|No| C[Sign In Page]
    B -->|Yes| D{Creation source?}

    C --> D

    D -->|From worker search| E[Use search query as prompt]
    D -->|From blank create| F[Ask for short title]
    F --> G[Use title as prompt]

    E --> H[AI / system parses prompt]
    G --> H

    H --> I[Pre-fill creation form]
    I --> J[Fill as many fields as possible]
    J --> K[Highlight fields still requiring user input]

    K --> L[User reviews and edits form]
    L --> M{All required fields complete?}

    M -->|No| N[Prompt user to complete highlighted fields]
    N --> L

    M -->|Yes| O[Review summary]
    O --> P[Confirm creation]
    P --> Q[Gig published]
```

## Payment timing & method (on the gig)

- **Optional** on the ad: poster can set **payment timing** preference and **payment method** so discovery surfaces intent early.
- **Defaults:** timing = **after completion**; method unset until user chooses.
- **Methods** that need coordination (cash, mobile pay / bank transfer) should open the **number or identifier** field in the form (see [System rules — Payment timing](../system-rules.md#payment-timing)).
- AI may **suggest** timing from **category** (e.g. cleaning → after completion; longer gigs → flexible); user always overrides.
