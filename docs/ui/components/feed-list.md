# Feed list

**Status:** Draft  
**Related:** [`ui-system.md`](../../ui-system.md) §4, §16; [Gig card](gig-card.md); [`tokens.md`](../tokens.md)

## Purpose

Vertical **scrollable** list of gigs: stable layout, clear loading / empty / error behavior, preserves context on retry.

## Anatomy

- Container: full-width column, vertical rhythm from `tokens.md` spacing.
- Rows: [Gig card](gig-card.md) instances; optional section headers / filters TBD.

## States

| State | Behavior |
| --- | --- |
| Loading | **Skeleton** rows matching **real card height**; text-first blocks, not image placeholders (`ui-system.md` §16) |
| Empty | Short headline + **one primary action** (e.g. clear filters, change area, post) |
| Error | **Inline retry**; preserve **scroll position** where possible after successful retry (`ui-system.md` §16) |
| End of list | TBD (spinner, “no more”, or nothing) |

## Localization

EUR, 24h time, location formatting — see [`../tokens.md`](../tokens.md).

## Accessibility & motion

- Focus order follows reading order; visible focus rings (`ui-system.md` §14).
- No autoplaying or heavy motion in the feed; honor reduced motion (`ui-system.md` §14).

## Verification checklist

- [ ] Skeleton height matches live card (no large layout jump)
- [ ] Empty state is never a dead end
- [ ] Error + retry without losing scroll when feasible
- [ ] Pull-to-refresh / scroll behavior TBD when platform chosen
