# Design tokens (targets)

Single place for **measurable** UI values referenced by component specs. Aligns with [`../ui-system.md`](../ui-system.md) §6–7, §10, §14–16.

## Spacing & rhythm

| Token | Value | Use |
| --- | --- | --- |
| `space.base` | 4px | Grid unit |
| `space.2` | 8px | Tight gaps |
| `space.3` | 12px | Meta rows, chip gaps |
| `space.4` | 16px | Card padding, section gaps |
| `space.6` | 24px | Section separation |

## Typography (mobile targets)

| Token | Target | Use |
| --- | --- | --- |
| `type.feed-title` | ~17–20px, semibold (~600) | One strong title per card |
| `type.meta` | ~13–14px, regular–medium (~400–500) | Location, time, price line |
| `type.body` | ~13–14px, regular | Optional snippet |

Adjust slightly for tablet/desktop; **hierarchy stays the same**.

## Font stack

Use the stack defined in [`../ui-system.md`](../ui-system.md) §6 (`system-ui`, …).

## Color & theme

Document **semantic** names here when product names them (e.g. `surface.default`, `text.primary`, `accent.urgent`). Until then, follow light/dark rules in `ui-system.md` §10 and contrast in §14.

## Icons

Prefer **Lucide** (or one chosen set) with text per `ui-system.md` §8.

## Localization defaults (Finland-first)

| Concern | Rule |
| --- | --- |
| Currency | EUR (€), consistent formatting |
| Time | 24h where scheduling matters |
| Location line | Neighbourhood, City (match product / `location_data`) |
