# Screenshot conventions

Use this folder for roadmap-linked UI evidence.

## Path

- `docs/screenshots/phase-0/...`
- `docs/screenshots/phase-1/...`
- `docs/screenshots/phase-<n>/...`

## Naming

Format: `<surface>-<viewport>-<theme>.png`

Examples:

- `home-desktop-light.png`
- `home-mobile-light.png`
- `home-mobile-menu-dark.png`

## Process

1. Run the relevant Playwright spec locally.
2. Save stable screenshots into the matching phase folder.
3. If the UI intentionally changed, refresh the screenshots in the same PR as the code change.

## PR checklist

- Include at least the key happy-path screenshots for each UI-affecting roadmap step.
- Keep names stable so diffs are easy to review.
- Upload `docs/screenshots/` and `test-results/` as CI artifacts for visual jobs.

