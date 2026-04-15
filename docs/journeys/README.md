# User journeys

Mermaid flowcharts for **navigation and auth gates**, one file per journey. They complement narrative flows in [`../../giggi.md`](../../giggi.md) §5.

| Journey | Summary |
| --- | --- |
| [Home → browse → chat](home-to-chat.md) | App entry, signed-out vs signed-in home, browse gigs, chat gate + sign-in |
| [Browse → create ad](browse-to-create-ad.md) | Search/browse, worker-focused path + prompt, create gig flow + publish |
| [Gig creation](gig-creation.md) | Auth, creation source, AI parse + pre-fill, required fields loop, publish |
| [Browse → hire](browse-to-hire.md) | Worker vs employer paths into gig-context chat, Hire → AI → agreement draft |
| [Agreement negotiation](agreement-negotiation.md) | Draft → versioned accept / edit / reject; expiry rules; lock + AI scope |
| [Gig completion](gig-completion.md) | After agreed end time: two-sided claims, match/mismatch, window timeouts → feedback |
| [Feedback flow](feedback-flow.md) | Stars + optional text/dimensions; reveal rules; 3-day one-sided path; edit until publish |

Add a new row here when you add a chart file.
