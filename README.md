# NotOnlyHere Platform

Community portal redesign: static marketing website, authenticated member web application, and web admin panel.

## Repository structure

```text
NotOnlyHere/
├── Website/          # Static marketing site (Vite + React) — LIVE
├── DesignApp/        # Interactive design preview for web app + admin — NEW
├── docs/             # Canonical product & technical documentation
│   ├── 00-project-execution-guide.md
│   ├── 01-product-prd.md
│   ├── 02-ux-spec.md
│   ├── 03-tech-design.md
│   ├── 04-backend-schema.md
│   ├── 05-implementation-plan.md
│   ├── 06-testing-plan.md
│   └── 07-design-system.md
```

## Current status

| Area | Status |
|---|---|
| Marketing website | Designed & built in `Website/` |
| Product designs | Interactive preview in `DesignApp/` |
| Member web app | Not started (designs ready) |
| Admin panel | Not started (designs ready) |
| Backend API | Not started |

## Quick start — view designs

```bash
cd DesignApp
npm install
npm run dev
```

Open `http://localhost:5173/design` to browse all 28 screens.

## Quick start — marketing site

```bash
cd Website
npm install
npm run dev
```

## Build sequence

Follow `docs/00-project-execution-guide.md` in order:

1. Approve designs (`DesignApp/` + `docs/07-design-system.md`)
2. Readiness review (Prompt A)
3. Technical approval (Prompt C)
4. Phase 0 monorepo scaffold
5. Phase 1+ feature implementation

## Documentation authority

```text
PRD scope → UX behavior → Technical contracts → Backend persistence → Implementation sequence → Test verification
```

Conflict rule: lower-authority documents cannot add product scope.
