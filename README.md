# NotOnlyHere Platform

Community portal: marketing website, authenticated member web app, admin panel, API, and workers.

## Repository structure

```text
NotOnlyHere/
├── Website/          # Static marketing site (Vite + React)
├── DesignApp/        # Interactive design preview (approved)
├── apps/
│   ├── web/          # Next.js 15 — member app + admin panel
│   ├── api/          # NestJS API
│   └── worker/       # Background job worker
├── packages/
│   ├── ui/           # Shared design system
│   ├── contracts/    # Shared API types
│   └── config/       # Shared TypeScript config
└── docs/             # Product & technical documentation
```

## Quick start

```bash
cp .env.example .env
npm run setup          # install, start DB, migrate, seed
npm run dev:api        # terminal 1 — API on :3001
npm run dev:web        # terminal 2 — web on :3000
npm run dev:worker     # terminal 3 — outbox consumer (emails logged in dev)
```

Then open:

- http://localhost:3000 — landing
- http://localhost:3000/register — create account
- http://localhost:3000/login — sign in
- http://localhost:3000/app — member app
- http://localhost:3000/admin — admin panel (Super Admin only)
- http://localhost:3000/app/settings/sessions — active sessions

### Seeded accounts (password: `Demo1234!`)

| Email | Role |
|---|---|
| demo@notonlyhere.local | Member |
| admin@notonlyhere.local | Super Admin |

## Design preview

```bash
cd DesignApp && npm install && npm run dev
```

Open http://localhost:5173/design

## Documentation

Follow `docs/00-project-execution-guide.md` in order. Current phase: **Phase 0 complete → Phase 1 (auth)** next.

## Phase 0 demo path

```text
Browser → Next.js /app → GET /api/v1/account → NestJS → PostgreSQL → response
```

Worker consumes `platform.noop` outbox events from the seed/migration path.
