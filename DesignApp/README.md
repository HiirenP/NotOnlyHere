# NotOnlyHere Design Preview

Interactive, high-fidelity design preview for the **authenticated member web application** and **admin panel**.

This is a design artifact — not production code. It exists so you can review screens, motion, and component patterns before Phase 0 implementation.

## Quick start

```bash
cd DesignApp
npm install
npm run dev
```

Open `http://localhost:5173/design` to browse the design catalog.

## What's included

- **28 screens** across 8 design batches (auth → admin)
- **Design system** tokens inherited from `Website/`
- **Member app shell** (desktop sidebar + mobile bottom nav)
- **Admin panel shell** (dark sidebar, operations layout)
- **Motion system** with `prefers-reduced-motion` support

## Design authority

| Document | Role |
|---|---|
| `docs/02-ux-spec.md` | Routes, flows, screen inventory |
| `docs/01-product-prd.md` | Scope and requirement IDs |
| `docs/07-design-system.md` | Tokens, components, motion rules |
| `Website/src/index.css` | Canonical color and typography tokens |

## Batches

1. Foundation — auth + shells
2. Community — feed, composer, post, search
3. People & circles — profiles, circles
4. Communication — messages, notifications
5. Support tools — Ava, mood, events
6. Content & payments — resources, explore
7. Settings — account controls
8. Admin — dashboard through audit log

## Next step after design approval

Follow `docs/00-project-execution-guide.md` → Phase 0 monorepo scaffold.
