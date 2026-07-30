# NotOnlyHere Authenticated Web Product — Product Requirements Document

## Document metadata and authority

| Field | Value |
|---|---|
| Product | NotOnlyHere authenticated web application and web admin panel |
| Document | `01-product-prd.md` |
| Status | **Target — implementation-ready product baseline** |
| Version | 1.0 |
| Date | 2026-07-29 |
| Audience | Product, design, engineering, safety, operations, analytics, QA |
| Canonical source | This file is canonical for product scope, priorities, roles, requirements, release gates, and product metrics. |
| Companion documents | UX behavior: `02-ux-spec.md`; architecture and interfaces: `03-tech-design.md`; data: `04-backend-schema.md`; delivery: `05-implementation-plan.md`; verification: `06-testing-plan.md` |
| Source baseline | Client-approved `NotOnlyHere_Web_Development_Proposal_b4dd.pdf`; visible strike-through marks are treated as explicit exclusions. Later owner instruction establishes a web-only product and removes all app-download/native-app scope. |

### Decision labels

- **Live now** — behavior already owned by the existing static marketing website or an existing migration source. It is an integration constraint, not proof that authenticated product functionality exists.
- **Target** — required end state for the authenticated web product.
- **Transition** — temporary migration, compatibility, rollout, or operational behavior on the path to Target.
- **P0 / Release blocker** — required for initial production release.
- **P1** — expected follow-up after a safe initial release.
- **P2** — deferred; not a release commitment.
- **Excluded** — deliberately out of scope. It must not be inferred from adjacent requirements.

When companion documents disagree, this PRD controls product intent; `02-ux-spec.md` controls interaction details; `03-tech-design.md` controls architecture and interface contracts; `04-backend-schema.md` controls persistence; `05-implementation-plan.md` controls sequencing; and `06-testing-plan.md` controls verification, never scope.

Template references in the proposal to “Neuroava,” an “existing mobile app,” Apple App Store guidelines, Google Play policies, and native/mobile delivery are superseded and are not NotOnlyHere requirements.

## 1. Decision summary

1. **Target — Web only.** Build a responsive authenticated web application and a separate web admin panel. There is no native mobile application, install prompt, app-store distribution, or app download page.
2. **Live now — Static marketing boundary.** The existing marketing website remains outside implementation scope. It owns public marketing and public SEO. It links into `/login`, `/register`, public blog content, and donation entry points; authenticated product routes must return users safely to the application.
3. **Target — Technology direction.** Frontend: Next.js 15, React 19, TypeScript, Tailwind. Backend: NestJS Node API. Data and services: PostgreSQL with Prisma, Redis, Socket.IO, S3/R2, OpenAI, Resend, and Stripe. This PRD describes behavior rather than detailed implementation; see `03-tech-design.md`.
4. **Target — Community model.** Members participate through profiles, feed, circles, connections, one-to-one messaging, notifications, events, resources, mood check-ins, blogs, and Ava.
5. **Target — Safety model.** Peer support is not therapy. Ava is not a therapist. Static crisis resources are always discoverable; the product performs no automated crisis classification or escalation. AI moderation may flag content for human review but never autonomously punish a user.
6. **Target — Identity and anonymity.** Members have accountable accounts and may use a generated, per-contribution anonymous persona on eligible posts and comments. Anonymous activity remains traceable to authorized administrators, has no profile link, cannot initiate DMs, and is limited to 10 anonymous contributions per UTC calendar day unless OQ-04 is explicitly resolved otherwise. The API contract is in `03-tech-design.md`.
7. **Target — Access and revenue.** Core community access has no subscription plan or paywall. Donations may be one-time or monthly. Individual resource items may be free, members-only, or one-time paid.
8. **Target — Administration.** Global roles are Super Admin, Moderator, Content Editor, and Analyst. Circle governance has Member and Circle Admin only; there is no Circle Moderator.
9. **Target — First-party measurement.** Product analytics use first-party events and operational data. Do not add third-party product analytics or claim Sentry/PostHog usage.

## 2. Problem, evidence, and opportunity

### 2.1 Problem statement

People seeking peer connection often face three barriers: fear of being identified, difficulty finding a relevant smaller community, and uncertainty about whether a space is safe or emotionally appropriate. Existing social products optimize for reach and engagement rather than thoughtful support. NotOnlyHere needs an authenticated experience where a person aged 16 or older can participate at their own comfort level, connect with peers, and access supportive tools without mistaking the product for clinical care.

Operators need enough identity traceability, role control, moderation assistance, and auditability to keep the community safe while preserving member dignity. Content editors need to publish trusted material. Analysts need first-party outcome and funnel visibility without broad access to sensitive member content.

### 2.2 Evidence status

**Live now — directional evidence**

- The existing WordPress/BuddyBoss environment and static marketing work establish demand hypotheses, content inventory, account/content migration inputs, and brand expectations.
- Existing marketing positioning emphasizes belonging, anonymity, peer support, ages 16+, and browser access.
- These inputs are not validated evidence of retention, safety efficacy, or willingness to pay.

**Target — evidence to collect**

- Qualitative usability studies with members aged 16+, including anonymous sharing, circle discovery, and Ava consent comprehension.
- Migration inventory: users, posts, comments, groups, media, blog content, donation records, and legal consent provenance.
- Baseline funnel and cohort metrics after first-party event collection is operational.
- Moderation operations review covering flag quality, response ownership, and sensitive-data handling.

### 2.3 Product hypothesis

If people can enter a warm, understandable peer-support space, control whether a contribution displays their public identity, discover relevant circles, and connect privately only after mutual connection, then more people will make a meaningful first contribution and return without increasing unacceptable safety or privacy risk.

### 2.4 Success guardrails

Success is not raw time-on-site or message volume. Growth must not come at the expense of member control, understandable anonymity, safe moderation, accessibility, or clarity that NotOnlyHere and Ava are not therapy.

## 3. Personas and jobs to be done

### P-01: Cautious newcomer

- **Context:** Age 16+, arrives from the marketing website, uncertain about public sharing.
- **JTBD:** “Help me understand the community and participate without exposing more identity than I intend.”
- **Needs:** Clear registration and consent, safe defaults, anonymous option explanation, circle previews, visible support resources.
- **Failure:** Accidentally identifiable anonymous content, hidden audience settings, pressure to post.

### P-02: Returning community member

- **Context:** Has connections and circles; uses phone or desktop browser.
- **JTBD:** “Help me catch up, contribute, and have supportive one-to-one conversations.”
- **Needs:** Relevant/chronological feed, notifications, search, reliable message history, blocks.
- **Failure:** Lost drafts, duplicate actions, blocked-user contact, inaccessible mobile layouts.

### P-03: Private self-reflector

- **Context:** Wants light personal tracking without social exposure.
- **JTBD:** “Let me note how I feel and see a private trend without gamification.”
- **Needs:** Mood 1–5, optional note, private 7/30-day trends.
- **Failure:** Mood data appears socially, streak pressure, reminders, export leakage.

### P-04: Circle Admin

- **Context:** Member responsible for one or more circles.
- **JTBD:** “Help me welcome and manage members and keep my circle useful.”
- **Needs:** Approval queue where applicable, invitations, member list, post removal, member mute.
- **Failure:** Global moderation powers, unclear action scope, accidental removal.

### P-05: Global Moderator

- **Context:** Handles limited safety alerts and platform conduct.
- **JTBD:** “Show me actionable context and let me intervene proportionately with accountability.”
- **Needs:** AI-flagged safety alerts, user/circle lookup, suspend/ban controls where authorized, audit trail.
- **Failure:** AI auto-enforcement, anonymous identity shown unnecessarily, a user-report queue that the product does not support.

### P-06: Content Editor

- **JTBD:** “Publish and schedule useful blog and resource content without user-administration access.”
- **Needs:** Blog CRUD, schedule/publish, resource management if permitted by the final RBAC matrix.

### P-07: Analyst

- **JTBD:** “Understand acquisition, activation, retention, and community participation using minimized first-party data.”
- **Needs:** KPI dashboard, funnel, CSV export, aggregate access.
- **Failure:** Access to private messages, mood notes, Ava history, or anonymity mappings.

### P-08: Super Admin

- **JTBD:** “Operate users, roles, circles, content, donations, and audits safely.”
- **Needs:** RBAC, role assignment, account actions, circle decisions, payment visibility, audit log.
- **Failure:** Unlogged privilege changes, accidental impersonation, secrets or full payment data exposure.

## 4. Goals and non-goals

### 4.1 Product goals

- G-01: Enable verified members aged 16+ to register, establish a profile, and safely enter the community.
- G-02: Make a first meaningful action—post, comment, react, connect, or join a circle—easy to understand and measure.
- G-03: Support public-identity and anonymous contributions with accurate audience and identity previews.
- G-04: Provide smaller circle spaces with simple, explicit governance.
- G-05: Enable mutual-connection-only private text messaging.
- G-06: Offer Ava as a consent-based non-clinical conversational companion with private deletable history and clear limits.
- G-07: Equip authorized staff with accountable administration, content operations, payment visibility, and aggregate analytics.
- G-08: Meet WCAG 2.2 AA across member and admin experiences; details are canonical in `02-ux-spec.md`.
- G-09: Migrate only supportable, legally usable WordPress/BuddyBoss data with reconciliation and rollback.

### 4.2 Non-goals and explicit exclusions

The following are **Excluded** from the Target unless a future approved PRD changes scope:

- Native/mobile apps, app download pages, app-store badges, and install prompts.
- TOTP/2FA in the initial product; admin impersonation is P2.
- Profile visibility/privacy settings, per-channel notification preferences, verification badges.
- Feed content-warning UI, mentions, hashtags, pinning, and user report-post.
- Consistent anonymous pseudonyms across contributions and AI toxicity scanning.
- Circle Moderator role, featured-circle member experience, and any circle-to-event linkage.
- DM read receipts, typing indicators, image/file attachments, in-DM block control, report-message, group chat, and voice notes.
- Automated crisis detection, classification, escalation, content summarization, journal prompts, and admin AI configuration.
- Notification digests, web push, mute-thread, and notification preference center.
- In-product blog SEO metadata controls and blog author profile links.
- Mood streaks, reminders, and module-level CSV/PDF export. A legally required account-wide GDPR export remains part of account rights and may include the member's wellness data.
- Journaling in all forms.
- Event virtual meeting links, recurrence, and circle association.
- Dedicated user-report moderation queue, feature flags, circle health metrics, and moderation analytics.
- Course builder, module ordering, quizzes, downloadable-PDF lesson type, and certificates.
- Subscription pricing plans or a paywall for core community.
- Third-party product analytics and product-document claims for Sentry or PostHog.

## 5. Release boundaries

### 5.1 Live now boundary

The static marketing website is already designed and remains separately owned. Its implementation is not part of this product release. Integration contracts are:

- `/login` and `/register` enter the web application.
- Public blog listing/post URLs may be rendered by or federated to the static site; the authenticated admin owns blog content operations.
- Donation CTAs enter a Stripe-backed donation flow and return to a safe marketing or app confirmation URL.
- Public SEO, marketing navigation, app-download removal, and public marketing page design stay with the static-site owner.
- Authentication, authorization, member content, app navigation, member blog consumption when applicable, and admin operations belong to this Target.

### 5.2 Target P0 release

P0 includes authentication, profiles and block/connections, feed, anonymity, circles, 1:1 messaging, Ava, notifications/email events, blogs, mood check-ins, standalone events, resources and one-time access, donations visibility, admin/RBAC/audit, first-party analytics, accessibility, safety disclosures, and migration readiness. P0 does not mean every metric target is a hard gate; metric labels below distinguish references from blockers.

### 5.3 P1

- Product improvements based on measured onboarding, discovery, and moderation outcomes.
- Operational tooling refinements that do not change excluded scope.
- Additional supported resource media presentation within the defined article/video/worksheet model.

### 5.4 P2

- Admin impersonation, only after privacy review, prominent session indication, reason capture, audit logging, and technical specification.

## 6. Roles and authorization

| Capability | Member | Circle Admin | Moderator | Content Editor | Analyst | Super Admin |
|---|---:|---:|---:|---:|---:|---:|
| Use member app | Yes | Yes | If member account | If member account | If member account | If member account |
| Manage assigned circle membership/content | No | Yes | Platform policy only | No | No | Yes |
| View AI moderation-assist alerts | No | No | Yes | No | No | Yes |
| Suspend/ban users | No | No | As policy grants | No | No | Yes |
| Assign global roles | No | No | No | No | No | Yes |
| Manage blogs | No | No | No | Yes | No | Yes |
| View donations | Own receipt only | Own receipt only | No | No | Aggregate if granted | Yes |
| View aggregate analytics/export | Own data only | Circle member list only | Limited operations | Content scope if granted | Yes | Yes |
| View audit log | No | No | Own admin actions only if provided | Own actions only if provided | No | Yes |
| Resolve circle applications | No | Assigned circle | No | No | No | Yes |

**Target:** Global roles are Super Admin, Moderator, Content Editor, Analyst. Circle Admin is a scoped circle membership role, not a global role. No Circle Moderator exists. Exact permission constants and API authorization belong in `03-tech-design.md`; data relationships belong in `04-backend-schema.md`.

## 7. Functional requirements

Acceptance criteria are intentionally concise. Detailed states and interactions are in `02-ux-spec.md`.

### 7.1 Authentication and sessions

**AUTH-01 — Register with email/password — P0, Target**  
The product shall let a person aged 16+ register with email/password after accepting Terms and Community Guidelines.

- Given an unregistered valid email and available username, when required fields, age confirmation, and legal acceptance are submitted, then create an unverified account and send a verification email.
- Given age confirmation is absent, when registration is submitted, then block creation with an accessible field error.

**AUTH-02 — OAuth registration/login — P0, Target**  
Support Google and Apple OAuth while preserving age and legal consent requirements.

- Given a first-time OAuth identity, when provider authentication succeeds, then require missing username, age confirmation, and legal acceptance before activation.
- Given an existing linked identity, when OAuth succeeds, then start a session without duplicate account creation.

**AUTH-03 — Email verification — P0, Target**

- Given a valid unused verification link, when opened, then verify the account and route to the intended safe app destination.
- Given an expired or used link, when opened, then show a non-technical error and offer resend.

**AUTH-04 — Login and generic errors — P0, Target**

- Given valid credentials for an active verified account, when submitted, then create a session and redirect to the sanitized intended route or feed.
- Given invalid credentials or unknown email, then show the same generic error to prevent account enumeration.

**AUTH-05 — Password reset — P0, Target**

- Given any submitted email, when reset is requested, then show the same confirmation and send a time-limited link only if eligible.
- Given a valid reset token and conforming new password, then invalidate the token and relevant existing sessions according to the session policy.

**AUTH-06 — Session management — P0, Target**

- Given an authenticated member, when viewing sessions, then show current and other sessions with device/browser approximation and last activity.
- Given a member revokes another session, then that session can no longer access protected endpoints.

**AUTH-07 — Logout — P0, Target**

- Given an active session, when logout is confirmed, then invalidate it and return to the login boundary without exposing cached protected content.

**AUTH-08 — Account enforcement — P0, Target**

- Given a suspended or banned account, when login or protected access occurs, then deny access with the approved status explanation and support path.

**AUTH-09 — No TOTP/2FA — Excluded**

- Given account/security settings, then no TOTP enrollment, recovery-code, or 2FA claims are displayed.

### 7.2 Profiles, connections, activity, and blocking

**PROF-01 — Profile identity — P0, Target**  
Profiles contain avatar, cover, display name, unique username, bio, and join date.

- Given an authenticated member edits allowed fields, when valid changes are saved, then the updated profile is visible without exposing private account fields.

**PROF-02 — Media update — P0, Target**

- Given a supported avatar or cover image, when upload completes, then show crop/preview and persist only after confirmation.
- Given an invalid or oversized file, then reject it before save with format/size guidance.

**PROF-03 — Member activity — P0, Target**

- Given a profile visitor can access a member’s non-anonymous activity, when activity loads, then show eligible posts/comments without exposing only-me, restricted, deleted, blocked, or anonymous identity mappings.

**PROF-04 — Connection lifecycle — P0, Target**

- Given two unblocked members, when one sends a connection request, then the recipient can accept or decline and duplicates are prevented.
- Given an accepted connection, then both may initiate 1:1 messaging.

**PROF-05 — Remove connection — P0, Target**

- Given connected members, when either removes the connection, then future DM sending is disabled while retained history follows policy.

**PROF-06 — Account block — P0, Target**

- Given member A blocks member B, then B cannot initiate or continue DM with A and both are hidden from each other where policy requires.
- Given a block action, then it is not exposed to the blocked member as a notification.

**PROF-07 — Anonymous persona presentation — P0, Target**

- Given an anonymous contribution, then no member profile link, avatar, username, or connection action is rendered.

**PROF-08 — No profile privacy controls — Excluded**

- Given profile settings, then do not offer profile visibility/privacy settings or a verification badge.

### 7.3 Feed, posts, comments, reactions, and search

**FEED-01 — Feed modes — P0, Target**

- Given an authenticated member, when choosing Relevant or Chronological, then eligible posts are returned in the selected deterministic mode and the choice remains active during the current browser session. No server-side preference profile is implied.

**FEED-02 — Create post — P0, Target**

- Given valid text and zero to four supported images, when posted, then create one post with the selected identity and visibility.
- Given more than four images or no meaningful content, then block submission with inline guidance.

**FEED-03 — Link preview — P0, Target**

- Given a post contains an eligible URL, when preview retrieval succeeds, then show an editable/removable preview before publishing.
- Given retrieval fails or is unsafe, then retain the plain link without blocking the post.

**FEED-04 — Visibility — P0, Target**  
Visibility options are public, members, connections, and only-me.

- Given a viewer, when requesting a post, then return it only if viewer and context satisfy its visibility and block rules.
- Given “public,” then public-web rendering remains an explicit integration decision; it must not silently publish through the static site.

**FEED-05 — Cursor pagination — P0, Target**

- Given more eligible posts, when the scroll threshold or “Load more” fallback is activated, then append the next cursor page without duplicates or reorder of already rendered items.

**FEED-06 — One-level comments — P0, Target**

- Given an eligible post, when a member comments, then create a top-level comment or a reply visually associated one level deep.
- Given a reply to a reply, then store/render it at the single reply level rather than nesting further.

**FEED-07 — Reactions — P0, Target**

- Given an eligible post or comment, when a member selects Support, Hug, or Insightful, then apply at most one current reaction per member per target and allow change/removal.

**FEED-08 — Edit window — P0, Target**

- Given the author is within 15 minutes of creation, when editing valid post/comment text, then save and display an “Edited” indicator.
- Given the window has expired, then editing is unavailable and the API rejects stale attempts.

**FEED-09 — Soft delete — P0, Target**

- Given an author confirms deletion, then soft-delete the post/comment, remove normal content presentation, and preserve only policy-required records.

**FEED-10 — Search and filters — P0, Target**

- Given a query and filters, when searching, then return only eligible posts visible to the requester with cursor pagination.
- Filters include relevant product-supported scopes such as author identity mode, circle context where applicable, date range, or media; exact controls are defined in `02-ux-spec.md`.

**FEED-11 — Circle posts — P0, Target**

- Given an eligible circle member, when posting in a circle, then the post is associated with that circle and follows circle access in addition to post visibility.

**FEED-12 — Explicitly absent feed capabilities — Excluded**

- No content-warning UI, mentions, hashtags, post pinning, or user report-post action is rendered or promised.

### 7.4 Anonymous participation

**ANON-01 — Per-contribution toggle — P0, Target**

- Given an eligible post or comment composer, when anonymous is selected, then preview the generated pseudonym and explain admin traceability before submission.

**ANON-02 — Generated pseudonym — P0, Target**

- Given an anonymous contribution, then display a system-generated pseudonym for that contribution without promising consistency across contributions.

**ANON-03 — Admin traceability — P0, Target**

- Given an authorized safety need and permitted role, when identity mapping is revealed, then require reason/context and record an audit event.
- Given an ordinary member or Circle Admin, then the underlying identity is never returned.

**ANON-04 — Circle anonymity — P0, Target**

- Given a circle permits the member to post/comment, when anonymous is selected, then the same anonymous protections and circle access restrictions apply.

**ANON-05 — Daily rate limit — P0, Target**

- Given a member has created fewer than 10 anonymous posts/comments in the applicable day window, then allow the next eligible contribution.
- Given the limit of 10 is reached, then block further anonymous contributions, show reset timing, and still allow identified contributions.

**ANON-06 — No profile or DM — P0, Target**

- Given anonymous attribution, then no profile link or DM action exists.
- Given an underlying account, anonymity does not create a second account or bypass blocks/enforcement.

**ANON-07 — Excluded automation/identity continuity — Excluded**

- The product does not promise a consistent pseudonym and does not run an AI toxicity scan as part of anonymous posting.

### 7.5 Circles

**CIRC-01 — Circle directory — P0, Target**

- Given an authenticated member, when browsing/searching, then show eligible public/private circles and hide hidden circles unless invited or otherwise authorized.

**CIRC-02 — Circle detail — P0, Target**

- Given an eligible visitor, then show purpose, visibility/access type, member count, Circle Admins, member status, and permitted preview content.

**CIRC-03 — Access types — P0, Target**  
Join policy supports open, approval, and private.

- Given an open circle, when an eligible member joins, then membership becomes active immediately.
- Given approval, when join is requested, then status is pending until Circle Admin decision.
- Given private, then joining requires an invitation or explicit authorized path.

**CIRC-04 — Leave circle — P0, Target**

- Given a member leaves, then future member-only access ends while authored content follows retention policy.
- Given the last Circle Admin attempts to leave, then require ownership transfer or Super Admin action.

**CIRC-05 — Member-created circle — P0, Target**

- Given an eligible member submits valid circle details, then create it directly or place it in global approval according to current operational policy, with status shown.

**CIRC-06 — Visibility — P0, Target**  
Circle visibility is public, private, or hidden; join policy is a separate concept.

- Given hidden visibility, then exclude the circle from directory and ordinary search.

**CIRC-07 — Invitations — P0, Target**

- Given a Circle Admin invites an eligible member, then create one actionable notification with accept/decline and expiry handling.

**CIRC-08 — Circle feed — P0, Target**

- Given an active member, then show eligible circle posts with the feed capabilities defined above.

**CIRC-09 — Member list — P0, Target**

- Given permitted circle access, then show members and Circle Admin labels without revealing hidden account fields or anonymous mappings.

**CIRC-10 — Circle Admin post removal — P0, Target**

- Given a post in an administered circle, when Circle Admin confirms removal with a reason, then remove it from circle presentation and audit the action.

**CIRC-11 — Circle Admin mute — P0, Target**

- Given an active circle member, when a Circle Admin applies a scoped time-bound or policy-defined mute, then prevent that member from posting/commenting in that circle and show the affected member an explanation.

**CIRC-12 — Global administration — P0, Target**

- Given a pending circle or existing circle, then authorized global admins can approve, feature for administrative curation, or archive it.
- “Feature” is an admin state/control only; no featured-circle member discovery module is in scope.

**CIRC-13 — No circle-event linkage — Excluded/resolved**

- Events are standalone. No event can be associated with a circle in P0, because the prior circle-link proposal was struck.

### 7.6 Messaging

**MSG-01 — Connection-only 1:1 conversation — P0, Target**

- Given mutually connected, unblocked members, when either starts a conversation, then open or create the unique 1:1 thread.
- Given they are not connected or a block exists, then deny thread creation and message sending.

**MSG-02 — Near-real-time text delivery — P0, Target**

- Given both participants are online and authorized, when a text message is accepted, then it appears without manual refresh under normal network conditions.
- Given real-time transport fails, then reconnect or refresh history without duplicate messages.

**MSG-03 — Paginated history — P0, Target**

- Given a conversation with older messages, when loading history, then prepend the next cursor page while preserving reading position.

**MSG-04 — Search history — P0, Target**

- Given a query, when searching messages, then return only the requester’s eligible 1:1 message matches and support navigation to context.

**MSG-05 — Emoji reactions — P0, Target**

- Given a message in an eligible conversation, when a participant adds/removes an emoji reaction, then synchronize it to both participants.

**MSG-06 — General block enforcement — P0, Target**

- Given either participant blocks the other through profile policy, then new sends are disabled promptly; no separate in-DM block control is shown.

**MSG-07 — Explicit exclusions — Excluded**

- No read receipts, typing indicator, images/files, in-DM blocking control, report-message, group chat, or voice notes.

### 7.7 Ava and AI-assisted safety

**AVA-01 — Logged-in Ava chat — P0, Target**

- Given an authenticated consenting member, when sending text to Ava within quota, then return a response clearly presented as AI-generated.

**AVA-02 — First-use informed consent — P0, Target**

- Given no active Ava consent record, when opening Ava, then explain purpose, limitations, data handling, personalization, deletion, provider boundaries, and static crisis resources before chat is enabled.
- Given consent is declined, then do not enable chat or personalization and preserve access to static crisis resources.

**AVA-03 — Not-a-therapist disclosure — P0, Release blocker**

- Given any Ava entry or active conversation, then prominently state: “Ava is an AI companion, not a therapist or emergency service.”

**AVA-04 — Static crisis resources; no automated escalation — P0, Release blocker**

- Given Ava or relevant help surfaces, then provide static, localized-when-available crisis-resource links and emergency guidance.
- Given any user message, then the product does not claim or perform automated crisis classification, detection, outreach, or escalation.

**AVA-05 — Conversation starters — P0, Target**

- Given an empty/new Ava conversation, then show optional non-clinical starters that do not imply diagnosis or journaling.

**AVA-06 — Daily quota — P0, Target**

- Given fewer than 50 accepted member messages in the UTC calendar day, allow eligible sends. OQ-04 may change this before API freeze only through a coordinated update to all six documents.
- Given 50 is reached, block additional sends, preserve history, show reset timing, and keep crisis resources available.

**AVA-07 — Private deletable history — P0, Target**

- Given a member, when viewing Ava history, then only that member can access it outside narrowly authorized operations.
- Given deletion is confirmed, then remove it from member access and execute the disclosed retention/deletion policy.

**AVA-08 — Provider training prohibition — P0, Release blocker**

- Given Ava content is sent to the AI provider, then contractual/configuration controls must ensure it is not used for provider model training, as specified in `03-tech-design.md`.

**AVA-09 — Voluntary personalization — P0, Target**

- Given explicit separate consent, when a member voluntarily supplies personality/preferences, then Ava may use them to shape companion behavior.
- Given consent is withdrawn, then stop using saved personalization and offer deletion without disabling non-personalized Ava use.

**AVA-10 — Circle recommendations — P0, Target**

- Given explicit opt-in, Ava may recommend eligible circles with an explanation and without auto-joining.
- Given no opt-in, Ava does not use conversation content to recommend circles.

**AVA-11 — AI moderation assist — P0, Target**

- Given content meets configured safety flag criteria, then create a limited safety alert for human review.
- Given a flag, then AI alone cannot remove content, suspend, ban, notify authorities, or reveal anonymous identity.

**AVA-12 — Explicit AI exclusions — Excluded**

- No automated crisis detection, content summarization, journal prompts, AI toxicity scan, or admin AI configuration.

### 7.8 Notifications and email

**NOTIF-01 — In-app notification center — P0, Target**

- Given an authenticated member, when an eligible event occurs, then create a deduplicated notification that links to an authorized destination.
- Given the center is opened, then support unread/read state and cursor pagination.

**NOTIF-02 — Event-triggered email — P0, Target**  
Eligible event families: comment, reaction, connection, DM, circle invite, and admin action.

- Given an eligible event and deliverable verified email, then enqueue the corresponding transactional email.
- Given the destination is no longer authorized, then links route to a safe fallback.

**NOTIF-03 — Admin broadcast — P0, Target**

- Given an authorized admin drafts a broadcast, then require audience summary, preview, and explicit confirmation before in-app delivery and any approved email delivery.

**NOTIF-04 — No preference center — Excluded**

- No digests, web push, mute-thread, per-channel controls, or notification preference center. Legally required email controls remain available where applicable; essential account/safety mail cannot be mislabeled as marketing.

### 7.9 Blog

**BLOG-01 — Listing and post — P0, Target**

- Given a published post, when an eligible visitor opens listing or canonical post URL, then show title, content, publication date, category, tags, and appropriate image.

**BLOG-02 — Categories, tags, related — P0, Target**

- Given category/tag selection, then filter published posts.
- Given a post, then show deterministic related published posts without author-profile links.

**BLOG-03 — RSS — P0, Target**

- Given published posts, then expose a valid RSS feed containing canonical public URLs and no drafts/scheduled content.

**BLOG-04 — Admin CRUD and schedule — P0, Target**

- Given an authorized Content Editor or Super Admin, when creating/editing a draft, then save without public visibility.
- Given a valid future schedule, then publish at the intended time zone instant; authorized users can cancel/reschedule.

**BLOG-05 — Marketing SEO ownership — Live now/Target boundary**

- The static site owns public SEO. The product admin does not include SEO metadata management and blog posts do not link to author member profiles.

### 7.10 Wellness mood check-in

**MOOD-01 — Daily mood — P0, Target**

- Given an authenticated member, when selecting mood 1–5 and optional note, then save at most one current daily check-in under the defined local-day policy and permit same-day update.

**MOOD-02 — Private trends — P0, Target**

- Given a member, when selecting 7 or 30 days, then show only that member’s mood values and aggregate trend with missing days represented honestly.

**MOOD-03 — Privacy — P0, Release blocker**

- Given any other member, circle admin, or Analyst, then no individual mood rating or note is accessible.

**MOOD-04 — Explicit exclusions — Excluded**

- No streak, reminder, export, social sharing, or journaling behavior.

### 7.11 Standalone events

**EVT-01 — Create event — P0, Target**

- Given an authorized event creator under policy, when valid title, description, location text if applicable, start/end, and time zone are submitted, then create a standalone event.

**EVT-02 — RSVP — P0, Target**

- Given an eligible member, when selecting Going, Maybe, or Not going, then persist one current RSVP and update aggregate counts.

**EVT-03 — Calendar views — P0, Target**

- Given an authenticated member, when switching Month/List, then show the same eligible events in date-appropriate layouts and preserve filters.

**EVT-04 — Email reminders — P0, Target**

- Given an event has not been canceled and a member is Going or Maybe according to policy, then send idempotent reminders approximately 24 hours and 1 hour before start.

**EVT-05 — Event boundaries — P0/Excluded**

- Events have no recurring rule, virtual meeting-link field, or circle association.

### 7.12 Resources and learning access

**RES-01 — Searchable library — P0, Target**

- Given an authenticated member, when querying/filtering, then return eligible articles, videos, and worksheets with cursor pagination.

**RES-02 — Access types — P0, Target**  
Each item is free, members-only, or one-time-paid.

- Given a free item at a permitted boundary, then access without payment as configured.
- Given members-only, then require authentication but no subscription.
- Given one-time-paid without entitlement, then show price and Stripe checkout; after confirmed payment, grant that member durable access subject to refund policy.

**RES-03 — Basic progress — P0, Target**

- Given an entitled member, when opening/completing an item, then store simple per-user started/completed progress and show it privately.

**RES-04 — Resource boundaries — Excluded**

- No course builder, module ordering, quizzes, downloadable-PDF lesson type, or certificates. “Worksheet” is a presented resource type, not a promise of a downloadable PDF.

### 7.13 Donations

**DON-01 — One-time and monthly donation — P0, Target**

- Given a donor selects one-time or monthly and enters a valid amount, when Stripe checkout succeeds, then show a safe confirmation and send a receipt through approved channels.

**DON-02 — Webhook authority — P0, Target**

- Given client return state conflicts with verified Stripe state, then Stripe-verified server state controls donation status and idempotent updates.

**DON-03 — Admin visibility — P0, Target**

- Given an authorized Super Admin, then show donor reference, amount, cadence, status, and timestamps while masking unnecessary payment data.

**DON-04 — No core paywall — P0, Release blocker**

- Donation state never grants superior core-community access, and there are no subscription pricing plans. Only individual resource items may use one-time payment.

## 8. Admin panel requirements

### 8.1 Dashboard

**ADM-01 — KPI dashboard — P0, Target**

- Given an authorized admin, when opening the dashboard, then show role-permitted KPI cards, recent administrative activity, limited safety alerts, and quick actions with metric windows labeled.

**ADM-02 — Recent activity — P0, Target**

- Recent activity shows administrative and operational events, not raw private messages, Ava conversations, or mood notes.

### 8.2 Users and roles

**ADM-03 — User search/view — P0, Target**

- Given permitted staff, when searching by approved identifiers/status, then show paginated minimized results and a role-appropriate account view.

**ADM-04 — Suspend/ban — P0, Target**

- Given an authorized actor enters reason and confirms, when suspending or banning, then enforce status, record actor/reason/time, and notify the member through approved channels.

**ADM-05 — Role assignment — P0, Target**

- Given a Super Admin, when changing a global role, then show permission impact, require confirmation, prevent removal of the last Super Admin, and audit old/new values.

**ADM-06 — Impersonation — P2**

- No P0/P1 impersonation control is rendered.

### 8.3 Circles and content

**ADM-07 — Circle approval/archive/feature — P0, Target**

- Given an authorized admin, when approving, featuring administratively, or archiving, then show impact, require reason for destructive state changes, and audit it.

**ADM-08 — Blog operations — P0, Target**

- Content Editor and Super Admin can create, preview, edit, publish, schedule, unpublish, and archive according to RBAC.

**ADM-09 — Limited safety alerts — P0, Target**

- Given AI flags content, then Moderators/Super Admins may see a limited alert list with content context, model-generated rationale labeled as non-authoritative, and human action controls.
- This is not a user-report queue; users cannot report posts/messages through the excluded capabilities.

### 8.4 Payments, audit, and analytics

**ADM-10 — Donation visibility — P0, Target**

- Show Stripe-derived one-time/monthly donation status and allow safe filtering/export only where approved; never show full card details.

**ADM-11 — Audit log — P0, Release blocker**

- Given a privileged mutation or anonymous identity reveal, then record immutable actor, action, target, reason where required, timestamp, and safe metadata.
- Given an authorized Super Admin, then filter and inspect logs; no admin can edit them through the product.

**ADM-12 — RBAC enforcement — P0, Release blocker**

- Given any admin route/action, then server authorization—not navigation visibility—controls access and returns a safe denial.

**ADM-13 — Analytics dashboard/CSV — P0, Target**

- Given Analyst or Super Admin permission, then show approved aggregate metrics and allow a CSV export with filters/window, generation time, and metric definitions.

**ADM-14 — Excluded admin capabilities — Excluded**

- No dedicated user-report moderation queue, admin AI configuration, feature-flag UI, or admin circle-health/moderation metrics.

## 9. Cross-cutting safety, privacy, and quality

### 9.1 Peer-support and crisis boundaries

**SAFE-01 — Product disclosure — P0, Release blocker**  
Member onboarding, Ava, and persistent help access must state that NotOnlyHere is peer support, not professional mental-health care or emergency service.

**SAFE-02 — Static resources — P0, Release blocker**  
Provide static crisis resources appropriate to supported locales, including instruction to contact local emergency services. Resources must remain reachable when Ava quota is exhausted or consent is declined.

**SAFE-03 — No crisis automation — P0, Release blocker**  
No claim, UI, event name, model behavior, or operating procedure may imply automated crisis detection, classification, escalation, or emergency outreach.

### 9.2 Privacy

**PRIV-01 — Data minimization — P0**  
Collect and expose only data needed for stated functions. Avoid sensitive content in logs, analytics payloads, URLs, notification previews, email subjects, and admin recent activity.

**PRIV-02 — Sensitive domains — P0**  
Treat private messages, Ava conversations/preferences, mood values/notes, anonymous mappings, blocks, enforcement reasons, and payment identifiers as sensitive with explicit access boundaries.

**PRIV-03 — Delete semantics — P0**  
Member-visible deletion and legal/operational retention must be stated accurately. “Delete” must not promise immediate physical erasure where backups, fraud, audit, or legal retention applies.

**PRIV-04 — AI data use — P0, Release blocker**  
Disclose what Ava data is sent to OpenAI, prohibit provider training, minimize payload, and do not use Ava content for circle recommendations without opt-in.

**PRIV-05 — Minor-aware design — P0**  
Minimum age is 16. Copy, safety paths, consent, and data handling must not assume every member is an adult. The product does not target children under 16.

### 9.3 Accessibility and responsive quality

**A11Y-01 — WCAG — P0, Release blocker**  
Member application and admin panel conform to WCAG 2.2 AA for supported flows. Screen behavior is in `02-ux-spec.md`; acceptance methods are in `06-testing-plan.md`.

**A11Y-02 — Browser responsiveness — P0**  
All P0 capabilities work in supported phone, tablet, and desktop browsers; “web-only” does not mean desktop-only.

### 9.4 Reliability and integrity

**QUAL-01 — Idempotency — P0**  
Payments, reminders, broadcasts, notification creation, and retry-prone mutations must not produce harmful duplicates.

**QUAL-02 — Authorization consistency — P0**  
Search indexes/results, real-time events, direct routes, exports, and emails obey current visibility, block, circle, and role rules.

**QUAL-03 — Time semantics — P0**  
Display member-local time with timezone labels where ambiguity matters. Persist canonical instants. Day windows for anonymous/Ava limits and mood check-ins are defined in `03-tech-design.md` and `04-backend-schema.md`.

## 10. Analytics and success measures

### 10.1 Measurement rules

- Use first-party events plus authoritative PostgreSQL business records. No third-party product analytics.
- Every dashboard metric shows definition, date window, timezone, last-updated time, and applicable exclusions.
- Events must not contain post/comment/message/Ava/mood-note body text.
- Internal/admin/test accounts and known bots are excluded where identified.
- Metric targets below marked **Reference signal** guide learning and do not alone block release.
- Metrics marked **Release blocker** are pre-release validation conditions, not growth outcomes.

### 10.2 Core metric definitions

| ID | Metric and formula | Source | Window | Label |
|---|---|---|---|---|
| MET-01 | DAU = distinct eligible member IDs with ≥1 qualifying app activity in calendar day | First-party activity events, account status | Daily UTC plus selected reporting TZ | Reference signal |
| MET-02 | MAU = distinct eligible member IDs with ≥1 qualifying app activity in trailing 30 days | Same as MET-01 | Trailing 30 days | Reference signal |
| MET-03 | DAU/MAU stickiness = DAU ÷ MAU for same end date | MET-01/02 | Daily | Reference signal |
| MET-04 | Signups = distinct activated accounts with `activated_at` in window | Account records | Daily/weekly/monthly | Reference signal |
| MET-05 | D1 retention = activated members in cohort active on cohort date+1 ÷ activated cohort | Accounts + activity events | Cohort day, mature after D1 | Reference signal |
| MET-06 | D7 retention = activated members active on days 6–8 ÷ activated cohort | Accounts + activity events | Weekly cohorts | Reference signal |
| MET-07 | D30 retention = activated members active on days 27–33 ÷ activated cohort | Accounts + activity events | Monthly cohorts | Reference signal |
| MET-08 | Posts created = count of non-test accepted post creates; report identified/anonymous separately without identity exposure | Post records | Selected window | Reference signal |
| MET-09 | Comments created = count of non-test accepted comments | Comment records | Selected window | Reference signal |
| MET-10 | Reactions created = count of reaction add actions; current reaction inventory is separately labeled | Reaction records/events | Selected window | Reference signal |
| MET-11 | Visit→register = distinct marketing-attributed visitors who activate an account ÷ eligible distinct visitors | First-party boundary event + accounts | 7-day attribution, reported weekly | Reference signal |
| MET-12 | Register→first post = activated members creating first post within 7 days ÷ activated members | Accounts + posts | 7-day maturation | Reference signal |
| MET-13 | First post→join circle = first-time posters joining a circle within 7 days after first post ÷ first-time posters | Posts + memberships | 7-day maturation | Reference signal |
| MET-14 | Full funnel completion = eligible visitors who register, first-post, and join a circle in order within 14 days ÷ eligible visitors | First-party events + records | 14-day attribution | Reference signal |
| MET-15 | Analytics event privacy = 0 sampled analytics events containing prohibited content bodies or raw sensitive notes | Event payload audit | Before release and each schema change | **Release blocker** |
| MET-16 | RBAC negative-path pass rate = 100% of release authorization test matrix | Automated/manual verification | Release candidate | **Release blocker** |
| MET-17 | Critical accessibility = 0 unresolved critical/serious defects in P0 journeys; all keyboard journeys pass | Accessibility audit | Release candidate | **Release blocker** |
| MET-18 | AI boundary compliance = required disclaimer/static resources visible; no crisis-classification behavior in release test suite | UX/content and behavior tests | Release candidate | **Release blocker** |
| MET-19 | Migration reconciliation = 100% of in-scope entity totals reconciled or documented exception accepted by owner | Migration reports | Cutover rehearsal/final | **Release blocker** |

### 10.3 Qualifying activity

Qualifying app activity includes authenticated page/screen engagement plus accepted meaningful actions defined in the event taxonomy; passive background refresh, email opens, admin activity, health checks, and bot traffic do not qualify. The stable event taxonomy is specified in `03-tech-design.md`; aggregate models and retention-safe event fields are in `04-backend-schema.md`.

### 10.4 Suggested directional targets

These are **Reference signals**, not commitments or release blockers, until baseline data exists:

- ≥60% of activated members complete one meaningful action within 7 days.
- ≥25% of activated members create a first post or comment within 7 days.
- ≥30% join at least one circle within 7 days.
- D7 retention ≥20% after excluding migration-only dormant accounts.
- ≥80% of moderated AI alerts receive a human disposition within the operations target window.

The last signal is operational queue health, not an exposed “moderation metric” in the product analytics dashboard.

## 11. Dependencies

| Dependency | Purpose | Blocking condition |
|---|---|---|
| Static marketing owner | Login/register/blog/donation URLs and first-party attribution boundary | Routes and ownership agreed |
| Legal/privacy review | Terms, Guidelines, age 16+, consent, AI/provider, retention, payments | Approved release copy and policies |
| Safety operations | Static resources, human review procedures, enforcement reasons | Named owners and coverage |
| OpenAI contract/config | Ava responses without provider training | Verified before Ava release |
| Stripe | Donations and one-time resource purchases | Webhooks, reconciliation, refund policy |
| Resend/domain config | Verification, reset, event emails, reminders | Deliverability/authentication checks |
| S3/R2 policy | Profile/feed media | Type, size, access, deletion policy |
| WordPress/BuddyBoss access | Export and migration rehearsal | Complete inventory and legal provenance |
| Companion specifications | Architecture/data/API/delivery | Cross-document review complete |

No monitoring-vendor dependency is asserted in this product document.

## 12. WordPress/BuddyBoss migration

### 12.1 Principles

- **Transition:** Existing WordPress/BuddyBoss is a migration source, not the Target runtime.
- Preserve source identifiers in a restricted mapping table for reconciliation and rollback.
- Import only in-scope data with adequate ownership, consent, and status provenance.
- Never infer verified email, age confirmation, legal acceptance, anonymity consent, or Ava consent when source evidence is absent.
- Re-run migrations idempotently in rehearsals; produce counts, rejects, transformations, and media failures.
- Freeze or delta-sync behavior must be decided before cutover.

### 12.2 Candidate mapping

| Source | Target disposition |
|---|---|
| WordPress users | Import eligible account/profile fields; require password reset if hashes cannot safely migrate; require missing age/legal consent |
| BuddyBoss profiles | Map supported avatar, cover, display name, username, bio, join date; discard unsupported privacy/badge fields |
| Activity posts/comments | Import only compatible text/media and visibility that can be mapped safely; quarantine ambiguous visibility |
| Reactions | Map only where semantics safely correspond; otherwise retain aggregate archive outside product or omit with approval |
| Groups | Candidate circles; map membership/admin/access after owner review; no moderator role mapping without explicit conversion |
| Private messages | Default to no import until privacy, participant, block, and retention review approves a tested path |
| Blog posts/taxonomy | Import publish status, schedule, categories/tags, content/media; static site remains SEO owner |
| Events | Import only standalone, non-recurring events with valid times; remove circle linkage and unsupported virtual fields |
| Media | Copy supported assets to Target storage with checksums, access control, and broken-link report |
| Donation history | Stripe remains payment authority; do not synthesize subscriptions or core entitlements |

### 12.3 Migration acceptance

- Two successful production-scale rehearsals with documented duration.
- Counts reconcile by entity and status; every discrepancy has disposition.
- Sampled permissions, anonymous identity protection, blocks, media, dates, and authorship pass.
- Redirect or compatibility plan exists for retained public blog URLs.
- Rollback point, source freeze/delta strategy, and owner sign-off are recorded in `05-implementation-plan.md`.

## 13. Risks and mitigations

| Risk | Impact | Mitigation / decision |
|---|---|---|
| Members mistake peer support/Ava for therapy | Safety harm | Prominent disclosures, static crisis resources, non-clinical copy; release blocker tests |
| Anonymous content is re-identified | Privacy/safety harm | No profile links, minimized mapping access, reasoned reveal, audit, strict exports/logging |
| AI flag treated as truth | Unfair enforcement | Label as assistive, human disposition required, no autonomous action |
| Age 16+ creates mixed adult/minor community | Safety/legal complexity | Legal review, minor-aware copy, no under-16 onboarding, operating policy |
| Block/visibility leaks through search/realtime/email | Harassment/privacy | Central authorization rules and negative-path matrix across channels |
| Migration carries unsupported privacy assumptions | Exposure | Quarantine ambiguity, no inferred consent, reconciliation and sampling |
| Email volume surprises users | Trust/deliverability | Only enumerated event emails, dedupe, essential/marketing distinction |
| Resource payment confused with membership | Trust | “One-time access to this item” language; core community remains free |
| Responsive web mistaken for native-app parity | Expectation mismatch | Browser-first copy and tested responsive behavior; no download claims |
| Metric collection captures sensitive text | Privacy breach | Explicit forbidden fields, schema review, MET-15 blocker |
| No user-report tools reduce member escalation paths | Operational gap | Provide general Help/Contact safety path without representing it as report-post/message queue; monitor need |

## 14. Assumptions and open questions

### 14.1 Assumptions

- **Target assumption A-01:** English is the P0 product language; architecture does not prevent localization.
- **Target assumption A-02:** Supported browsers are current and previous major versions of evergreen desktop/mobile browsers, finalized in `02-ux-spec.md` and verified by `06-testing-plan.md`.
- **Target assumption A-03:** Authorized event creation is staff/Super Admin only until OQ-02 is explicitly approved otherwise. Ordinary members can discover and RSVP but cannot create events under the conservative release default.
- **Target assumption A-04:** “Public” feed visibility means authorization category; whether a post is indexable/publicly rendered is separately controlled and defaults to not indexed.
- **Target assumption A-05:** Daily quotas use an explicitly disclosed server-defined window unless the API specification safely supports member-local calendar days.
- **Target assumption A-06:** Circle Admin mute is circle-scoped and does not affect reading or global participation unless policy states otherwise.

### 14.2 Open questions requiring owner decision

| ID | Question | Conservative default if unresolved | Owner / due gate |
|---|---|---|---|
| OQ-01 | Which countries/locales launch first, and which static crisis resources are approved? | Launch only where approved resources/copy exist | Safety/legal before content freeze |
| OQ-02 | Can ordinary members create events, or only staff? | Staff/Super Admin creation only | Product before API freeze |
| OQ-03 | Is “public” post content exposed outside authentication? | No public indexing/rendering; authenticated app access only | Product/legal/static-site owner |
| OQ-04 | What is the anonymous 10/day window and Ava 50/day window? | UTC calendar day with reset time shown | Product/API before build |
| OQ-05 | What duration options and appeal path apply to circle mutes and global suspensions? | Fixed operational presets plus Help/Contact path | Safety operations |
| OQ-06 | Which resource item types can be public “free” versus login-required? | All library discovery in app; explicit public links only | Product/static-site owner |
| OQ-07 | What migrated private-message history, if any, has sufficient consent and integrity? | Do not migrate DMs | Privacy/migration owner |
| OQ-08 | What exact retention applies to deleted Ava history, content, audit records, and payment records? | Minimize and retain only legally/operationally necessary | Legal/privacy before release |

These questions do not reopen resolved exclusions such as circle-linked events, native apps, 2FA, or automated crisis detection.

## 15. Release acceptance checklist

### Scope and integration

- [ ] Authenticated web app and admin panel are production deployable; no native app/download page or claims exist.
- [ ] Static marketing boundaries for login, register, blog, and donation are contract-tested.
- [ ] No core-community subscription plan or paywall exists.
- [ ] Excluded capabilities are absent from UI, API claims, help text, and release communications.

### Identity, privacy, and safety

- [ ] Age 16+, legal acceptance, email verification, OAuth completion, reset, and session revocation pass.
- [ ] Block enforcement passes in profiles, feed, search, circles, DMs, real-time delivery, notifications, and direct URLs.
- [ ] Anonymous UI has identity preview, generated pseudonym, no profile/DM, 10/day enforcement, and audited authorized traceability.
- [ ] Ava requires consent, shows not-therapist disclosure, retains static crisis access, enforces 50/day, supports delete/withdrawal, and is not used for provider training.
- [ ] No automated crisis classification/escalation behavior or claim exists.
- [ ] Mood values/notes, DMs, Ava history, and anonymous mappings are protected from unauthorized roles and analytics.

### Core member functions

- [ ] Feed modes, four images, link preview, visibility, one-level comments, three reactions, search/filter, cursor loading, 15-minute edit, and soft delete pass.
- [ ] Circle access/visibility, join/approval/private flows, invitation, member list, admin removal/mute, and member-created approval policy pass.
- [ ] Connection-only 1:1 text messaging, searchable paginated history, emoji reactions, reconnect, and block behavior pass.
- [ ] Notifications and enumerated event emails are authorized, deduplicated, and deep-link safely.
- [ ] Blogs, RSS, scheduling, mood 7/30 trends, standalone event RSVP/calendar/reminders, resource access/progress, and donation flows pass.

### Admin and operations

- [ ] RBAC negative-path matrix passes with 100% expected denials.
- [ ] User actions, role assignment, circle controls, blog operations, donation visibility, limited AI alerts, audit log, analytics, and CSV meet requirements.
- [ ] No user-report queue, admin AI config, feature flags, circle-health metric, or moderation analytics appears.
- [ ] Privileged actions and anonymous identity reveals are audited and immutable in product UI.

### Quality and launch

- [ ] WCAG 2.2 AA release criteria in `02-ux-spec.md` and `06-testing-plan.md` pass.
- [ ] Phone, tablet, and desktop browser journeys pass supported-browser matrix.
- [ ] First-party event payload audit contains no prohibited sensitive content.
- [ ] Stripe/Resend/OpenAI/storage production controls and failure paths pass.
- [ ] Migration rehearsals, reconciliation, privacy sampling, redirects, and rollback plan are signed off.
- [ ] Open questions are resolved or their conservative defaults are explicitly approved.

## 16. Cross-document traceability

| Product concern | Canonical here | Required companion coverage |
|---|---|---|
| Scope, roles, priorities, exclusions | Sections 1, 4–8 | `02-ux-spec.md` must not invent capabilities; `05-implementation-plan.md` sequences them |
| Screens, flows, states, responsive/a11y | Requirement IDs + SAFE/A11Y | `02-ux-spec.md` |
| Runtime topology, service boundaries, security | Technology decision and cross-cutting requirements | `03-tech-design.md` |
| Entities, retention, sensitive fields, migration mappings | Requirements and privacy rules | `04-backend-schema.md` |
| Routes/contracts/events/errors/quotas | Acceptance criteria and metric event needs | `03-tech-design.md` |
| Milestones, cutover, ownership | Release boundaries/checklist | `05-implementation-plan.md` |
| Test seams, matrices, and release verification | Acceptance criteria and release blockers | `06-testing-plan.md` |

Every requirement ID used by another document must preserve its meaning. Companion documents may add implementation-level identifiers but must link back to these stable IDs. Any proposed contradiction must be resolved by updating the affected canonical documents together.
