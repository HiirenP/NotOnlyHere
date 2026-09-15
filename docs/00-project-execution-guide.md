# NotOnlyHere Project Execution Guide

## Document purpose

This is the operational entry point for building the NotOnlyHere authenticated web application and web admin panel.

Follow this guide in order. Do not ask an AI agent to build the whole platform in one task. Complete, verify, and commit one phase before beginning the next.

> **Important:** “Follow blindly” in this guide means follow the documented sequence without inventing features. It does not mean bypassing legal, privacy, financial, safety, destructive-change, or production-release approvals. Any **STOP gate** requires the named human decision before proceeding.

## Canonical document order

| Authority | Document | Controls |
|---:|---|---|
| 1 | [`01-product-prd.md`](./01-product-prd.md) | Product scope, roles, requirements, exclusions, acceptance criteria |
| 2 | [`02-ux-spec.md`](./02-ux-spec.md) | Routes, flows, screens, states, responsive behavior, accessibility |
| 3 | [`03-tech-design.md`](./03-tech-design.md) | Architecture, APIs, security, integrations, deployment |
| 4 | [`04-backend-schema.md`](./04-backend-schema.md) | Database entities, constraints, retention, migration order |
| 5 | [`05-implementation-plan.md`](./05-implementation-plan.md) | Delivery sequence and phase entry/exit criteria |
| 6 | [`06-testing-plan.md`](./06-testing-plan.md) | Public test seams, TDD process, verification, release gates |
| — | [`07-design-system.md`](./07-design-system.md) | Design tokens, components, motion, screen inventory, handoff |

Conflict rule:

```text
PRD scope
  → UX behavior
    → Technical contracts
      → Backend persistence
        → Implementation sequence
          → Test verification
```

Lower-authority documents cannot add product scope. When a conflict is discovered, stop the affected work and update all impacted canonical documents together.

---

## 1. Project boundaries

### Included

- Existing static marketing website integration
- Authenticated member web application
- Web admin panel
- Backend API and workers
- PostgreSQL database
- Redis coordination and rate limits
- One-to-one real-time messaging
- Ava AI integration
- Email, storage, Stripe, analytics, migration, testing and deployment

### Explicitly excluded

- Native iOS or Android applications
- App Store or Google Play delivery
- App download page
- Journaling
- Automated crisis detection or escalation
- User report-post/report-message queue
- Message attachments, group chat, voice notes, typing indicators and read receipts
- Push notifications and notification preference center
- Profile privacy controls and verification badges
- Mentions, hashtags, content warnings and pinned posts
- Circle Moderator role and circle-linked events
- Event recurrence, virtual links and capacity
- Course builder, quizzes, downloadable-PDF lessons and certificates
- Core-community subscription plans or paywall
- Admin feature-flag console
- Circle-health and moderation analytics
- Sentry/PostHog product claims or integration requirements

An excluded capability may be added only through a new approved PRD change.

---

## 2. Repository preparation

### 2.1 Use a clean product repository

The repository that first received these documents originally contained an unrelated Label Cropper application. Do not build NotOnlyHere into that source tree unless the existing application is intentionally being replaced.

Preferred setup:

```text
notonlyhere-platform/
├── apps/
│   ├── web/                 # Next.js marketing handoff, member app and admin UI
│   ├── api/                 # NestJS API
│   └── worker/              # Email, reminders, AI jobs, analytics
├── packages/
│   ├── ui/                  # Shared design system
│   ├── contracts/           # API and Socket.IO schemas/types
│   └── config/              # Shared TypeScript/lint/Tailwind configuration
├── docs/                    # This guide and canonical specifications
├── README.md
└── package.json
```

### 2.2 Repository checklist

- [ ] Create a new private Git repository for NotOnlyHere.
- [ ] Copy `docs/00` through `docs/06` into it.
- [ ] Protect the default branch.
- [ ] Require pull requests and passing CI.
- [ ] Create development, test, staging and production environments.
- [ ] Keep all secrets out of source control.
- [ ] Create separate sandbox/non-production credentials for every provider.
- [ ] Name owners for product, engineering, UX, QA, privacy/safety and production operations.

**STOP gate:** Do not begin implementation if the target repository or secret-handling approach is unclear.

---

## 3. First project session: readiness review

Run this prompt in the new repository before writing code.

### Prompt A — Documentation and readiness review

```text
Read these documents in order:

1. docs/00-project-execution-guide.md
2. docs/01-product-prd.md
3. docs/02-ux-spec.md
4. docs/03-tech-design.md
5. docs/04-backend-schema.md
6. docs/05-implementation-plan.md
7. docs/06-testing-plan.md

Do not write code or edit files.

Produce a readiness review with:
1. Product objective
2. Included modules
3. Explicit exclusions
4. Member, Circle Admin and global admin roles
5. P0 versus P2 requirements
6. Static-site integration boundaries
7. Open product/legal/privacy decisions
8. Conservative defaults already defined in the PRD
9. Architecture and data summary
10. Proposed Phase 0 public test seams
11. Contradictions, if any, with exact file/section references
12. A GO or STOP recommendation for Phase 0

Authority:
- PRD controls scope
- UX specification controls behavior
- Technical design controls architecture and interfaces
- Backend schema controls persistence
- Implementation plan controls sequence
- Testing plan controls verification

Do not invent requirements or reopen explicit exclusions.
```

Expected output:

- A scope summary
- A list of decisions needing approval
- No code changes
- A clear Phase 0 GO/STOP recommendation

---

## 4. Human decisions before implementation

Resolve or explicitly accept the PRD's conservative default for each item.

| Decision | Conservative default | Required before |
|---|---|---|
| Launch countries/locales and crisis-resource copy | Launch only where approved static resources exist | Content freeze/release |
| Event creation | Staff/Super Admin only | Event API freeze |
| Public post rendering outside login | Authenticated app only | Feed/static integration |
| Anonymous and Ava quota reset | UTC calendar day | API/schema freeze |
| Circle mute and suspension duration/appeal | Fixed approved presets plus Help/Contact path | Admin enforcement |
| Public resource access | Login required | Resource API freeze |
| Legacy direct-message migration | Do not migrate DMs | Migration implementation |
| Retention periods | Minimize; legal owner must approve exact periods | Irreversible migrations/release |
| Donation currencies/countries/tax wording | Restrict to explicitly approved configuration | Live Stripe activation |
| AI moderation policy categories | No crisis/self-harm classifier; approved community-policy categories only | AI flag evaluator |

For every decision:

- [ ] Record owner.
- [ ] Record decision date.
- [ ] Update affected canonical documents.
- [ ] Add/update acceptance tests.
- [ ] Commit the decision separately.

**STOP gate:** AI may apply a documented conservative default for development, but it must not decide legal retention, live financial terms, launch jurisdiction, or production safety wording.

---

## 5. UX design workflow

The static marketing website is already designed. Design only the authenticated application and admin panel.

Use:

- [`01-product-prd.md`](./01-product-prd.md)
- [`02-ux-spec.md`](./02-ux-spec.md)
- Existing NotOnlyHere marketing screenshots and design tokens

### 5.1 Design batches

Complete batches in this order:

1. **Foundation:** Login, registration, verification, reset, member shell, admin shell
2. **Community:** Feed, post composer, anonymous state, post detail, search
3. **People and circles:** Profiles, connections, blocks, circles, circle management
4. **Communication:** Messages, notifications
5. **Support tools:** Wellness, events, Ava
6. **Content and payments:** Resources, blogs, donation and one-time resource checkout
7. **Settings:** Sessions, AI consent/preferences, data export, account deletion
8. **Admin:** Dashboard, users, enforcement, circles, AI flags, content, donations, analytics, audit

### Prompt B — Design one batch

```text
Design only this NotOnlyHere authenticated-product batch:
[INSERT BATCH NAME AND SCREENS]

Read:
- docs/01-product-prd.md
- docs/02-ux-spec.md

The static marketing website is already designed. Do not redesign it.

For every screen provide:
1. Desktop web layout
2. Mobile-browser layout
3. Components and hierarchy
4. Default, loading, empty, error, success and unauthorized states
5. Validation and destructive confirmations
6. Keyboard, focus and screen-reader behavior
7. Sensitive-data redaction
8. Applicable PRD requirement IDs
9. Handoff notes for frontend implementation

Preserve the existing NotOnlyHere identity:
- warm, calm and human
- existing colors and typography
- soft surfaces and restrained motion
- no clinical or engagement-gamified appearance

Do not add excluded features. Stop after this batch.
```

### UX batch completion gate

- [ ] Every included screen has compact/mobile and wide/desktop behavior.
- [ ] Loading, empty, error, success and unauthorized states exist.
- [ ] Destructive and financial actions wait for server confirmation.
- [ ] Anonymous identity and audience are clear before submission.
- [ ] Ava consent/disclaimer and static crisis resources are visible.
- [ ] Admin screens expose only role-authorized data/actions.
- [ ] WCAG 2.2 AA requirements are represented.
- [ ] No excluded control, teaser, disabled placeholder or “coming soon” feature appears.

Design may stay one batch ahead of implementation. Do not block Phase 0 on later feature mockups.

---

## 6. Technical approval before Phase 0

Review:

- [`03-tech-design.md`](./03-tech-design.md)
- [`04-backend-schema.md`](./04-backend-schema.md)
- [`06-testing-plan.md`](./06-testing-plan.md)

Approve:

- [ ] Monorepo structure
- [ ] Same-domain/static-site route ownership
- [ ] Secure cookie/session model
- [ ] Four fixed global roles and Circle Admin scope
- [ ] PostgreSQL/Prisma model
- [ ] Redis, Socket.IO and transactional outbox
- [ ] Object-storage upload flow
- [ ] OpenAI, Resend and Stripe adapters
- [ ] Data classification/encryption
- [ ] Backup, restoration and migration approach
- [ ] Proposed public test seams

### Prompt C — Technical contract review

```text
Read:
- docs/01-product-prd.md
- docs/02-ux-spec.md
- docs/03-tech-design.md
- docs/04-backend-schema.md
- docs/06-testing-plan.md

Do not implement.

Validate:
1. Every P0 requirement has a route/interface and persistence strategy where needed.
2. Every API action has an authorization rule.
3. Every sensitive field has classification and disclosure restrictions.
4. Anonymous creator identity cannot leak through API, sockets, email, search, logs or analytics.
5. Ava transcripts remain private and outside moderation inputs.
6. Event reminders, notifications and webhooks are idempotent.
7. Stripe browser returns cannot grant entitlement.
8. Fixed roles and enforcement states are representable.
9. Excluded features have no routes/tables/events.
10. Proposed test seams can verify critical behavior.

Return only:
- PASS items
- contradictions with exact locations
- required document corrections
- GO/STOP recommendation for Phase 0
```

**STOP gate:** Correct contradictions before coding dependent features.

---

## 7. Implementation sequence

The canonical details are in [`05-implementation-plan.md`](./05-implementation-plan.md). Use this summary only for navigation.

| Phase | Capability | Start only after |
|---:|---|---|
| 0 | Decisions and executable walking skeleton | Repository and public seams approved |
| 1 | Registration, verification, OAuth, login and sessions | Phase 0 green |
| 2 | Profiles, connections, blocks, data export and deletion | Phase 1 green |
| 3 | Basic feed publication | Phase 2 green |
| 4 | Feed media, links, comments, reactions, search and filters | Phase 3 green |
| 5 | Anonymous posts and comments | Phase 4 privacy tests green |
| 6 | Circle directory and membership | Phase 2/3 foundations green |
| 7 | Circle creation, administration and circle feed | Phase 6 green |
| 8 | Connection-only direct messaging | Connections/block policy frozen |
| 9 | In-app/email notifications and broadcasts | Outbox/domain events stable |
| 10 | Wellness check-ins and trends | Sensitive-data controls green |
| 11 | Standalone events, RSVP, calendar views and reminders | Event policy approved |
| 12 | Ava private chat and recommendations | AI consent/provider contract approved |
| 13 | Community-content AI moderation flags | Policy categories and human workflow approved |
| 14 | Resource library and progress | Resource formats/access approved |
| 15 | Donations and paid resource purchase | Stripe terms/config approved |
| 16 | Blog publishing and operational admin panel | Prior admin capabilities stable |
| 17 | First-party analytics and export | Event taxonomy/privacy approved |
| 18 | Migration, hardening and release | All prior phase gates green |

Never start a later phase to “save time” when its dependencies are not complete.

---

## 8. Phase 0 prompt

### Prompt D — Implement Phase 0 only

```text
Implement Phase 0 only from docs/05-implementation-plan.md.

Read:
- docs/00-project-execution-guide.md
- docs/01-product-prd.md
- docs/02-ux-spec.md
- docs/03-tech-design.md
- docs/04-backend-schema.md
- docs/05-implementation-plan.md
- docs/06-testing-plan.md

Before coding:
1. Inspect the repository.
2. Identify exact Phase 0 PRD requirement IDs and UX routes.
3. List proposed public test seams.
4. Confirm entry criteria.
5. Confirm no excluded capability is introduced.

Implement one walking vertical slice:
browser → Next.js web → NestJS API → PostgreSQL → browser result.

Include:
- monorepo workspace
- app shell
- protected admin shell with seeded Super Admin
- baseline Prisma migration
- /api/v1 conventions and error envelope
- health/readiness endpoints
- structured logs and request IDs
- one outbox event consumed by worker
- CI for formatting, lint, types, tests and build
- staging deployment configuration without secrets

TDD:
- write one failing public-behavior test
- implement minimum behavior
- make it pass
- repeat one vertical behavior at a time
- mock only external boundaries

Do not implement Phase 1 or later.

Before completion:
- run formatting/lint/typecheck/tests/build
- demonstrate the full walking path
- verify Phase 0 exit criteria
- provide files changed, tests run, demo steps, unresolved blockers and rollback
- commit Phase 0 separately
```

### Phase 0 acceptance

- [ ] Browser reaches authenticated placeholder.
- [ ] API resolves current test user.
- [ ] PostgreSQL is exercised.
- [ ] Admin route rejects non-admin.
- [ ] Health/readiness accurately reflects dependencies.
- [ ] Worker consumes one durable outbox event.
- [ ] Request ID appears across web/API/worker logs.
- [ ] CI and staging build pass.
- [ ] No later module has been speculatively implemented.

---

## 9. Reusable prompt for Phases 1–18

Use a fresh agent/session for each phase.

### Prompt E — Implement one phase

```text
Implement only Phase [NUMBER] — [NAME] from docs/05-implementation-plan.md.

Canonical documents:
- Entry guide: docs/00-project-execution-guide.md
- Product scope: docs/01-product-prd.md
- UX behavior: docs/02-ux-spec.md
- Architecture/API: docs/03-tech-design.md
- Database: docs/04-backend-schema.md
- Sequence: docs/05-implementation-plan.md
- Verification: docs/06-testing-plan.md

Before coding:
1. Inspect current code and previous phase evidence.
2. Check this phase's dependencies and entry criteria.
3. List exact PRD requirement IDs.
4. List UX flows/screens/states.
5. List API, Socket.IO, job and schema changes.
6. List proposed tests at agreed public seams.
7. Confirm explicit exclusions relevant to the phase.

If documents conflict:
- do not guess
- stop affected implementation
- report exact locations
- propose coordinated document corrections

Implementation:
- build thin end-to-end vertical slices
- use red → green TDD one behavior at a time
- test through public interfaces
- mock only external provider boundaries
- use real test PostgreSQL/Redis where specified
- enforce authorization in API/query boundaries, not only UI
- include loading, empty, validation, error, unauthorized, rate-limit and success states
- preserve WCAG 2.2 AA and responsive-browser behavior
- use additive expand/contract migrations
- instrument only approved first-party events with no sensitive free text
- do not implement future phases

Completion:
1. Run formatting, lint, types, unit, integration and applicable E2E tests.
2. Run authorization/privacy negative paths.
3. Demonstrate the complete user-visible path.
4. Verify phase exit criteria.
5. Document migrations, configuration, rollback and remaining approved open decisions.
6. Commit the phase separately.
7. Stop. Do not begin the next phase.
```

### Standard phase gate

Do not proceed until all are true:

- [ ] Entry criteria were met.
- [ ] Exact PRD IDs are recorded.
- [ ] UI/API/schema/test changes agree.
- [ ] At least one end-to-end behavior is demonstrable.
- [ ] Required tests are green.
- [ ] Authorization/privacy negative tests are green.
- [ ] Accessibility checks for changed screens pass.
- [ ] Migrations are backward compatible and reviewed.
- [ ] Rollback is documented.
- [ ] Excluded capabilities remain absent.
- [ ] Phase exit criteria pass.
- [ ] Changes are committed and reviewed.

---

## 10. How to brief specialized agents

### Frontend agent

Required context:

- `01-product-prd.md`
- `02-ux-spec.md`
- Relevant routes/contracts from `03-tech-design.md`
- Browser/accessibility sections from `06-testing-plan.md`
- Current phase from `05-implementation-plan.md`

Instruction:

```text
Implement frontend behavior for Phase [N] only. Do not create backend mocks that become production architecture. Consume the documented contracts, represent every required state, and preserve authorization as a server responsibility.
```

### Backend agent

Required context:

- `01-product-prd.md`
- `03-tech-design.md`
- `04-backend-schema.md`
- Relevant phase from `05-implementation-plan.md`
- Relevant test matrix from `06-testing-plan.md`

Instruction:

```text
Implement backend behavior for Phase [N] only through documented REST/Socket/job seams. Enforce authorization and privacy in service/query boundaries. Do not expose persistence models directly.
```

### Database agent

Required context:

- `01-product-prd.md`
- `03-tech-design.md`
- `04-backend-schema.md`
- Current phase and migration rules
- Constraint/concurrency tests from `06-testing-plan.md`

Instruction:

```text
Implement only schema changes needed by Phase [N]. Use reviewed Prisma plus SQL migrations for unsupported constraints/indexes. Add behavior-level constraint and migration tests. Do not create tables for excluded features.
```

### QA agent

Required context:

- All canonical documents
- Current phase implementation diff

Instruction:

```text
Verify Phase [N] against exact PRD IDs, UX states, public seams and exit criteria. Prioritize authorization, privacy, concurrency, idempotency, accessibility and excluded-capability regressions. Report evidence, not only pass/fail claims.
```

### Security/privacy review agent

```text
Review the Phase [N] diff against docs/01-product-prd.md, docs/03-tech-design.md, docs/04-backend-schema.md and docs/06-testing-plan.md.

Focus on:
- authentication/session handling
- horizontal/vertical authorization
- anonymous identity leakage
- Ava/wellness/message confidentiality
- sensitive logs/analytics/notifications
- upload and rich-content security
- SSRF/XSS/CSRF/injection
- payment/webhook authority
- deletion/retention
- admin audit and role escalation

Return severity-ranked findings with file/line, exploit/failure path and required remediation.
```

---

## 11. TDD operating procedure

For each behavior:

```text
1. Select one exact PRD acceptance criterion.
2. Select one approved public seam.
3. Write one behavior-focused failing test.
4. Confirm it fails for the intended reason.
5. Implement the smallest complete vertical behavior.
6. Confirm the test passes.
7. Run nearby regression tests.
8. Continue to the next criterion.
9. Refactor only with all tests green.
```

Good test:

```text
“A blocked member cannot send a message through REST or Socket.IO.”
```

Bad test:

```text
“MessageService calls BlockRepository once.”
```

Mock:

- OpenAI
- Resend
- Stripe
- Google/Apple OAuth
- S3/R2 at adapter boundaries
- Time/randomness when deterministic behavior is required

Prefer real test instances for:

- PostgreSQL
- Redis
- Application HTTP server
- Socket.IO server
- Browser UI

---

## 12. Git and review workflow

For each phase:

1. Start from an up-to-date protected base branch.
2. Create one feature branch for the phase or narrow slice.
3. Commit logical vertical slices separately.
4. Push and open a draft pull request.
5. Include requirement IDs and test evidence in the PR.
6. Run code, UX, QA and security reviews.
7. Correct findings with new commits; do not hide them through force-push.
8. Merge only after phase gates pass and required humans approve.

Suggested PR body:

```markdown
## Phase
Phase [N] — [Name]

## Requirements
- AUTH-01
- AUTH-03
- [exact IDs]

## User-visible demo
[steps]

## Architecture/schema
[summary and migrations]

## Tests
[commands and evidence]

## Security/privacy
[negative paths and review]

## Exclusions verified
[relevant absent capabilities]

## Rollback
[steps]

## Open decisions
[none or approved references]
```

---

## 13. Static website integration

The public website and authenticated product must have explicit route ownership.

Suggested boundary:

```text
Public/static:
/
/about
/features
/how-it-works
/circles
/blog
/support
/contact
/faq
/guidelines
/privacy
/terms

Authenticated product:
/login
/register
/app/*
/admin/*
/api/v1/*
```

Required integration tests:

- [ ] Join Free opens `/register`.
- [ ] Log In opens `/login`.
- [ ] Valid login reaches `/app`.
- [ ] Return URL is allow-listed.
- [ ] Logout returns safely to public site.
- [ ] Published blog handoff works.
- [ ] Donation checkout and return work without granting community entitlement.
- [ ] `/download` is absent or redirects safely.
- [ ] Static cache cannot serve authenticated content.
- [ ] Cookies are not scoped more broadly than required.

---

## 14. Migration process

Migration occurs in Phase 18, after target behavior is stable.

### Required sequence

1. Obtain authorized read-only WordPress/BuddyBoss export.
2. Store it in restricted temporary storage.
3. Inventory users, circles, memberships, posts, comments, blogs, media, blocks, donations and roles.
4. Produce source-to-target mappings.
5. Reject unsupported fields explicitly.
6. Default to password-reset/account-claim migration.
7. Do not migrate direct messages unless legal/privacy approval is documented.
8. Run deterministic dry import.
9. Run it again and compare results.
10. Reconcile counts, relationships, visibility and media hashes.
11. Sample privacy and anonymous-content behavior.
12. Test rollback and backup restoration.
13. Freeze source writes or execute approved delta process.
14. Cut over.
15. Validate production-safe smoke paths.
16. Retain source read-only only for the approved rollback/retention window.
17. Securely destroy temporary export artifacts.

**STOP gate:** Never place production personal data on an unapproved developer laptop or in an AI prompt.

---

## 15. Release readiness

### Prompt F — Phase 18 go/no-go review

```text
Perform the Phase 18 release-readiness review.

Read all canonical documents and inspect the implementation, migrations, CI evidence and operational runbooks.

Verify:
1. Every P0 requirement has traceable evidence.
2. Every explicit exclusion remains absent.
3. Critical member and admin journeys pass.
4. RBAC expected denials pass.
5. Anonymous identities never leak through UI, API, sockets, notifications, search, logs or analytics.
6. Ava is private, consent-based, not used for provider training, and has no crisis-detection behavior.
7. Static crisis resources and non-therapy disclosures are available.
8. Core community remains free.
9. Stripe webhooks are authoritative and idempotent.
10. WCAG 2.2 AA release checks pass.
11. Supported-browser/responsive checks pass.
12. Backup restore and deletion replay pass.
13. Migration rehearsals reconcile.
14. Static-site login/register/blog/donation handoffs pass.
15. Rollback procedures were rehearsed.
16. Required legal, privacy, safety and financial decisions are approved.

Return:
- requirement traceability report
- passed release gates
- failed release gates
- open owner decisions
- security/privacy findings
- migration findings
- GO / CONDITIONAL GO / NO-GO recommendation

Do not modify production and do not approve release automatically.
```

### Non-waivable release failures

- Anonymous identity leakage
- Cross-user authorization bypass
- Admin privilege escalation
- Ava/wellness/message private-data leakage
- Payment entitlement without verified webhook
- Destructive migration/restore failure
- Under-16 registration bypass
- Missing required legal/safety approval
- Critical accessibility blocker on a core path

---

## 16. Daily operator checklist

At the start of an agent session:

- [ ] State one phase/slice only.
- [ ] Point to canonical documents.
- [ ] List exact requirement IDs.
- [ ] State exclusions relevant to the task.
- [ ] Confirm entry criteria.
- [ ] Confirm public test seams.

Before accepting agent output:

- [ ] Review the diff.
- [ ] Confirm no future phase was implemented.
- [ ] Confirm no scope was invented.
- [ ] Run tests independently.
- [ ] Check authorization/privacy negative paths.
- [ ] Check responsive/accessibility states.
- [ ] Check migrations and rollback.
- [ ] Confirm exit criteria.
- [ ] Commit and push.

---

## 17. What not to prompt

Never use:

```text
Build the entire NotOnlyHere platform.
```

```text
Build all database tables first.
```

```text
Build all backend modules, then we will add the UI.
```

```text
Add anything you think would improve the product.
```

```text
Use your judgment to decide legal retention and AI safety policy.
```

Use one phase, exact requirements, public seams, tests and exit criteria instead.

---

## 18. Master progress tracker

| Item | Status | Evidence/PR |
|---|---|---|
| Repository prepared | ☐ | |
| Readiness review passed | ☐ | |
| Open decision defaults approved | ☐ | |
| Technical seams approved | ☐ | |
| UX batch 1 approved | ☐ | |
| Phase 0 | ☐ | |
| Phase 1 | ☐ | |
| Phase 2 | ☐ | |
| Phase 3 | ☐ | |
| Phase 4 | ☐ | |
| Phase 5 | ☐ | |
| Phase 6 | ☐ | |
| Phase 7 | ☐ | |
| Phase 8 | ☐ | |
| Phase 9 | ☐ | |
| Phase 10 | ☐ | |
| Phase 11 | ☐ | |
| Phase 12 | ☐ | |
| Phase 13 | ☐ | |
| Phase 14 | ☐ | |
| Phase 15 | ☐ | |
| Phase 16 | ☐ | |
| Phase 17 | ☐ | |
| Migration rehearsal 1 | ☐ | |
| Migration rehearsal 2 | ☐ | |
| Backup/restore drill | ☐ | |
| Security/privacy review | ☐ | |
| Accessibility review | ☐ | |
| Client UAT | ☐ | |
| Phase 18 release review | ☐ | |
| Production launch approval | ☐ | |

---

## Final rule

```text
One phase.
One approved scope.
One set of public behaviors.
Red → green vertical slices.
Evidence before progression.
Human approval at legal, safety, financial, destructive and production gates.
```
