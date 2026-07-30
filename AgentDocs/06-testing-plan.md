# NotOnlyHere Testing Plan

**Status:** Proposed test strategy
**Product:** Authenticated web application and web admin panel
**Last updated:** 2026-07-29
**Companion documents:** [Product PRD](./01-product-prd.md), [UX specification](./02-ux-spec.md), [Technical design](./03-tech-design.md), [Backend schema](./04-backend-schema.md), [Implementation plan](./05-implementation-plan.md)

The [Product PRD](./01-product-prd.md) is authoritative for scope and requirement meaning; [02](./02-ux-spec.md) is authoritative for routes, states, accessibility, and interaction; [03](./03-tech-design.md) and [04](./04-backend-schema.md) define the technical contracts. Section 17 tracks decisions still requiring owner approval, not permission to diverge from canonical scope.

## 1. Purpose and quality model

This plan verifies the included NotOnlyHere authenticated web application and web admin panel. The existing static landing site is tested only at its login, registration, blog, and donation integration boundaries.

Quality is defined as observable behavior at public seams:

- a user can complete an allowed journey;
- an unauthorized user cannot infer or perform it;
- retries, races, reconnects, and external failures do not corrupt state;
- private and anonymous data do not escape;
- durable state, emails, jobs, payments, and analytics agree;
- the web experience is accessible, responsive, and operable;
- migrations, backups, and rollback procedures preserve approved semantics.

Tests do not lock in private classes, method calls, Prisma query shapes, React component internals, or incidental markup. A test must be capable of failing when user-observable behavior is wrong. Assertions that only repeat fixture setup or mock return values are prohibited.

## 2. Proposed public seams requiring stakeholder approval

These seams are **proposed contracts, not final contracts**. Product, UX, architecture, backend, security/privacy, and QA stakeholders must approve and document them before implementation begins. Contract changes require corresponding test and traceability updates.

### 2.1 Browser UI seam

- Public integration routes: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/donate`, `/donate/result`, `/blog`, `/blog/[slug]`, and `/rss.xml`.
- Authenticated routes for feed, profile, connections, circles, messages, notifications, wellness, events, Ava, resources, account/session/deletion settings.
- Admin routes for dashboard, users, circles, blog, donations, limited AI safety alerts, audit, RBAC, analytics, and export.
- Contract includes route protection, redirects/return URLs, forms and validation, loading/empty/error/rate-limit/permission states, focus movement, semantic names, responsive layout, and user-facing copy identified in [02](./02-ux-spec.md).
- Tests use role/name/label and visible behavior. CSS classes, component state, hooks, and DOM structure are not contracts unless required by accessibility.

### 2.2 REST API seam

- Versioned base path, proposed `/api/v1`.
- OpenAPI is the machine-readable contract for request/response bodies, stable error codes, authentication, authorization, cursor pagination, idempotency keys, and rate-limit metadata.
- Proposed error form is RFC 7807-compatible with a safe detail, machine code, validation fields, and request ID.
- API tests assert status, safe response shape, state effect, authorization/privacy, and retry behavior—not service/repository invocation.

### 2.3 Socket.IO protocol seam

- Versioned namespace/path, authentication handshake, room/join rules, event names, payload schemas, client message/idempotency IDs, server message IDs, sequence/cursor, acknowledgements, and error events.
- Persisted REST history is authoritative. Reconnect uses a last-seen cursor/sequence and deduplicates by stable message/event ID.
- Connection state, event order, duplicate delivery tolerance, session revocation, block changes, and authorization are observable protocol behavior.
- No typing, read receipt, file, report, group, or voice events are part of the contract.

### 2.4 Background-job effect seam

Jobs are observed through durable/public effects:

- REST or UI eventually shows the resulting notification, publication, reminder status, entitlement, analytics export, deletion status, or moderation flag;
- the Resend sandbox contains one logically expected email;
- the Stripe sandbox and local state reconcile;
- object storage contains only finalized, authorized objects;
- an operator-visible dead-letter/error state exists after terminal failure.

Tests do not call private worker handlers directly except narrow pure-function tests. Queue implementation and retry internals are not public contracts.

### 2.5 External adapter seams

Typed ports are proposed for:

- `StripeGateway`: checkout creation, webhook verification/normalization, object retrieval/reconciliation;
- `OpenAIProvider`: chat/moderation request, normalized response, timeout/refusal/provider-error behavior;
- `EmailSender`/Resend: template request with stable logical delivery ID and normalized result;
- `ObjectStore`/S3-R2: presign, finalize/head, authorized read URL, delete;
- OAuth providers: authorization callback profile/token normalization.

Contract tests run against deterministic fakes in routine CI and real provider sandboxes in scheduled/pre-release tests. Only these external boundaries are mocked in integration tests.

### 2.6 Database migration and constraint seam

- An empty database migrates to current; a supported previous schema migrates forward with representative data.
- PostgreSQL enforces approved unique, foreign-key, check, nullability, and idempotency constraints from [04](./04-backend-schema.md).
- Migration behavior includes locking/timeout assessment, expand/migrate/contract compatibility, forward verification, and backup/restore evidence.
- Prisma implementation details are not the seam; durable data and constraints are.

### 2.7 Admin authorization seam

- Each admin route and API action has an approved role/action matrix.
- Canonical global roles are Super Admin, Moderator, Content Editor, and Analyst; scoped circle roles are Member and Circle Admin only. Implementation permission keys remain subject to [03](./03-tech-design.md).
- The seam includes deny-by-default behavior, audited successful and denied sensitive actions, role-change/session effects, export controls, and trace-reason requirements.
- Hiding navigation is not authorization. Direct browser, REST, and Socket.IO access are each tested.

### 2.8 Contract approval record

Before Phase 1, create a versioned contract record containing:

| Seam | Required approvers | Evidence |
|---|---|---|
| Browser routes/states | Product, UX, accessibility, engineering, QA | Route/state inventory and accepted prototype |
| REST/OpenAPI | Backend, web, security, QA | Reviewed OpenAPI diff and error/pagination conventions |
| Socket.IO | Backend, web, security, QA | Event schema, state diagram, reconnect example |
| Job effects | Backend, operations, QA | Event/outbox catalog and delivery SLOs |
| External adapters | Backend, security/privacy, finance/legal where relevant | Typed contracts and sandbox probes |
| DB constraints/migrations | Backend, data, operations, security/privacy | Schema review and migration rehearsal |
| Admin authorization | Product owner, security/privacy, operations, QA | Action-level RBAC matrix |

## 3. Requirement traceability

Tests cite the canonical IDs in [01](./01-product-prd.md). The compact aliases used in behavior tables map as follows:

| Prefix | Area |
|---|---|
| `PRD-AUTH-*` | `AUTH-01`–`AUTH-09`, `PRIV-03` |
| `PRD-PROF-*` | `PROF-01`–`PROF-08` |
| `PRD-FEED-*` | `FEED-01`–`FEED-12` |
| `PRD-ANON-*` | `ANON-01`–`ANON-07`, `PROF-07` |
| `PRD-CIRC-*` | `CIRC-01`–`CIRC-13` |
| `PRD-MSG-*` | `MSG-01`–`MSG-07` |
| `PRD-AI-*` | `AVA-01`–`AVA-12`, `SAFE-01`–`SAFE-03`, `PRIV-04` |
| `PRD-NOTIF-*` | `NOTIF-01`–`NOTIF-04` |
| `PRD-WELL-*` | `MOOD-01`–`MOOD-04` |
| `PRD-EVENT-*` | `EVT-01`–`EVT-05` |
| `PRD-BLOG-*` | `BLOG-01`–`BLOG-05` |
| `PRD-ADMIN-*` | `ADM-01`–`ADM-14` |
| `PRD-ANLYT-*` | `MET-01`–`MET-19`, especially `MET-15` |
| `PRD-RES-*` | `RES-01`–`RES-04` |
| `PRD-PAY-*` | `DON-01`–`DON-04` plus `RES-02` |
| `PRD-MIG-*` | PRD Section 12 and `MET-19` |
| `PRD-NFR-*` | `SAFE-*`, `PRIV-*`, `A11Y-*`, `QUAL-*` |

The compact `PRD-*` names in this document are behavior-group labels, not substitutes for canonical requirement IDs. Before a row becomes an executable test, it must list the exact applicable IDs from `01-product-prd.md` in metadata, title suffix, annotation, or test-management export. The trace matrix records exact requirement → risk → seam → automated tests → UAT scenario → release result. A requirement is not complete merely because a unit test exists.

## 4. Test portfolio and tools

The portfolio emphasizes integration and targeted E2E coverage. Percentages are guidance by maintained behavior coverage, not a line-count quota.

| Layer | Approximate emphasis | Purpose | Tools |
|---|---:|---|---|
| Pure unit/property | 15–20% | Parsers, policy tables, time/rate calculations, cursor encoding, sanitization helpers, adapter normalization | Vitest for shared/web code; Jest or Vitest for NestJS; fast-check if property tests add value |
| Service/API integration | 45–55% | Behavior through HTTP/job effects with real Postgres/Redis and application wiring | Supertest, Nest test application, Testcontainers for PostgreSQL/Redis/MinIO-compatible storage where useful |
| Contract/adapter | 10–15% | OpenAPI/schema compatibility and provider adapter behavior | OpenAPI validation; sandbox probes; Pact only if independently deployed teams genuinely need consumer-driven contracts |
| Browser E2E | 15–20% | Critical user/admin journeys, responsive behavior, accessibility integration | Playwright, Axe via `@axe-core/playwright` |
| Nonfunctional/recovery | Risk-based | Load, reliability, restore, migration, browser/accessibility/security | k6, Playwright projects, Testcontainers, OWASP ZAP baseline where approved, dependency/secret/container scanners |

### 4.1 Tool choices

- **Vitest** is preferred for Next.js/shared TypeScript tests; use the framework-supported React Testing Library only where a component has substantial public interaction behavior that is cheaper than browser E2E.
- **Jest + Supertest** is acceptable for NestJS if the repository’s Nest tooling is already Jest-based. Avoid maintaining two runners in the same package without benefit.
- **Playwright** runs Chromium on every PR and the approved Chromium/Firefox/WebKit matrix at least nightly and before release.
- **Testcontainers** provisions real PostgreSQL and Redis. Use an S3-compatible container or deterministic adapter fake for routine integration; provider sandbox checks cover R2/S3 differences.
- **Pact** is not initially required in a monorepo with generated OpenAPI and coordinated deployment. Introduce it only if web/API release independently and ownership makes consumer-driven contracts useful.
- **k6** drives HTTP and WebSocket load with production-like datasets and thresholds from [03](./03-tech-design.md).
- **Axe** catches automatable accessibility issues; manual keyboard, screen-reader, zoom/reflow, contrast, and cognitive review remain required.

## 5. TDD workflow

### 5.1 One red-to-green tracer slice

1. Select the smallest user-visible behavior from a Ready implementation slice and attach its PRD ID.
2. Agree or update the relevant public seam and authorization/privacy examples.
3. Write one behavior test at the lowest public seam that proves the user outcome—usually API integration, sometimes browser E2E or adapter contract.
4. Run it and retain evidence that it fails for the intended missing behavior, not bad setup.
5. Add the minimum production code and migration/UI/job wiring to make it pass.
6. Keep all previous tests green; refactor only after green.
7. Add the next highest-risk example: authorization/privacy, concurrency/idempotency, rate limit, external failure, or accessibility.
8. Complete the user-visible demo, observability, rollback, and trace record before starting the next slice.

Do not write a full module’s speculative tests in advance. Do not implement all persistence before one browser/API path is green.

### 5.2 Test naming

Names describe behavior, context, and outcome:

```text
[ANON-05] anonymous post quota / when 11 requests race / persists at most 10
[MSG-02] reconnect / after ack is lost / history contains one message
[DON-02][RES-02] Stripe webhook / when event is replayed / grants one entitlement
[ADM-12] global circle action / as Member / returns forbidden and creates no mutation
```

Preferred structure:

```ts
describe("[CIRC-03] circle join approval", () => {
  it("when approval is required, keeps the requester out until a circle admin approves", async () => {
    // Arrange only externally meaningful state.
    // Act through REST or browser.
    // Assert response plus durable, user-visible behavior.
  });
});
```

Avoid names such as `calls repository`, `sets state`, `returns mocked response`, or `works`.

### 5.3 Test-quality rules

- Arrange through factories/public setup APIs; act through the public seam; assert outcomes and prohibited observations.
- One test may inspect the database when verifying a database constraint, migration, audit record, outbox atomicity, or privacy invariant. Otherwise prefer API/UI-visible effects.
- Never mock Prisma repositories, internal Nest services, React hooks, Redis, clocks globally without explicit injection, or the code under test.
- Mocks/fakes are limited to external providers and nondeterministic system seams such as an injected clock/random source.
- Do not assert implementation call counts unless the call itself is an external contractual effect, such as one logical email or payment operation.
- Snapshot tests are limited to stable protocol/error/anonymous-serialization contracts and must be small and reviewed. No broad DOM snapshots.
- A test that would pass after replacing production logic with the fixture’s literal expected result is likely tautological and must be rewritten.

## 6. Behavior matrix by module

The matrix is a minimum risk inventory. Each row becomes one or more tests mapped to the final [01](./01-product-prd.md) IDs.

### 6.1 Authentication, sessions, age, and deletion

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-AUTH-REG` | 16+ user registers, receives one verification email, verifies | Under-16, malformed/duplicate normalized email/username, weak password | Generic duplicate/recovery responses do not enumerate accounts; password/token absent from logs | Repeated registration/verification consumes one token and creates one account; registration throttled |
| `PRD-AUTH-OAUTH` | Google/Apple user signs in and approved account links | Provider denial, missing/private relay email, invalid state/nonce | No silent link to an existing account without verified match/confirmation | Concurrent callbacks create one identity/account |
| `PRD-AUTH-LOGIN` | Verified active user logs in and logout revokes current session | Wrong credentials, unverified/deleted/suspended/banned user | Cookie flags, CSRF, rotation, generic errors; no session token in body/log | Brute-force limits; concurrent refresh/rotation cannot resurrect old token |
| `PRD-AUTH-RESET` | Reset email and single-use password change revoke policy-defined sessions | Expired/used/malformed token | Account existence hidden; token hashed and absent from logs/referrers | Replayed token fails; concurrent reset completion has one winner |
| `PRD-AUTH-SESS` | User lists/revokes one or all other sessions | Unknown session | Can only view/revoke own sessions; admin capability follows explicit matrix | Repeated revoke is safely idempotent |
| `PRD-AUTH-EXPORT` | Re-authenticated member requests account-wide export, receives ready notice, and downloads before expiry | Re-auth failure, job/storage failure, expired link | Export includes only data the requester is entitled to, may include own wellness records, excludes counterpart private data, and is encrypted/private | Duplicate request returns one active job; worker retry does not create conflicting archives |
| `PRD-AUTH-DEL` | Re-authenticated user requests deletion and observes completion | Invalid confirmation or policy hold | Other users cannot query status; retained records follow policy; emails/content handled as approved | Duplicate requests create one workflow; worker retries do not double-delete |

### 6.2 Profiles, connections, blocks, and activity

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-PROF-EDIT` | Owner edits avatar, cover, display name, username, and bio; media persists only after crop/confirm | Length/format/unknown-field and invalid/oversized media errors | Other user cannot edit; private/system fields never serialize | Two updates follow version/ETag policy; upload completion retry is idempotent |
| `PRD-PROF-CONN` | Request, accept, list, remove connection | Self-request, invalid state transition | Nonparties cannot view/alter request | Crossed requests converge; duplicate accept/remove idempotent |
| `PRD-PROF-BLOCK` | Block removes/prevents connection and DM eligibility | Self/unknown target | Blocked actor cannot infer private activity beyond approved UX | Simultaneous connect/block resolves with block winning |
| `PRD-PROF-ACT` | User sees allowed activity | Deleted/missing activities omitted/tombstoned | Visibility/block/circle membership enforced in query | Pagination stable during new activity |

### 6.3 Feed, media, links, comments, reactions, search

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-FEED-MODE` | Relevant/Chronological returns deterministic eligible order and remains selected for the current browser session | Invalid mode rejected | Both modes apply visibility/block/circle policy before limit; no server-side profile preference is created | New concurrent posts do not reorder already rendered items |
| `PRD-FEED-POST` | Create/list/edit within 15 minutes/soft-delete under Public, Members, Connections, or Only me | Empty/oversize/invalid visibility; stale edit rejected with preserved UI copy | Author derived from session; edit/delete owner/admin policy; visibility query-level | Retry creates one post; ETag/version conflict tested |
| `PRD-FEED-PAGE` | Infinite cursor yields deterministic continuation | Invalid/expired cursor returns stable error | Ineligible content never appears/counts | Concurrent insert produces no duplicate and documented inclusion behavior |
| `PRD-FEED-MEDIA` | Zero to four approved images finalize, reorder, and display with alt text | Fifth image, MIME signature mismatch, oversize, abandoned upload, missing object | Presigned key scoped; object read authorization; metadata cannot leak identity/location | Finalize retry idempotent; orphan cleanup cannot delete attached media |
| `PRD-FEED-LINK` | Safe link gets editable/removable preview; post survives preview failure | Invalid scheme/DNS/timeout/oversize response | SSRF blocks loopback/private/link-local/metadata and redirect pivots | Repeated URL fetch deduped/cached according to contract |
| `PRD-FEED-COMMENT` | Add/list/edit within 15 minutes/delete top-level comment or one-level reply; reply-to-reply is flattened | Empty/oversize/deleted parent; stale edit | Visibility/block/circle policy inherited; only permitted editor | Duplicate request idempotent; parent deletion race safe |
| `PRD-FEED-REACT` | Add/change/remove one current Support, Hug, or Insightful reaction | Unsupported kind | Cannot react to invisible/deleted content | Concurrent changes converge to one reaction per member/target |
| `PRD-FEED-SEARCH` | Search/filter returns matching eligible content | Invalid query/filter/cursor | Private/circle/blocked/deleted content absent, including counts/snippets | Index lag contract met; pagination stable |

### 6.4 Anonymous posts and comments

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-ANON-CREATE` | Member toggles anonymous and receives generated pseudonym | Invalid content follows feed rules | User REST/UI/socket/search/notification/analytics never exposes creator ID, username, profile URL, avatar, storage key, or correlation metadata | Atomic 10/day limit: 11 racing creates persist at most 10; retries do not consume twice |
| `PRD-ANON-COMMENT` | Anonymous comment displays pseudonym | Deleted/invisible parent | No anonymous profile or DM action; parent visibility applies | Same quota/accounting policy as approved |
| `PRD-ANON-TRACE` | Authorized admin supplies reason and traces identity | Missing/invalid reason or deleted mapping | Member/Circle Admin/unauthorized global role forbidden; success/denial audited without leaking to unrelated admin list | Concurrent trace requests do not alter identity/content |
| `PRD-ANON-LEAK` | Public representation contains only approved fields | N/A | Inspect REST, Socket.IO, HTML/Next data, cache headers, search, emails, logs, analytics exports, object metadata | Stable serializer snapshots prevent accidental field addition |

### 6.5 Circles

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-CIRC-DIR` | Search/list/detail across public/private/hidden visibility and approved previews | Invalid query/cursor | Hidden circles undiscoverable unless authorized; private/member-list rules enforced | Stable pagination during create/update |
| `PRD-CIRC-JOIN` | Open joins; approval remains pending; private uses invitation | Closed/expired invite/invalid state | Nonmember cannot read private feed/member list; only Circle Admin approves | Duplicate/crossed join/approval converges |
| `PRD-CIRC-INV` | Invite accepted by intended eligible member | Expired/revoked/malformed token | Token hashed; not transferable if contract binds recipient | Replay creates one membership |
| `PRD-CIRC-CREATE` | Eligible member creates circle and becomes circle admin | Invalid name/privacy or ineligible creator | Server assigns role; no moderator/featured/event fields | Duplicate/idempotent create and slug collision |
| `PRD-CIRC-ADMIN` | Circle Admin edits, approves, removes/invites, reason-mutes a member, and removes a circle post with reason | Invalid role transition/last-admin removal/mute duration | Member cannot administer; no Circle Moderator; global roles follow matrix; actions audited | Remove/mute versus post race prevents the disallowed commit |
| `PRD-CIRC-FEED` | Member reads/posts eligible circle content | Invalid/deleted circle | Membership and block policy on create/read/search | Leave/remove during pagination/socket invalidates access |

### 6.6 Direct messaging and Socket.IO

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-MSG-THREAD` | Connected pair opens canonical 1:1 thread/history | Self/nonconnection/invalid cursor | Nonparticipant cannot discover/read/search thread | Concurrent open creates one pair thread |
| `PRD-MSG-SEND` | Persisted text sends, acknowledges, appears in both clients | Empty/oversize/malformed payload/provider disconnect | Connection and block checked at REST/socket and immediately before persist | Client message ID retry creates one message; send throttled |
| `PRD-MSG-ORDER` | Messages render in server sequence/time order | Gap triggers REST reconciliation | Only thread room receives event | Out-of-order/duplicate events dedupe; same timestamp still deterministic |
| `PRD-MSG-RECON` | Disconnect/reconnect with cursor catches up | Invalid/stale cursor takes safe full reconciliation path | Revoked session or new block cannot rejoin/catch up beyond policy | Lost ack followed by retry remains one durable message |
| `PRD-MSG-SEARCH` | Participant searches own thread history | Invalid/oversize query | Other/blocked-user historical visibility follows approved policy; no global leakage | Search pagination stable |
| `PRD-MSG-REACT` | Participant adds/removes emoji reaction | Unsupported emoji/deleted message | Nonparticipant forbidden | Duplicate reaction converges |

Explicit protocol assertions verify there are no typing, read-receipt, file, reporting, group, or voice event names.

### 6.7 Notifications, email, outbox, and broadcasts

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-NOTIF-INAPP` | Domain event appears once with valid deep link and can be read | Deleted target renders safe fallback | Only recipient can list/read; payload contains no unauthorized preview | Duplicate outbox delivery creates one logical notification; read race converges |
| `PRD-NOTIF-EMAIL` | Comment, reaction, connection, DM, circle invite, or admin action yields one applicable sandbox email | Invalid address/template/transient/terminal provider failure | No BCC/recipient/body leakage; sensitive text omitted; safe token/deep link re-authorizes | Stable logical ID prevents duplicate email through retries |
| `PRD-NOTIF-OUTBOX` | Transaction commits domain state and outbox atomically | Worker crash/retry/dead letter | Payload minimized and redacted in logs | Reprocessing at least once leaves exactly one logical effect |
| `PRD-NOTIF-CAST` | Authorized admin previews/sends to approved audience and observes status | Empty/oversize/invalid audience/template | Member/Circle Admin and ungranted global roles denied; recipient snapshot protected; action audited | Double submit/retry does not fan out twice; send rate protects provider |

No digest, push, mute, or notification preference behavior is tested because it is excluded.

### 6.8 Wellness

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-WELL-ENTRY` | Owner records mood 1–5 with optional note and updates the same local-day check-in | Out-of-range/oversize/invalid date/timezone | No other member, Circle Admin, Moderator, Content Editor, Analyst, or routine admin view can read value/note; note absent from logs/analytics | Concurrent same-day saves leave one versioned row |
| `PRD-WELL-TREND` | 7/30-day trend matches known fixture and has text equivalent | Empty/sparse range handled | Owner-only aggregation | UTC/user-timezone/DST boundary deterministic |

### 6.9 Standalone events

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-EVENT-CRUD` | Authorized staff creates/edits/cancels event with timezone | End before start, past/invalid time, oversize fields | Ordinary members cannot mutate; no virtual/circle-link fields accepted | Concurrent edit follows version policy |
| `PRD-EVENT-RSVP` | Member selects/changes Going, Maybe, or Not going and counts update | Closed/cancelled/past state | User changes only own RSVP; attendee visibility follows policy | Concurrent duplicate yields one RSVP and correct count |
| `PRD-EVENT-CAL` | Month/List show equivalent eligible events in correct local position | Invalid/huge range | Ineligible events omitted | Boundary and timezone pagination stable |
| `PRD-EVENT-REM` | 24h and 1h reminders each produce one logical email for Going/Maybe policy | Late-created/rescheduled/cancelled/provider failure | Only eligible RSVP recipients receive reminder | Repeated scans/retries are idempotent per event/user/occurrence; schedule lag recoverable |

### 6.10 Ava and AI moderation

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-AI-CHAT` | Logged-in user chats, views private history/starters/resources | Provider timeout/refusal/malformed/empty response shows safe retryable state | Other users/admins cannot read history; transcript absent from logs/analytics/moderation inputs | Atomic 50 accepted member messages per UTC calendar day under race; retry semantics do not double-charge when request is idempotent |
| `PRD-AI-CONSENT` | Explicit versioned consent enables personality preference use | Missing/stale consent blocks use and offers choice | Preference not inferred/shared; withdrawal stops future use | Concurrent consent changes resolve deterministically |
| `PRD-AI-REC` | Opted-in user gets eligible circle recommendations | No candidates/provider failure gives neutral state | Uses only approved minimized inputs; private circles not leaked | Repeated request respects quota/cache contract |
| `PRD-AI-DELETE` | User deletes selected/all private history | Unknown/already-deleted conversation | Owner-only; provider/storage retention follows policy | Retry idempotent; deletion race with in-flight response cannot resurrect history |
| `PRD-AI-INJECT` | Adversarial user content remains untrusted data | Prompt asks for system prompt, secrets, other users, tools, policy bypass | No secrets, cross-user context, admin action, network/tool execution, or hidden prompt returned | Repeated attack cannot escalate quota/access |
| `PRD-AI-MOD` | An eligible community post/comment can create a limited flag for human disposition | Provider outage/invalid result/deleted content | Only approved Moderator/Super Admin sees; Ava transcripts/preferences are never inputs or targets; no automated sanction; viewing/disposition audited | Duplicate evaluation produces one active logical flag |
| `PRD-AI-CRISIS-ABSENT` | Static crisis disclaimer/resources are available | Links/content validated | No automated crisis classifier, branching, claim, or event exists | Regression checks keep crisis automation absent |

Provider sandbox/legal evidence must prove the configured service is not used for provider training. A mocked adapter cannot prove this requirement.

### 6.11 Resources and progress

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-RES-LIST` | Authenticated member search/filter returns eligible article/video/worksheet | Invalid query/type/cursor | Unauthenticated access is denied under OQ-06 default; access-tier metadata/content visibility enforced | Stable pagination/index lag |
| `PRD-RES-ACCESS` | Free, member, and purchased access work | Missing/unavailable/expired asset | Server entitlement check; signed URL expires; no direct bucket key leakage | Purchase webhook race cannot transiently duplicate entitlement |
| `PRD-RES-PROG` | Member records and views own progress | Invalid percentage/state/resource | Owner-only; no admin browse unless approved | Retries and concurrent updates follow max/version policy |

No builder, quiz, PDF download, or certificate behavior is tested. Regression tests may reject these resource types/routes.

### 6.12 Stripe payments and donations

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-PAY-CHECK` | Server creates approved one-time/monthly donation or resource checkout | Invalid amount/currency/resource, provider unavailable | Client cannot set price/product ownership; no card data stored/logged | Idempotency key prevents duplicate session intent |
| `PRD-PAY-WEBHOOK` | Signed event updates donation/purchase and grants entitlement | Bad signature/body, unknown object/type | Raw secret/signature protected; only endpoint can submit but signature is authority | Duplicate/out-of-order events converge by Stripe object state/event ledger |
| `PRD-PAY-RETURN` | Return page shows pending then webhook-confirmed result | Cancel/abandon/late webhook | Browser query params cannot grant entitlement | Reload/retry safe |
| `PRD-PAY-REFUND` | Refund/cancel/dispute follows approved status and entitlement policy | Partial/unknown/out-of-order state | Admin actions and finance view role-protected/audited | Reconciliation detects and repairs missed event without duplicate effects |

### 6.13 Blog

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-BLOG-READ` | Public list/post/categories/tags/related/RSS show published content | Missing slug, empty category, malformed feed consumer | Draft/scheduled content and preview tokens do not leak | Cache invalidation and pagination consistent |
| `PRD-BLOG-CRUD` | Authorized admin creates, previews, edits, publishes | Invalid slug/content/status/schedule | Role matrix; sanitized HTML; preview token scoped/expiring; audit | Slug/version conflict handled |
| `PRD-BLOG-SCHED` | Due post publishes once at intended UTC/timezone | Reschedule/cancel/worker outage | No early public visibility | Repeated scans/retries idempotent; catch-up after outage |

No product SEO management or author-profile suite is present.

### 6.14 Admin, RBAC, audit, and limited safety alerts

Canonical initial RBAC matrix; any change requires a coordinated PRD, architecture, schema, and test update:

| Action | Member | Circle Admin | Moderator | Content Editor | Analyst | Super Admin |
|---|---:|---:|---:|---:|---:|---:|
| Use member application | Allow | Allow | If member account | If member account | If member account | If member account |
| Operate assigned circle | Member actions | Allow own circle | Policy only | Deny | Deny | Allow |
| View limited AI flags | Deny | Deny | Allow | Deny | Deny | Allow |
| Suspend/ban user | Deny | Deny | If permission/policy grants | Deny | Deny | Allow |
| Reveal anonymous identity with reason | Deny | Deny | Only with separate sensitive permission | Deny | Deny | Allow |
| Blog CRUD/schedule | Deny | Deny | Deny | Allow | Deny | Allow |
| Resource content operations | Deny | Deny | Deny | If granted | Deny | Allow |
| Donation detail | Own receipt | Own receipt | Deny | Deny | Aggregate if granted | Allow |
| Analytics view/export | Own data only | Circle member list only | Limited operations | Content scope if granted | Allow | Allow |
| Global audit log | Deny | Deny | Own admin actions only if provided | Own actions if provided | Deny | Allow |
| Assign global roles | Deny | Deny | Deny | Deny | Deny | Allow |

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-ADMIN-RBAC` | Every approved role/action pair succeeds | Unknown action/target | Every denied pair returns safe denial through direct UI/API/socket attempts | Role removal invalidates active privileged access per policy |
| `PRD-ADMIN-ENFORCE` | Authorized Moderator suspends under policy; Super Admin suspends/bans/restores with reason; due suspension auto-restores | Missing reason, invalid duration/state, self/last-Super-Admin enforcement | Ordinary members and ungranted roles denied; active sessions revoked; member receives approved outbox-driven action email; full reason restricted | Racing enforcement/restore/expiry leaves one active record and account status consistent; worker retry sends one logical email |
| `PRD-ADMIN-AUDIT` | Sensitive action records actor/action/target/request/reason/outcome | Audit sink failure follows fail-safe policy | Audit immutable to ordinary admins; before/after minimized | Retried action does not create misleading duplicate outcomes |
| `PRD-ADMIN-DASH` | Approved operational summaries reconcile | Empty/stale aggregate represented | No sensitive content in dashboard | Refresh/load bounded |
| `PRD-ADMIN-EXPORT` | Authorized export is generated and expires | Job/provider/storage failure | Scope, columns, signed URL, audit, and deletion rules enforced | Double-click creates one logical export or separate clearly labeled requests |

### 6.15 First-party analytics

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-ANLYT-EVT` | Approved versioned event ingests and aggregates | Unknown/version-invalid event rejected/quarantined | No community content, DM, mood note, AI text, anonymous creator identity, token, or raw payment payload | Event ID dedupe; late/out-of-order treatment deterministic |
| `PRD-ANLYT-MET` | User/engagement/funnel numbers match fixture definition | Empty/partial/stale intervals disclosed | Admin-only and minimized dimensions | Timezone/date boundaries and recomputation stable |
| `PRD-ANLYT-EXP` | Export equals dashboard definition and records formula/version | Job failure/expiry | Authorized columns only; signed link expires; audit | Retry/dedupe and deletion treatment correct |

No circle-health or moderation analytics metrics are tested or emitted.

### 6.16 Migration and static-site integration

| Trace | Happy path | Error/validation | Authorization/privacy | Concurrency/idempotency/rate |
|---|---|---|---|---|
| `PRD-MIG-BB` | Approved BuddyBoss users/content/membership/media map correctly | Orphan/malformed/duplicate/unsupported row goes to actionable reject report | Private/blocked/deleted/anonymous semantics preserved; export access and destruction audited | Re-running import creates no duplicates; checkpoint resume deterministic |
| `PRD-MIG-CLAIM` | Imported user claims account through approved reset/verification | Expired/collision/unmigratable credential | No account enumeration/takeover | Concurrent claim has one winner |
| `PRD-MIG-REC` | Counts, mappings, hashes, samples, and permission queries reconcile | Mismatch blocks cutover | Private data sampled only by approved personnel | Same input/checksum gives same output/rejects |
| `PRD-MIG-STATIC` | Landing→login/register→app and blog/donation paths preserve environment/return URL | Invalid/open return URL, stale cache, route 404 | Cookie/CSP/CORS/canonical boundaries safe | Deploy/cache transitions do not mix incompatible assets |

## 7. Cross-cutting critical test suites

### 7.1 Authorization and privacy

- Generate a subject/resource/action matrix for anonymous, unverified, member, connected/nonconnected/blocked member, circle member/admin, platform admin, and super admin.
- For every list/search/count/export endpoint, verify forbidden records are filtered before pagination and aggregation.
- Test direct object reference substitution, nested resource mismatch, stale role/session, and socket-room/event forgery.
- Run anonymous identity leak checks over REST JSON, Socket.IO payloads, rendered HTML/Next serialization, accessibility names, URLs, object metadata, cache keys/headers, search snippets, email sandbox, structured logs, admin lists, analytics, exports, and backups/reject reports.
- Verify AI transcript, DM text, mood note, reset/invite tokens, payment secrets, and anonymous mappings are absent from logs/metrics.

### 7.2 Deletion and retention

Create a data inventory test table from [04](./04-backend-schema.md):

| Data class | On user deletion | Retention verification |
|---|---|---|
| Credentials/sessions/OAuth tokens | Revoke/purge per policy | Login and refresh fail; token rows gone/invalid |
| Profile/direct identifiers | Purge or approved anonymization | User/API/admin/search/export no longer expose |
| Posts/comments/reactions | Soft-delete/anonymize per approved policy | Tombstone and referential behavior correct |
| Anonymous mapping | Restricted retention/purge per safety/legal policy | Never becomes public; admin access follows policy |
| Connections/blocks/circle memberships | Remove/anonymize as approved | Other users’ lists and counts reconcile |
| DMs | Approved delete/anonymize/retain semantics | Both participants’ view matches policy |
| Mood/AI history | Purge per private-data policy | API/storage/provider follow-up evidence |
| Notifications/outbox | Minimize/purge while preserving operational integrity | No dead references or identity leak |
| Payments | Retain legally required finance record, minimize account link | Donation reconciliation remains valid |
| Analytics | Delete or irreversibly de-identify per approved design | Recomputed/exported metrics follow policy |
| Audit | Retain minimally for approved period | Access restricted; identity handling documented |
| Media/backups | Delete active object; expire from backups by policy | Object unavailable; restore procedure reapplies deletion ledger |

Use a synthetic “data-rich user” that touches every included module, then request deletion and verify immediate, eventual, backup-restore, search-index/cache, object-storage, analytics, and external-provider outcomes.

### 7.3 Rate limits and abuse resistance

Test limits from distributed clients and parallel workers:

- login/recovery/register/provider callback;
- anonymous posts/comments: exactly 10/day according to approved timezone/accounting;
- Ava: exactly 50 accepted member messages per UTC calendar day;
- message send, uploads/link previews, search, circle invites/join, broadcasts, exports, checkout creation, and public forms at approved operational limits.

Assertions cover atomicity, reset timing, retry metadata, safe error copy, no partial write, no bypass by alternate route/socket, and fail-open/fail-closed behavior during Redis failure as approved in [03](./03-tech-design.md).

### 7.4 Idempotency and delivery

- Kill workers after external success but before local acknowledgement, then retry.
- Replay outbox rows, Resend requests, Stripe webhooks, scheduler scans, reminder jobs, moderation requests, analytics events, migration batches, and deletion steps.
- Lose Socket.IO acknowledgements and reconnect.
- Submit browser forms twice and retry after network timeout.

For each path, define “exactly once logically” in terms of durable state and user/provider-visible effects. Infrastructure is assumed at-least-once.

## 8. Nonfunctional testing

Final numeric targets come from [03](./03-tech-design.md). Until then, tests record baselines but do not invent pass thresholds.

### 8.1 Performance and capacity

Use k6 with realistic authorization and seeded cardinality:

- login/session validation and `/api/v1/account`;
- mixed feed first/next page, comments/reactions, search/filter;
- circle directory/detail/feed/join approval;
- Socket.IO connect, sustained 1:1 send/ack, reconnect catch-up;
- notification inbox;
- event calendar and RSVP bursts;
- Ava with provider stub latency/error profiles plus limited sandbox runs;
- resource search/access/progress;
- Stripe webhook bursts/replay;
- admin dashboard/analytics/export initiation.

Measure p50/p95/p99 latency, throughput, HTTP/socket error/ack timeout, DB pool/locks/query plans, Redis latency, queue age, scheduler lag, memory/CPU, provider saturation, and recovery after load. Verify cursor queries and search indexes at expected high-water cardinality. Avoid including private content in k6 output.

### 8.2 Reliability and failure injection

- Restart API/worker/socket instances during requests and active conversations.
- Make Postgres temporarily unavailable/read-only, exhaust pool in controlled test, and verify readiness/failure behavior.
- Evict/restart Redis and verify durable content remains, reconnect/rate-limit policy is explicit, and jobs recover.
- Inject S3/R2 timeout, partial upload, missing object, and stale presigned URL.
- Inject Resend/OpenAI/Stripe timeouts, 429, 5xx, malformed payloads, and delayed callbacks.
- Pause workers beyond reminder/publication times, then resume and verify catch-up/idempotency.
- Verify dead-letter visibility and replay runbook.
- Run a soak test for Socket.IO and queue consumers to detect leaks and duplicate accumulation.

### 8.3 Accessibility

Automated Axe checks on every representative public, app, and admin route in empty, populated, error, dialog, and validation states. Manual release checks include:

- keyboard-only operation, logical focus order, skip navigation, focus restoration, no keyboard traps;
- screen-reader flows for registration, feed composition, anonymous explanation, circle joining, messaging updates, notification count, mood control/trend summary, event RSVP, Ava disclosure/resources, checkout return, blog editor, and admin tables;
- 200% and 400% zoom/reflow, responsive orientation, text spacing, high contrast/forced colors where supported;
- color contrast, non-color status, touch target size, reduced motion;
- live-region behavior that is informative without flooding during realtime messages;
- accessible table/chart alternatives and error summaries.

Critical/serious Axe violations block merge on affected changed routes; unresolved manual WCAG 2.2 AA failure blocks release.

### 8.4 Browser and responsive

Run the approved [02](./02-ux-spec.md) matrix. Proposed baseline:

- latest and previous Chromium desktop;
- latest Firefox desktop;
- latest WebKit/Safari-equivalent;
- representative iPhone Safari and Android Chrome viewport/touch emulation, with a small real-device release smoke where available.

Widths include 320 px, 375/390 px, tablet portrait/landscape, 1280 px, and a wide desktop. Test virtual keyboard/form behavior, infinite scroll restoration, Socket.IO background/reconnect behavior, image sizing, tables/admin overflow, timezone/locale formatting, and no native-app/download messaging.

### 8.5 Security

Security tests are threat-model driven and include:

- authentication/session fixation, cookie flags, CSRF, OAuth state/nonce/PKCE/link collision, recovery enumeration/replay;
- horizontal/vertical IDOR across every resource and admin action;
- stored/reflected DOM XSS in profile/feed/comment/message/circle/blog/resource/AI/admin rendering;
- SQL/query injection and malformed cursor/filter payloads;
- SSRF/DNS rebinding/redirect/private address tests for link preview;
- file polyglots, MIME spoofing, oversize/decompression/image metadata, path/key manipulation, presigned URL scope;
- Socket.IO forged rooms/events, expired/revoked session, origin and payload/rate checks;
- prompt injection, secret/system-prompt/cross-user extraction, unexpected tool/network use, unsafe rendered model content;
- Stripe signature/raw-body/timestamp replay and price/amount tampering;
- admin export formula injection and signed-link expiry;
- CSP, CORS, HSTS, clickjacking, cache-control on private pages, open redirect, host-header handling;
- dependency, lockfile, image/container, secret, IaC/config, and license scans as approved.

Automated scanners complement manual threat review; scanner output alone does not prove authorization or privacy.

### 8.6 Backup and restore

At least before release and on the operational cadence:

1. Create a consistent backup containing representative users, permissions, content, messages, media references, AI/mood private data, payments, audit, analytics, and migration mappings.
2. Restore into an isolated environment with separate credentials and disabled outbound email/AI/Stripe.
3. Migrate restored schema to current.
4. Reconcile row counts, constraints, media checksums/references, entitlements, role/visibility policies, and outbox/job state.
5. Apply deletion ledger/tombstones required since backup and prove a deleted user is not resurrected into active access.
6. Measure recovery point/recovery time against [03](./03-tech-design.md).
7. Destroy restored sensitive test data according to policy.

### 8.7 Migration

- Profile export distributions and invalid values before writing transforms.
- Golden fixtures cover every known source entity/state and edge case.
- Property/invariant checks ensure no orphan target, duplicate source map, invalid role, visibility widening, broken thread pair, or missing media reference.
- Dry run produces deterministic counts, checksums, rejects, and no target mutation when configured read-only.
- Full-scale rehearsal uses production-shaped volume and measures locks, throughput, checkpoint restart, disk, and index cost.
- Sample by risk, not only randomness: private messages, blocks, deleted/banned users, private groups, admin roles, non-ASCII usernames, duplicate emails, old timestamps, large media, malformed HTML.
- Password migration defaults to account claim/reset unless a separately approved safe hash path exists.
- Cutover test includes source freeze/delta, final reconciliation, static redirects, account claim, rollback, and export artifact destruction.

## 9. Test data and determinism

### 9.1 Factories

Use composable factories with valid defaults and explicit traits:

- `user({ verified, role, ageAttestation, deleted })`
- `relationship({ connected, blockedBy })`
- `post({ visibility, anonymous, media, deleted, circle })`
- `circle({ privacy, joinPolicy, admin, members })`
- `thread({ participants, messages, blocked })`
- `notification`, `moodEntry`, `event({ timezone })`, `aiConversation({ consent })`
- `resource({ accessTier })`, `donation`, `purchase`, `blogPost({ status })`

Factories create state through public setup APIs where practical. Direct DB seeding is permitted for test prerequisites that would make suites prohibitively slow, but it must use schema-valid builders and may not bypass the behavior being tested.

### 9.2 Deterministic time and randomness

- Inject a clock into application policy and workers; freeze/advance it per test.
- Use explicit IANA timezones and test DST transitions, month/year boundaries, leap day where relevant.
- Inject deterministic ID/random/pseudonym generators for tests; production uses cryptographically appropriate randomness.
- Seed data generators and record the seed on failure.
- Avoid arbitrary sleeps. Wait on observable API/UI/email/job conditions with bounded polling.
- Provider fixtures are versioned and redact real user data. AI assertions target envelope/policy behavior, not exact prose.

### 9.3 Isolation and cleanup

- Each test receives a unique namespace/schema/database or transaction strategy compatible with concurrency.
- Parallel tests never share email, username, Stripe object, object key, queue name, or clock.
- Cleanup is explicit and failures leave enough identifiers for diagnosis without leaking sensitive content.
- Migration/restore/load suites use dedicated environments and cannot point to production by configuration guard.

## 10. Environment strategy

| Environment | Purpose | Data/external policy |
|---|---|---|
| Local | Fast TDD | Containers for Postgres/Redis/storage; deterministic external adapter fakes; synthetic data |
| PR CI | Unit, integration, contract, changed-route E2E/a11y | Ephemeral isolated services; no production data; external fakes |
| Shared staging | Full integrated journeys/UAT | Production-like topology; provider sandboxes; synthetic and approved migration sample |
| Ephemeral migration/performance | Full-volume rehearsal, k6, restore | Isolated restricted data; outbound providers disabled or sandboxed |
| Production | Smoke and post-release validation only | Synthetic tagged accounts; no destructive tests; real provider low-impact checks |

Configuration must fail closed if production credentials appear in test environments or sandbox credentials appear in production. Resend sandbox/capture prevents accidental real mail during tests. Stripe test mode is mandatory outside production. OpenAI test usage uses synthetic prompts and strict budget/rate caps.

## 11. External mocking policy

Normal integration tests use real application modules, real PostgreSQL, real Redis, and real HTTP/Socket.IO boundaries.

Permitted fakes/mocks:

- OpenAI provider;
- Resend/email provider;
- Stripe API and normalized signed webhook fixtures;
- S3/R2 adapter when a compatible local container is unsuitable;
- Google/Apple token/profile verification boundary;
- injected clock, random source, and network fault injector.

Not permitted:

- mocking Nest controllers/services/repositories to “test” another internal layer;
- mocking Prisma/Redis in tests claiming database/concurrency/rate-limit coverage;
- mocking React hooks or API client in tests claiming an integrated user journey;
- asserting an adapter fake returned exactly what the test configured without verifying application behavior.

Provider sandbox suites validate assumptions that fakes cannot: OAuth claim variants, Resend rendering/delivery request acceptance, Stripe signatures/object states, S3/R2 presign semantics, and OpenAI no-training/configuration evidence plus normalized failure handling.

## 12. CI and merge gates

### 12.1 Pull request

- Formatting, lint, TypeScript compilation, forbidden-secret/content-log checks.
- Unit/property tests.
- API/service integration with PostgreSQL/Redis and migration from empty.
- OpenAPI and Socket.IO schema compatibility diff.
- Critical browser E2E on Chromium for changed journeys.
- Axe on changed representative routes/states.
- Dependency/secret/config scans.
- Traceability check: changed requirement/contract has test and documentation mapping.
- No focused/skipped test without approved ticket and expiry.

### 12.2 Main/nightly

- Full integration and E2E suite across approved browser matrix.
- Reconnect/order/dedupe, outbox/email idempotency, scheduler catch-up, and deletion-rich-user suites.
- Provider sandbox contract tests within rate/budget.
- Broader security dynamic checks and accessibility route crawl.
- Migration from supported previous release with representative dataset.
- Medium k6 regression profile and Socket.IO soak.

### 12.3 Release candidate

- Full release trace matrix and UAT accepted.
- Full-volume migration rehearsal and reconciliation.
- Performance/capacity thresholds, resilience/failure injection, and queue recovery.
- Backup restore and deletion replay.
- Security/privacy threat review and scans with no unaccepted critical/high issue.
- Manual accessibility and supported browser/real-device smoke.
- Production configuration, DNS/TLS, OAuth callback, sender domain, Stripe webhook, object access, observability, and rollback checks.

A required gate may be waived only by named product/engineering/security owners with a written risk, compensating control, expiry, and follow-up. Anonymous identity leaks, cross-user authorization failures, payment integrity failures, and destructive migration/restore failures are not waivable for launch.

## 13. Flaky-test policy

- Retry is diagnostic, not a passing result. CI reports first-attempt and retry outcomes separately.
- A newly flaky test blocks the introducing change until fixed or quarantined with an owner, issue, evidence, and short expiry.
- Quarantined tests do not count toward requirement/release coverage; if they cover a release-critical behavior, release is blocked.
- Never fix flakiness with arbitrary longer sleeps. Use deterministic time, isolated data, observable-condition waits, stable locators, and captured request/event/job IDs.
- Track flake rate, top offenders, quarantine age, and environment failures. Repeated product races revealed by tests are product defects, not test flakes.
- Capture Playwright trace/video/screenshot on first retry, API/worker structured logs by correlation ID, container state, and random seed while preserving redaction.

## 14. UAT

UAT uses scripted role-based journeys tied to [01](./01-product-prd.md) and [02](./02-ux-spec.md), not exploratory sign-off alone.

Required personas:

- new email/password member and Google/Apple member;
- connected and blocked members;
- anonymous contributor;
- open/private/approval circle member and circle admin;
- messaging participant with reconnect;
- Ava opt-in and non-consenting member;
- free/member/paid-resource user and donor;
- Content Editor, Analyst, Moderator, and Super Admin roles with distinct permission sets;
- imported BuddyBoss account claimant.

Each script records expected result, actual result, browser/viewport, accessibility observations, data/privacy check, requirement IDs, evidence, and approver. UAT confirms warm/nonclinical copy, static crisis resources, web-only language, absence of excluded controls, and static-site handoffs.

## 15. Release smoke, rollout checks, and rollback validation

### 15.1 Production-safe smoke

Using tagged synthetic accounts:

1. Landing link opens register/login on the correct environment and safe return URL.
2. Register, verification email, login, `/api/v1/account`, logout/session revocation.
3. Create/edit/delete visible and anonymous test posts; verify anonymous response/log redaction and quota response without exhausting real users.
4. Connect two synthetic users, send/reconnect/search one message, then block and verify send denial.
5. Join/approve a test circle and verify removed-member denial.
6. Confirm one in-app/email notification.
7. Record/delete a synthetic mood entry and verify trend.
8. Create/cancel a synthetic event without sending broad reminders.
9. Send/delete a synthetic Ava conversation; verify static crisis resources and consent gate.
10. Access free/member resource; run a minimal Stripe test/live-safe operational probe according to finance runbook—never create fake live financial records without approval.
11. Publish/unpublish or use an approved test blog post, verify RSS.
12. Verify admin RBAC/audit and analytics freshness with non-sensitive synthetic events.

### 15.2 Rollout health

At each cohort checkpoint compare against approved thresholds:

- auth/verification/recovery and OAuth failures;
- HTTP and Socket.IO latency/error/ack/reconnect;
- authorization/privacy alerts and anonymous trace audit;
- DB saturation/locks, Redis health, queue age/retry/dead letter;
- email send/failure/duplicate indicators;
- AI timeout/rate/provider spend with no transcript logs;
- Stripe webhook lag/reconciliation mismatch;
- media errors/orphans, scheduler lag, analytics freshness;
- support volume and UAT-like synthetic outcomes.

### 15.3 Rollback test

Before release, rehearse:

- disabling new writes/feature exposure while preserving safe reads and account deletion/history access where required;
- rolling application code back across additive backward-compatible migrations;
- pausing/draining/restarting workers without duplicate effects;
- preserving webhook acceptance when checkout creation is disabled;
- switching Socket.IO clients to REST reconciliation;
- restoring verified backup only when forward correction is unsafe, then applying post-backup deletion/payment/event reconciliation;
- returning static-site routes to the prior compatible app target.

After rollback, rerun the critical smoke and reconcile payments, jobs, messages, anonymous content, and migration mappings. A rollback is not successful merely because health endpoints are green.

## 16. Excluded-capability test policy

There are intentionally no functional test suites for:

- 2FA;
- profile privacy/preferences/badges;
- feed content warnings, mentions, hashtags, pinning, reports;
- consistent anonymous aliases, anonymous DMs/profile links, toxicity scanning;
- member-facing featured circles, circle events, Circle Moderator role;
- DM receipts, typing, files, reports, groups, voice;
- automated crisis detection, AI summarization, journal prompts, AI admin configuration;
- notification digest, push, mute, preferences;
- wellness streaks, reminders, module-level CSV/PDF export, journaling; account-wide statutory export is tested separately under authentication/data rights;
- event virtual links, recurrence, circle linkage;
- admin user-report queue or feature flags;
- circle-health/moderation analytics;
- resource builder, quiz, PDF download, certificate;
- core subscription plans or community feature paywalls;
- native apps, App Store/Play Store, or download flows;
- Sentry/PostHog.

Where useful, narrow regression assertions verify that related routes, fields, controls, protocol events, entitlements, and admin navigation remain absent or rejected. These absence assertions do not justify scaffolding the excluded feature.

## 17. Exit criteria and unresolved test decisions

Testing is release-complete when all release gates in [05](./05-implementation-plan.md) and this plan pass, traceability has no unexplained in-scope gaps, critical privacy/payment/migration invariants have independent evidence, and UAT owners sign off.

The following require resolution:

- Final OpenAPI and Socket.IO schemas at the proposed public seams; PRD IDs and browser routes are canonical.
- Exact application performance, availability, queue-lag, and capacity thresholds; [03](./03-tech-design.md) currently proposes only PostgreSQL RPO ≤15 minutes and regional RTO ≤4 hours.
- Final screen-reader/real-device combinations within the current-and-previous evergreen browser baseline.
- Freeze contract tests for the reconciled schema baseline: four post-visibility values; separate circle visibility/join-policy enums; avatar and profile cover; one current reaction per actor/target; `MAYBE` RSVP; distinct 24-hour and 1-hour reminder rows; and exact canonical global role seeds.
- Block and deletion effects on retained/historical content, especially DMs.
- Anonymous quota timezone and whether posts/comments share one pool.
- Circle privacy, member-list, creation, invite, removal, and historical-content semantics.
- Message history visibility after unfriend/block/delete.
- Safe template/deep-link details for the enumerated notification email families.
- Event creator, timezone ambiguity, reschedule, cancellation, and attendee-visibility policy; event capacity remains out of scope. Mood is fixed at one editable local-day check-in.
- AI model/provider/no-training evidence, consent/versioning, quota charging on failed requests, moderation scope, and flag retention.
- Resource formats/progress and paid entitlement refund/revoke behavior.
- Stripe currencies, guest donor, recurring cancellation, refund/dispute, tax/receipt, and live smoke policy.
- Admin action-level RBAC, audit retention/failure mode, and break-glass process.
- Analytics taxonomy/formulas/retention/deletion and export columns.
- BuddyBoss source coverage, password claim, private-message migration permission, and cutover volume.
