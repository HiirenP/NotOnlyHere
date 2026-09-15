# NotOnlyHere Design System

## Document metadata

| Field | Value |
|---|---|
| Product | Authenticated member web app + admin panel |
| Document | `07-design-system.md` |
| Status | **Design baseline — approved for implementation handoff** |
| Version/date | 1.0 / 2026-07-30 |
| Canonical sources | `Website/src/index.css`, `docs/02-ux-spec.md`, `DesignApp/` interactive preview |
| Companion documents | `01-product-prd.md`, `02-ux-spec.md`, `03-tech-design.md` |

## 1. Design intent

The authenticated product must feel like a natural extension of the NotOnlyHere marketing site — warm, calm, and human — while supporting dense operational workflows in the admin panel.

**Do:**
- Restrained motion (150–320ms, ease-out)
- Soft surfaces, generous whitespace
- IBM Plex Mono for UI; Anton for display headings
- Blue-to-cyan gradient accents sparingly (CTAs, emphasis)
- Skeleton loading over spinners
- Clear identity/audience disclosure before publish

**Do not:**
- App-store badges, install prompts, or mobile-app theater
- Gamification (streaks, popularity ranking, engagement pressure)
- Clinical imagery or therapist positioning for Ava
- Parallax, particles, bounce animations, or generic AI-gradient overload
- Color-only meaning; icon + text always

## 2. Typography

| Token | Family | Usage |
|---|---|---|
| `font-display` | Anton | Page titles, section headers, empty states |
| `font-mono` | IBM Plex Mono | Body, labels, buttons, forms, tables |

### Scale

| Element | Desktop | Mobile |
|---|---|---|
| Page H1 | 32–40px display uppercase | 28–32px |
| Section H2 | 20–24px display | 18–20px |
| Body | 14px mono | 14px |
| Label | 10–12px mono uppercase tracking-widest | same |
| Caption | 10–11px mono | same |

## 3. Color tokens

Inherited from marketing site OKLCH variables in `Website/src/index.css`.

| Token | Role |
|---|---|
| `background-50`–`950` | Surfaces, borders, page backgrounds |
| `foreground-50`–`950` | Text hierarchy |
| `primary-*` | Brand actions, active nav, links |
| `accent-*` | Anonymous identity, secondary emphasis |
| `success-500/600` | Confirmations, active status |
| `warning-500/600` | Pending, review needed |
| `danger-500/600` | Destructive actions, bans, errors |

### Gradients

- **gradient-text:** `#2563EB → #3B82F6 → #06B6D4` for emphasis words
- **gradient-btn:** Same gradient for primary CTAs
- Use gradients on one primary action per region maximum

## 4. Spacing and layout

| Breakpoint | Member layout | Admin layout |
|---|---|---|
| ≥1024px | 256px left nav + content + optional right rail | 288px dark sidebar + content |
| 768–1023px | Collapsed nav patterns; stacked content | Sidebar hidden; top context |
| <768px | Top bar + 5-item bottom nav | Single column; hamburger nav (future) |

### Touch targets

Minimum **44×44 CSS px** for all interactive elements.

## 5. Motion system

| Token | Value | Usage |
|---|---|---|
| `--motion-duration-fast` | 150ms | Button press, hover |
| `--motion-duration-base` | 220ms | Page enter, card reveal |
| `--motion-duration-slow` | 320ms | Drawer/sheet |
| `--motion-ease` | `cubic-bezier(0.22, 1, 0.36, 1)` | All transitions |

### Patterns

| Pattern | Spec |
|---|---|
| Page enter | Fade + 8px translateY, 220ms |
| Button hover | Opacity 0.92 + 1px lift |
| Button active | `scale(0.98)` |
| Modal open | Backdrop fade 200ms + content slide-up 280ms |
| List item hover | Background transition 150ms |
| Skeleton | Pulse animation on `background-200` |

### Reduced motion

All animations respect `prefers-reduced-motion: reduce` — durations collapse to ~0ms.

## 6. Component library

Implemented in `DesignApp/src/design-system/` for preview; will migrate to `packages/ui/` during Phase 0.

| Component | Variants | Notes |
|---|---|---|
| `Button` | primary, secondary, ghost, danger | sm/md/lg; uppercase mono |
| `Input` | default + error | Persistent label; placeholder is example only |
| `Card` | sm/md/lg padding | `surface-card` + fade-up enter |
| `Badge` | default, StatusBadge | Status: active, pending, warning, danger, muted |
| `Avatar` | named, anonymous | Initials or `?` for anonymous |
| `SegmentedControl` | tab semantics | Relevant/Chronological, All/Unread, etc. |
| `EmptyState` | title + description + action | Centered, calm copy |
| `Skeleton` | arbitrary size | Loading placeholder |

### Shells

| Shell | File | Purpose |
|---|---|---|
| `MemberShell` | `layouts/Shells.tsx` | Nav, header, bottom bar, notifications |
| `AdminShell` | `layouts/Shells.tsx` | Dark sidebar, operations header |
| `AuthShell` | `layouts/Shells.tsx` | Minimal centered card layout |

## 7. Screen inventory (design preview)

All screens are browsable at `/design` in `DesignApp`.

| Batch | Screens |
|---|---|
| 1 — Foundation | Login, Register, Verify email, Forgot password |
| 2 — Community | Feed, Composer, Post detail, Search |
| 3 — People & circles | Circle directory, Circle detail, Profile |
| 4 — Communication | Messages, Notifications |
| 5 — Support tools | Ava, Mood, Events |
| 6 — Content & payments | Resources, Explore hub |
| 7 — Settings | Settings hub |
| 8 — Admin | Dashboard, Users, User detail, Circles, Safety alerts, Content, Donations, Analytics, Audit |

## 8. Admin panel visual language

The admin panel uses a **dark sidebar** (`background-950`) on a light content canvas to signal operational context without breaking brand identity.

- KPI cards: large display numbers, small uppercase labels
- Tables: mono text, hover row highlight, status badges
- Destructive actions: explicit labels ("Ban member"), never generic "Confirm"
- No private content previews (mood notes, message bodies, card data)

## 9. Accessibility

- WCAG 2.2 AA target
- Visible focus rings on all interactive elements (`focus-ring` utility)
- Form labels always visible; errors linked via `aria-describedby`
- Color never sole indicator — icon + text for status, audience, anonymous
- Skip link in production shell (design preview omits for brevity)
- Charts expose data table alternative (mood trend, analytics)

## 10. Handoff to implementation

When designs are approved:

1. Extract tokens from `DesignApp/src/index.css` into `packages/ui/tokens.css`
2. Port components from `DesignApp/src/design-system/` to `packages/ui/`
3. Port shells to `apps/web/src/layouts/`
4. Wire screens to real API routes per `03-tech-design.md`
5. Add Playwright visual regression snapshots from design preview baselines

## 11. Excluded from design

Per PRD — no UI for: app download, push notifications, typing indicators, read receipts, message attachments, group chat, journaling, notification preferences, profile privacy controls, verification badges, mentions/hashtags, circle moderator role, event recurrence/virtual links/capacity, course builder/quizzes/certificates, feature flags, Sentry/PostHog consoles.
