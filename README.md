# Giggi

Initial implementation of the roadmap in this repository currently covers:

- Phase 0 foundation: workspace, web app, env pattern, local infra, CI, Playwright screenshots.
- Early Phase 3 UI slice: the Home shell, feed list, and gig card implementation against mock domain data.

## Commands

```bash
pnpm install
pnpm dev
pnpm db:generate
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Local services

Start PostgreSQL and Redis:

```bash
docker compose -f infra/docker-compose.yml up -d
```

## Screenshots

Playwright stores route screenshots in `docs/screenshots/phase-<n>/`. See [`docs/screenshots/README.md`](docs/screenshots/README.md) for naming and refresh conventions.
