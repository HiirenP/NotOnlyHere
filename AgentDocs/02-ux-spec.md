# NotOnlyHere Authenticated Web Product — UX Specification

## Document metadata and authority

| Field | Value |
|---|---|
| Product | NotOnlyHere authenticated member web application and web admin panel |
| Document | `02-ux-spec.md` |
| Status | **Target — implementation-ready UX baseline** |
| Version/date | 1.0 / 2026-07-29 |
| Canonical source | This file is canonical for information architecture, routes, flows, screens, states, interaction behavior, responsive behavior, accessibility, and product microcopy. |
| Product source | Scope, roles, priorities, metrics, and requirement IDs: `01-product-prd.md` |
| Companion documents | `03-tech-design.md`, `04-backend-schema.md`, `05-implementation-plan.md`, `06-testing-plan.md` |

### Decision labels

- **Live now:** existing static marketing experience or migration boundary.
- **Target:** required authenticated app/admin end state.
- **Transition:** temporary migration or rollout behavior.
- **Release blocker:** must pass before production release.
- **Reference signal:** measured after release to guide iteration, not a launch gate.
- **Excluded:** intentionally absent and not to be implied by UI.

If this document conflicts with `01-product-prd.md` on scope, the PRD wins. Technical companions must support these interactions without weakening authorization, privacy, or accessibility.

## 1. UX decisions

1. **Target — Browser-first, not app-like theater.** The product works in phone, tablet, and desktop browsers. It does not show app-store badges, install banners, native-app prompts, or a download route.
2. **Target — Warm and calm.** Use humane language, generous spacing, soft surfaces, and restrained motion. Avoid clinical imagery, gamification pressure, urgency patterns, infinite-scroll traps without a fallback, and engagement-shaming copy.
3. **Target — Identity before send.** Every eligible post/comment composer makes “Post as” and audience/context clear before submission. Anonymous state is visually distinct but not alarming.
4. **Target — Privacy by comprehension.** Explain who can see a contribution and what admins can trace at the decision point, not only in legal text.
5. **Target — AI humility.** Ava is visibly AI, requires informed consent, is never represented as a therapist, and always provides static crisis-resource access. No interface claims crisis detection or escalation.
6. **Target — Human authority.** AI safety flags are recommendations for authorized staff. Human review and reasoned action remain explicit.
7. **Target — Accessible equivalence.** Every pointer interaction has keyboard and touch equivalents; color, motion, hover, and icon shape are never the only carriers of meaning.
8. **Live now — Marketing ownership.** The static site retains public marketing design and SEO. This specification only defines its `/login`, `/register`, blog, and donation handoff into the product.

## 2. Experience principles

### 2.1 Warm, safe peer support

- Prefer “Share what feels comfortable” over “What’s on your mind?”
- Prefer “You can change your mind” over irreversible-sounding consent.
- Show peer-support and crisis boundaries without making every ordinary action feel dangerous.
- Never imply popularity ranking, streak loss, read surveillance, or response obligation.
- Use “Member” and “Circle Admin” consistently; never introduce a Circle Moderator.

### 2.2 Control and predictability

- Put identity, audience, price, destructive impact, and role impact beside the confirming action.
- Never change post audience or anonymous state because a prior composer used it; use a documented safe default and show it.
- Use optimistic updates only when reversal is reliable. Payments, roles, bans, identity reveals, and publishing wait for authoritative confirmation.
- Keep drafts in the current browser where safe; do not promise cloud draft recovery unless specified later.

### 2.3 Progressive disclosure

- Lead with the next task; disclose advanced filters and policy explanations on request.
- Keep sensitive admin details behind role checks and explicit “Reveal identity” actions.
- Present enough event/resource/circle metadata to decide before opening a detail page.

## 3. Information architecture

### 3.1 Member application

Primary destinations:

1. Home / Feed
2. Circles
3. Messages
4. Ava
5. Explore
   - Search
   - Events
   - Resources
   - Blog
6. Notifications
7. Profile and Settings
   - Profile editing
   - Connections
   - Blocked accounts
   - Mood
   - Sessions
   - Ava data and consent
   - Account

Desktop uses a persistent left navigation, content canvas, and optional contextual right rail. Phone uses a compact top bar and five-item bottom navigation: Home, Circles, Create, Messages, Explore; Notifications and profile are top-bar actions. “Create” opens an accessible action sheet/modal for post and other authorized creation actions. Ava remains reachable in Explore and may replace Create only if user research demonstrates no loss of posting discoverability; initial Target keeps Create.

### 3.2 Admin panel

Primary destinations:

1. Dashboard
2. Users
3. Circles
4. Safety alerts
5. Content
   - Blog
   - Resources
   - Events
6. Donations
7. Analytics
8. Audit log

Navigation is permission-filtered for orientation, but server authorization remains decisive per `01-product-prd.md` ADM-12. No navigation item exists for user reports, AI configuration, feature flags, circle health, or moderation analytics.

### 3.3 Static marketing integration boundary

- **Live now:** marketing owns `/`, public informational pages, public SEO, and conversion CTAs.
- Marketing “Log in” → app `/login`; “Register/Join” → app `/register`.
- Public blog links resolve through one agreed canonical route without duplicate SEO ownership.
- Donation CTA opens the donation entry route; return states are success, canceled, or pending verification.
- Invalid `returnTo` values are discarded; only approved same-origin or allowlisted destinations are honored.

## 4. Route map

Routes are UX contracts; API paths belong in `03-tech-design.md`.

### 4.1 Public/auth boundary

| Route | Purpose | Access |
|---|---|---|
| `/login` | Email/password and Google/Apple entry | Signed out; signed-in redirects safely |
| `/register` | Account creation and age/legal confirmation | Signed out |
| `/verify-email` | Verification result/resend | Public token boundary |
| `/forgot-password` | Generic reset request | Signed out |
| `/reset-password` | Set new password | Public token boundary |
| `/donate` | One-time/monthly Stripe entry | Public or signed in |
| `/donate/result` | Verified success/pending/canceled state | Public-safe |
| `/blog` | Blog listing integration route | Public per ownership decision |
| `/blog/[slug]` | Published blog post | Public per ownership decision |
| `/rss.xml` | Published blog RSS | Public |

There is no `/download`, `/pricing`, native-app, or install route in product scope.

### 4.2 Member routes

| Route | Screen |
|---|---|
| `/app` | Relevant/chronological feed |
| `/app/search` | Eligible content/member/circle search |
| `/app/post/[postId]` | Post detail/thread |
| `/app/circles` | Circle directory |
| `/app/circles/new` | Circle proposal/create |
| `/app/circles/[circleId]` | Circle detail/feed |
| `/app/circles/[circleId]/members` | Member list |
| `/app/circles/[circleId]/manage` | Circle Admin controls |
| `/app/messages` | Conversation list |
| `/app/messages/[conversationId]` | 1:1 thread |
| `/app/ava` | Ava consent/chat/history |
| `/app/notifications` | Notification center |
| `/app/events` | Month/list calendar |
| `/app/events/new` | Event creation when authorized |
| `/app/events/[eventId]` | Event detail/RSVP |
| `/app/resources` | Resource library |
| `/app/resources/[resourceId]` | Resource/access/progress |
| `/app/mood` | Daily check-in and private trends |
| `/app/profile/[username]` | Member profile |
| `/app/settings/profile` | Profile editor |
| `/app/settings/connections` | Requests/connections |
| `/app/settings/blocked` | Blocked accounts |
| `/app/settings/sessions` | Active sessions |
| `/app/settings/ava` | Ava personalization, consent, delete |
| `/app/settings/account` | Account/security actions |

No journaling route or profile privacy/notification-preference route exists.

### 4.3 Admin routes

| Route | Screen |
|---|---|
| `/admin` | Dashboard |
| `/admin/users` | User search/list |
| `/admin/users/[userId]` | User detail/actions |
| `/admin/circles` | Circle approvals/list |
| `/admin/circles/[circleId]` | Circle review/detail |
| `/admin/safety-alerts` | Limited AI-flag list |
| `/admin/safety-alerts/[alertId]` | Human review |
| `/admin/blog` | Blog list |
| `/admin/blog/new` | New draft |
| `/admin/blog/[postId]` | Edit/preview/schedule |
| `/admin/resources` | Resource content/access list |
| `/admin/resources/[resourceId]` | Resource editor |
| `/admin/events` | Standalone events administration |
| `/admin/donations` | Stripe donation visibility |
| `/admin/analytics` | First-party metrics/funnel |
| `/admin/audit` | Audit search/detail |

## 5. Core flows

Each flow includes happy and error/recovery paths. Screen details follow in section 6.

### F-01 — Email registration, verification, and first entry

**Entry:** Marketing `/register` CTA or direct safe route.  
**Happy path:** Register → enter display name, username, email, password → check “I confirm I am 16 or older” → accept linked Terms and Guidelines → submit → neutral “Check your email” screen → follow valid link → verification success → sign in/automatic safe session → brief welcome with optional profile setup and “Explore feed.”  
**Errors:** Existing/invalid email and username conflicts are field-specific only after safe validation; age/legal omissions focus first invalid field; weak password shows requirements; network failure preserves non-password fields; expired link offers resend; repeated resend is rate-limited with countdown.  
**Rules:** OAuth first-use returns to complete username/age/legal steps. Never imply under-16 users can obtain parental bypass. See AUTH-01–03.

### F-02 — Login, reset, and sessions

**Happy path:** `/login` → credentials or OAuth → safe `returnTo` destination → settings lists sessions → revoke another session with confirmation.  
**Errors:** Unknown email and wrong password share “Email or password wasn’t recognized.” Unverified account gets a generic login failure plus a separately safe resend path only after proof/rate controls. Suspended/banned state shows approved reason class and Help link. Reset request always shows identical confirmation. Invalid/expired reset token offers a new request.  
**Excluded:** No TOTP, 2FA, or recovery codes.

### F-03 — Create identified or anonymous post

**Happy path:** Create → composer → text and up to four images → optional link preview → choose “Post as: [Display name]” or “Anonymous” → choose Public/Members/Connections/Only me → if in circle, show circle context → submit → authoritative card appears with confirmation.  
**Anonymous branch:** Selecting Anonymous opens first-time explanation: generated pseudonym for this contribution, no profile/DM, authorized admins can trace for safety, 10/day. Confirm selection; composer header and button say “Post anonymously.”  
**Errors:** Unsupported/oversized image remains unsaved with per-file error; fifth image rejected; preview fetch failure leaves URL; lost connection preserves local draft and offers retry; quota reached disables anonymous submit, states reset time, and offers “Post with my profile.”  
**Safeguard:** A final summary near submit shows identity + audience. No content-warning, mention, hashtag, pin, or report control.

### F-04 — Engage with feed and post

**Happy path:** Switch Relevant/Chronological → filter/search → cursor-load cards → choose Support/Hug/Insightful → open detail → add top-level comment or one-level reply → edit own contribution within 15 minutes → soft-delete after confirmation.  
**Errors:** Removed/deleted post shows neutral unavailable state; stale edit says “The 15-minute editing window has ended” and preserves copy for manual reuse; unauthorized visibility routes to not-found/limited access without revealing existence; cursor retry is inline and does not erase cards.  
**Accessibility:** Infinite loading has a keyboard-operable “Load more posts” control and status announcement.

### F-05 — Connect, disconnect, and block

**Happy path:** Profile → Connect → recipient notification → Accept/Decline → accepted members can Message → either may remove connection. Block is Profile overflow → impact summary → confirm → affected content/contact is hidden and DM sending stops. Unblock lives in Settings > Blocked accounts.  
**Errors:** Duplicate/crossed requests collapse to current state; blocked or unavailable account returns neutral failure; connection removed in another tab updates action on refresh/realtime event.  
**Safeguard:** Block does not notify the blocked person. No block button is added inside DM.

### F-06 — Discover and join a circle

**Happy path:** Circle directory → search/filter → detail → Open: Join immediately; Approval: answer any defined prompt and Request to join; Private: accept invite → circle feed. Leave uses member menu and impact confirmation.  
**Errors:** Hidden circles never appear unless authorized; expired invite offers safe dismissal; rejected request shows status without exposing internal notes; archived circle is read-only/unavailable per policy; last Circle Admin cannot leave until transfer.  
**States:** CTA is Join, Request to join, Requested, Accept invitation, Member, or Unavailable—never ambiguous.

### F-07 — Create and administer a circle

**Happy path:** Eligible Member → New circle → name, description, visibility (public/private/hidden), join policy (open/approval/private), guidelines → review → submit → active or pending approval status. Circle Admin → Manage → invitations, pending requests, member list → approve/decline; remove circle post or mute member with reason and impact confirmation.  
**Errors:** Name collision gives alternatives; rejected proposal shows outcome/support path; invite ineligible member yields neutral explanation; stale request resolves to current state; destructive action failure leaves dialog open with retry.  
**Boundaries:** Circle Admin is the only scoped role. No Circle Moderator, featured-circle member UI, or event linkage.

### F-08 — Start and use 1:1 messaging

**Happy path:** Connected profile → Message → existing or unique new thread → send text → near-real-time display → react with emoji → load older messages upward → search and jump to context.  
**Errors:** Offline send displays Pending then Retry/Failed without duplicating; reconnect syncs authoritative order; removed connection/block disables composer with concise explanation; unavailable history page retries in place.  
**Boundaries:** No read receipts, typing status, files/images, voice, group chat, report-message, or in-DM block.

### F-09 — Ava consent, chat, personalization, and deletion

**Happy path:** Open Ava → consent panel explains AI/non-therapist, data sent, provider no-training commitment, private deletable history, 50/day, static crisis links, optional personalization → Accept basic Ava → starters/chat. Separate opt-ins enable voluntary preferences and circle recommendations. Settings permits withdrawal and history deletion.  
**Errors:** Decline leads to an informational Ava screen with crisis resources, not a dead end; provider/network failure preserves the member’s draft and says Ava is unavailable; quota reached shows reset time and static resources; deletion confirmation shows scope and then success.  
**Required copy:** “Ava is an AI companion, not a therapist or emergency service.” “NotOnlyHere does not automatically detect or escalate crises.”  
**Boundaries:** No crisis classification/escalation, summarization, journal prompts, or implication that AI “understands” feelings.

### F-10 — Mood check-in and trends

**Happy path:** Mood → “How are you feeling today?” → choose 1–5 with text labels → optional private note → Save → confirmation → 7/30-day trend. Same-day return edits existing entry.  
**Errors:** Save failure retains selection/note; trend failure leaves check-in available; missing days are gaps, not zeroes.  
**Privacy:** “Only you can see your mood check-ins.” No share, streak, reminder, export, or journal prompt.

### F-11 — Events and RSVP

**Happy path:** Events → Month/List → detail → RSVP Going/Maybe/Not going → confirmation; authorized creator uses New event with local time + explicit timezone → review → create. Eligible RSVP members receive idempotent 24h/1h email reminders.  
**Errors:** Invalid end time focuses field; timezone/DST ambiguity requires explicit offset choice; canceled event shows canceled state and suppresses reminders; reminder delivery does not alter RSVP.  
**Boundaries:** Standalone only—no circle field, recurrence, or virtual meeting link.

### F-12 — Resource discovery, purchase, and progress

**Happy path:** Library → search/filter by article/video/worksheet and access → detail. Free opens per policy; members-only asks sign-in; one-time-paid shows exact item/price → Stripe checkout → verifying state → entitlement → Start/Complete progress.  
**Errors:** Canceled checkout returns to item unchanged; delayed webhook shows “Payment is being confirmed” with refresh-safe state; failed payment gives Stripe-safe retry; refund/revocation message follows policy.  
**Boundary copy:** “One-time access to this resource.” Never “upgrade,” “plan,” or core-community paywall language. A worksheet is not promised as downloadable PDF.

### F-13 — Notifications and deep links

**Happy path:** Badge → center → filter All/Unread → open comment, reaction, connection, DM, circle invite, or admin-action item → mark read and navigate. Email deep link authenticates then returns to authorized destination.  
**Errors:** Deleted/inaccessible target routes to “This item is no longer available” and leaves notification readable; expired invite marks inactive; failed pagination retries inline.  
**Boundaries:** No digest, web push, thread mute, or channel preference center.

### F-14 — Donate

**Happy path:** Marketing/app CTA → choose one-time or monthly → amount → Stripe → verified confirmation/receipt.  
**Errors:** Cancel returns without shame language; pending webhook says confirmation may take a moment; duplicate return does not duplicate donation; failure does not expose processor internals.  
**Boundary:** Donations support NotOnlyHere but never unlock core features.

### F-15 — Admin user action and role assignment

**Happy path:** Admin Users → search → user detail with minimized identity/status → Suspend/Ban enters reason and impact → confirm → authoritative success/audit reference. Super Admin role change shows old/new permissions, confirms, and updates.  
**Errors:** Insufficient permission gets 403 screen; stale user state refreshes before action; last Super Admin protection blocks demotion; action failure preserves reason.  
**Safeguard:** Private DMs, mood notes, and Ava content do not appear. P2 impersonation is absent.

### F-16 — Admin AI safety-alert review

**Happy path:** Safety alerts → filter status → alert detail shows content needed for review, AI rationale labeled “AI-generated signal; may be wrong,” context, and permitted human actions → disposition/reason → audit. Anonymous identity remains hidden unless separate authorized Reveal identity action with purpose/reason is used.  
**Errors:** Removed content is labeled; duplicate/stale disposition resolves current state; identity reveal denial does not leak mapping.  
**Boundary:** This is not a user-report queue. AI never applies punishment or crisis escalation.

### F-17 — Blog draft, preview, schedule, publish

**Happy path:** Content Editor → Blog → New → title/body/category/tags/image → Save draft → Preview → Publish now or schedule with timezone → status confirmation.  
**Errors:** Autosave/manual-save conflict offers reload/copy; schedule in past asks Publish now or choose future; publication failure retains draft; invalid slug gives suggestion.  
**Boundaries:** No in-product SEO metadata management and no author profile links.

### F-18 — Analytics and CSV export

**Happy path:** Analyst → date/timezone filters → KPI definitions and updated timestamp → funnel/cohort views → Export CSV → confirm scope → generated file with metadata headers/readme convention from `03-tech-design.md`.
**Errors:** Immature retention cohort labeled incomplete; low/no data is not shown as zero success; export failure offers retry; authorization change cancels access.  
**Boundaries:** First-party data only. No circle-health or moderation metric dashboard; no raw sensitive content.

### F-19 — Account data export

**Happy path:** Member → Settings → Your data → Request export → re-authenticate → request accepted → notification/email when encrypted archive is ready → download through short-lived signed link.
**Errors:** Duplicate request returns current job; re-authentication failure preserves settings state; generation failure offers retry/contact; expired link offers regeneration.
**Boundaries:** This is an account-wide statutory/GDPR export that may contain the member's wellness records. It is not a wellness dashboard CSV/PDF export and never includes another person's private data.

## 6. Detailed screen inventory

### 6.1 Global app shell

**Purpose:** Stable orientation and access to primary tasks.  
**Components:** Skip link; brand; primary nav; notification button/count; profile menu; content `<main>`; optional contextual rail; persistent Help/crisis-resources entry; connection/offline banner.  
**Actions:** Navigate, open notifications/profile/help, retry network.  
**States:** Loading shell skeleton; offline (read-only cached presentation only where safe); session expired dialog preserving safe destination; unauthorized destination; maintenance.  
**Rules:** Page title and H1 identify destination. Nav active state uses text/shape plus color. Badge announces count meaningfully and caps visual text at “99+.”

### 6.2 Login/register/recovery

**Purpose:** Safe, low-friction entry.  
**Components:** Minimal auth card, password reveal button, provider buttons, legal links, status region, marketing-return link. Registration includes age and legal checkboxes.  
**Actions:** Submit, OAuth, reset, resend.  
**States:** Idle, validating, submitting, generic credential error, rate-limited, verification sent/success/expired, suspended/banned.  
**Microcopy:** “Join NotOnlyHere” / “A peer-support community for people 16 and older.” Never “Download the app.”

### 6.3 Feed

**Purpose:** Discover eligible community contributions and participate.  
**Components:** H1, Relevant/Chronological segmented control, Create card/button, filter/search controls, feed cards, load-more sentinel/button.  
**Actions:** Compose, switch order, filter, open, react, comment, card menu.  
**States:** First-time empty (“Your feed will grow as you join circles and connect”), filtered empty, loading skeleton, partial pagination error, offline, end of list.  
**Card content:** Identity/pseudonym, context, timestamp, edited label, text, up to four-image grid, safe link preview, visibility/context indicator where useful, reaction counts/actions, comment count.

### 6.4 Post composer

**Purpose:** Publish with deliberate identity and audience.  
**Components:** Text area with counter if a limit exists; image tiles/reorder/remove/alt-text input; link preview; “Post as” selector; visibility selector; circle context; anonymous disclosure; draft status; submit.  
**Actions:** Add/remove images, edit alt text, remove preview, choose identity/audience, submit/cancel.  
**States:** Clean, dirty, uploading each file, preview-fetching, validation, submitting, quota reached, success, recoverable failure.  
**Close behavior:** Dirty close asks Discard/Keep editing; Escape never silently discards.

### 6.5 Post detail

**Purpose:** Read context and one-level discussion.  
**Components:** Full post card, comment composer, top-level comments, one reply group per comment, load older comments.  
**States:** Loading, deleted tombstone, inaccessible/not found, comments empty, comment error.  
**Reply rule:** Replies to replies are visually flattened under the parent; no deeper indentation.

### 6.6 Search

**Purpose:** Find eligible posts, members, and circles.  
**Components:** Query, result-type tabs, advanced filters, result list, cursor controls.  
**States:** Before query with suggestions, searching, no results, corrected/invalid query, partial error.  
**Privacy:** Results are authorization-filtered before count; do not reveal blocked/hidden/inaccessible existence.

### 6.7 Profile and editor

**Purpose:** Understand a member and manage one’s supported identity.  
**Components:** Cover, avatar, display name, `@username`, bio, join date, Connect/Message/overflow, connection summary, eligible activity. Editor has upload/crop, supported fields, save.  
**States:** Self, connected, request sent/received, blocked/inaccessible, empty activity, upload error.  
**Absent:** Profile visibility/privacy settings and verification badge.

### 6.8 Connections and blocked accounts

**Purpose:** Manage relationship requests and general account blocks.  
**Components:** Incoming/outgoing/connections tabs; Accept/Decline/Cancel/Remove; blocked list with Unblock.  
**States:** Empty per tab, stale request, processing, success toast with undo only when policy-safe.  
**Copy:** “Blocking stops this person from contacting you and limits what you see from each other.”

### 6.9 Circle directory

**Purpose:** Find relevant circles.  
**Components:** Search, access/visibility filters, circle cards, create-circle CTA if eligible.  
**Card:** Name, short purpose, access label, member count, join status. Hidden circles are never discoverable by ordinary browsing.  
**States:** Suggested default, results, no match, loading, error. No featured section.

### 6.10 Circle detail/feed

**Purpose:** Decide whether to join and participate after authorization.  
**Components:** Header, purpose/guidelines, visibility/access labels, admins, member count, join-state CTA, tabs Feed/About/Members, composer for active members.  
**States:** Non-member preview, pending, invited, member, muted, archived, access denied.  
**Muted copy:** Scope, duration/reset when defined, and Help path; reading availability follows policy.

### 6.11 Circle create/manage

**Purpose:** Create and govern with understandable scope.  
**Components:** Step form or one-page grouped form; separate visibility and join-policy controls; preview; request queue; invitations; members; scoped actions.  
**States:** Draft, pending global approval, active, rejected, archived; request/invite empties; action confirmation/error.  
**Destructive dialogs:** Name target, explain scope, require reason where specified, place safest action first.

### 6.12 Messages list/thread

**Purpose:** Maintain connection-only private text conversations.  
**List:** Search conversations, participant identity, last-message text redacted from unsafe contexts where required, timestamp; no unread/read receipt semantics beyond own notification state.  
**Thread:** Participant header/profile link, history, message composer, send, emoji reaction picker, search.  
**States:** No conversations, selected-none desktop, loading older, reconnecting, pending/failed message, connection removed, blocked, unavailable.  
**Absent:** Typing, read receipts, attachments, report, block, group controls.

### 6.13 Ava

**Purpose:** Non-clinical AI companion conversation.  
**Components:** Persistent “AI companion—not a therapist” label, crisis-resources link, consent gate, starters, conversation, message counter/reset, history controls, delete.  
**States:** Consent required/declined/withdrawn, empty, generating with cancel/stop where technically supported, failure, quota reached, delete processing/success.  
**Response labeling:** Ava avatar/name plus “AI”; never use a clinician title or “Ava is thinking about you.”

### 6.14 Notification center

**Purpose:** Review event-triggered updates.  
**Components:** All/Unread, Mark all read, grouped date labels, notification rows.  
**States:** Empty (“You’re all caught up”), unread empty, pagination error, stale target.  
**Rows:** Actor where allowed, action, target-safe excerpt, timestamp, unread indicator. Sensitive message/body content should be omitted or tightly minimized.

### 6.15 Mood

**Purpose:** Private daily check-in and simple trend.  
**Components:** 1–5 radio group with labels from low to high, optional note, privacy statement, Save; 7/30 segmented control and accessible chart/data table.  
**States:** Not checked in, saved today/edit, trend loading, insufficient data, failure.  
**Chart:** Never rely on color; expose exact date/value in text/table; missing days are gaps.

### 6.16 Events

**Purpose:** Browse standalone events and RSVP.  
**Components:** Month/List switch, date navigation, filter, cards; detail with time/timezone/location text/description/RSVP counts; create form if authorized.  
**States:** Empty month, loading, canceled, past, RSVP processing/error.  
**Absent:** Circle association, recurrence, virtual meeting URL.

### 6.17 Resource library/detail

**Purpose:** Find and consume bounded learning resources.  
**Components:** Search/filter/type/access chips; cards; detail summary/type/access/price; content viewer; progress action.  
**States:** Free, members-only, locked paid, payment pending, entitled not started/in progress/completed, unavailable/refunded.  
**Copy:** “Members-only” means login access, not paid plan.

### 6.18 Blog listing/post

**Purpose:** Consume published editorial content.  
**Components:** Listing search/category/tag; cards; post title/date/category/tags/body; related posts; RSS link.  
**States:** Loading, no category results, post not found/unpublished.  
**Absent:** Author profile link and in-product SEO controls.

### 6.19 Settings

**Purpose:** Group profile, relationship, session, Ava, data-rights, and account controls.
**Components:** Section navigation; save bars; session cards; Ava consent/preferences/delete; account-wide data-export request/status/download; account logout/security and deletion.
**States:** Saved, unsaved, validation failure, session revoked, consent withdrawal confirmation, export queued/processing/ready/failed/expired.
**Absent:** Notification channel preferences, profile privacy/visibility, 2FA.

### 6.20 Admin dashboard

**Purpose:** Role-appropriate operating overview.  
**Components:** KPI cards with definition/window; recent administrative activity; limited safety-alert summary; quick actions.  
**States:** Loading skeleton, no activity, partial-card error, unauthorized card omitted, stale-data indicator.  
**Privacy:** No private content previews, mood notes, or payment card data.

### 6.21 Admin users/detail

**Purpose:** Find accounts and take authorized actions.  
**Components:** Search/filters/table; detail summary, status, global roles, circle admin memberships, enforcement history; Suspend/Ban/role actions.  
**States:** No match, loading, restricted field redaction, stale status, action pending/success/failure.  
**P2:** No impersonation button.

### 6.22 Admin circles/detail

**Purpose:** Approve and oversee circles.  
**Components:** Status filters, applications/list, detail/purpose/access/admins/counts, Approve/Archive/administrative Feature.  
**States:** Pending, active, archived, action conflict. “Featured” does not create member-facing featured circles.

### 6.23 Admin safety alerts

**Purpose:** Human review of AI-generated safety signals.  
**Components:** Alert filters/status, content context, AI rationale label, confidence only if calibrated and useful, human disposition, enforcement links, separately gated identity reveal.  
**States:** New/in review/resolved/dismissed, content removed, stale, access denied.  
**Absent:** User reports, automated punishment, crisis escalation, AI configuration.

### 6.24 Admin blog/resources/events

**Purpose:** CRUD and publish/manage content within role.  
**Components:** Filterable lists, status, editor, preview, schedule/timezone, access/price controls for resources, standalone event fields.  
**States:** Draft, scheduled, published, archived/canceled, save conflict, validation, publish failure.

### 6.25 Admin donations

**Purpose:** View Stripe-authoritative donation operations.  
**Components:** Date/cadence/status filters, donor-safe reference, amount/currency, one-time/monthly, status/time, detail timeline.  
**States:** Empty, pending, succeeded, failed, refunded/canceled, webhook delay.  
**Redaction:** Never display full card/bank data; exports follow least privilege.

### 6.26 Admin analytics

**Purpose:** Understand PRD-defined growth and participation.  
**Components:** Date/timezone, DAU/MAU/signups/retention, posts/comments/reactions, visit→register→first post→join circle funnel, definitions, CSV export.  
**States:** Loading, no data, immature cohort, partial source delay, export generating/ready/failed.  
**Labels:** Growth targets are **Reference signal**. Event privacy, RBAC, accessibility, AI boundary, and migration checks are **Release blocker** per `01-product-prd.md`.

### 6.27 Audit log

**Purpose:** Inspect immutable privileged-action history.  
**Components:** Actor/action/target/date filters, rows, safe metadata detail, reason, request/correlation reference.  
**States:** No match, redacted detail, retention boundary, loading/export if approved. No edit/delete UI.

## 7. Shared components and interaction contracts

### 7.1 Buttons and links

- Primary: one main commit per region. Secondary: reversible/alternative. Destructive: explicit text such as “Ban member,” never generic “Confirm.”
- Disabled controls must not be the only explanation; nearby text states why.
- Links navigate; buttons act. External links identify new-window behavior only when used.
- Touch target minimum 44×44 CSS px; visible spacing prevents accidental destructive taps.

### 7.2 Forms

- Persistent visible labels; placeholder is example, never label.
- Required/optional stated in text. Validate on submit and after blur where helpful, not on every keystroke.
- Error summary at top links to fields; inline errors are programmatically associated. Focus summary after failed submit.
- Preserve valid input after recoverable errors. Passwords/payment secrets are exceptions.
- Character limits show current/max and announce near limit without noisy live updates.

### 7.3 Dialogs, menus, drawers, toasts

- Dialog has name, initial focus, focus trap, Escape close unless an irreversible request is processing, and focus return.
- Phone may use bottom sheet only when semantics remain dialog/menu and keyboard viewport is handled.
- Menus use expected arrow/Escape behavior. Do not place complex forms in menus.
- Toasts confirm noncritical outcomes and do not contain the only copy of an error or undo. Use `role=status`; urgent errors use sparing alert semantics.

### 7.4 Cards, tabs, filters, pagination

- Entire-card click targets must not swallow nested controls; title link is the semantic navigation target.
- Tabs use tab semantics only for same-page panels; route navigation remains links.
- Active filters appear as removable chips; “Clear all” is visible.
- Cursor lists preserve scroll/focus. Every auto-load has a manual Load more fallback.

### 7.5 Images and media

- Uploaded feed images require member-provided alt text or an explicit “Decorative” choice only when truly decorative.
- Avatar alt uses member display name where meaningful; decorative duplicates use empty alt.
- Image grids expose count/order and full-screen viewer controls with close, next/previous, and captions/alt.
- Video resources require captions and accessible controls; transcripts are preferred for instructional content.

### 7.6 Identity chip

Shared “Post as” control displays avatar/name or anonymous icon/generated pseudonym preview. Anonymous uses icon + “Anonymous,” not color alone. Switching identity updates submit label and confirmation summary.

### 7.7 Audience chip

Public, Members, Connections, Only me, and Circle context use icon + text and a plain-language disclosure:

- Public: “Visible under the public audience policy; public-web publishing is separately controlled.”
- Members: “Visible to signed-in members who otherwise have access.”
- Connections: “Visible to your connections who are not blocked.”
- Only me: “Visible only to you and narrowly authorized operations under policy.”
- Circle: “Visible only according to this circle’s access.”

Final wording must align with resolution of OQ-03 in `01-product-prd.md`.

## 8. State system

### 8.1 Loading

- Use layout-matched skeletons for initial lists/cards; do not animate aggressively.
- Use inline spinner + verb for actions: “Saving…”, “Sending…”, “Publishing…”.
- After 10 seconds, show a plain status and safe Cancel/Retry where possible.
- Do not skeleton private text into a shared/previous user’s cached shape.

### 8.2 Empty

Every empty state answers: what this area is, why it may be empty, and one appropriate next step. Avoid blame:

- Feed: “Nothing here yet. Join a circle or connect with members to shape your feed.”
- Messages: “Messages start after you connect with someone.”
- Notifications: “You’re all caught up.”
- Mood trend: “Add a few check-ins to see a trend. Missing days are okay.”

### 8.3 Error

- State what failed, whether input was saved, and what can be done.
- Never expose stack traces, provider IDs, raw authorization rules, account existence, anonymous mappings, or payment internals.
- Full-page 404 and access-denied may intentionally converge for sensitive resources.
- Partial failures stay local: a feed pagination failure does not replace loaded cards.

### 8.4 Success

- Confirm result and changed state: “Post shared with Members,” “Connection accepted,” “Circle request sent.”
- Payment and role/enforcement success wait for server authority.
- Focus moves only when context changes; avoid unsolicited page jumps.

### 8.5 Offline/reconnection

- Banner: “You’re offline. Some actions are unavailable.”
- Text drafts may remain local on that device. Do not queue payment, moderation, role, anonymous identity reveal, or donation actions offline.
- Pending DM/post sends clearly distinguish local pending from accepted; retry uses the idempotency contract from `03-tech-design.md`.

## 9. Responsive behavior

### 9.1 Layout ranges

Content determines exact breakpoints; starting references:

- Compact: 320–767 px.
- Medium: 768–1023 px.
- Wide: ≥1024 px.

Support down to 320 CSS px without horizontal page scrolling except intrinsically scrollable tables/charts with an accessible alternative. Browser zoom to 400% must reflow core flows.

### 9.2 Compact

- One content column; edge padding ≥16 px.
- Bottom primary navigation; sticky composer/DM bar respects safe area and virtual keyboard.
- Tables become labeled cards or horizontally scroll within a named region with keyboard instructions.
- Filters open a full-height dialog/drawer with Apply and Clear; selected count appears on trigger.
- Post image layouts: one full width, two grid, three/four balanced grid; tap opens viewer.
- Admin is usable for urgent tasks on compact screens, but dense tables transform rather than shrink.

### 9.3 Medium

- Collapsible rail + content; optional contextual rail remains hidden.
- Two-column card grids where content permits.
- Calendar can use month grid if each cell remains operable; otherwise default list.

### 9.4 Wide

- Persistent navigation; centered readable content (prose approximately 65–75 characters per line).
- Feed may use contextual right rail without moving essential actions out of main flow.
- Admin tables use sticky headers and column priority; no hover-only actions.

### 9.5 Orientation and input

- No orientation lock.
- Handle virtual keyboard without covering submit/composer.
- Hover enhances but never reveals sole actions.
- Drag reorder has keyboard Move up/down alternatives.

## 10. Accessibility — WCAG 2.2 AA

### 10.1 Release-blocking acceptance

The following are **Release blocker**:

- No unresolved critical or serious accessibility defect in P0 journeys.
- All F-01 through F-18 primary paths complete by keyboard alone.
- Screen reader smoke tests pass on agreed desktop and mobile combinations.
- Text contrast ≥4.5:1; large text ≥3:1; UI components/focus indicators ≥3:1 where WCAG requires.
- Visible focus is not obscured by sticky headers/bars and meets Focus Appearance expectations.
- 200% text resize and 400% zoom complete without loss of content/function.
- Automated checks are clean for agreed rules, supplemented by manual tests.

### 10.2 Structure and naming

- One descriptive H1; logical headings; landmark regions; “Skip to main content.”
- Unique page titles update on navigation.
- Icon-only controls have accessible names; repeated card actions include target context.
- Counts and state changes are conveyed in text, not only badge color.

### 10.3 Keyboard and focus

- DOM order matches visual/logical order.
- On client route change, focus moves to main heading or preserved relevant target and page title updates.
- Opening dialog moves focus inside; closing returns to trigger.
- Adding a feed item does not steal focus; success is announced. Loading older DMs preserves viewport and focus.
- No keyboard trap. Escape behavior is predictable. Shortcuts, if any, avoid single-character activation in text contexts.

### 10.4 Motion and timing

- Respect `prefers-reduced-motion`; remove nonessential parallax, smooth scrolling, pulse, and large transitions.
- No auto-advancing carousels.
- Session-expiry warnings provide sufficient time and extension where security allows.
- Quota/countdown content is textual and does not require watching a timer.

### 10.5 Forms, errors, and authentication

- Authentication supports password managers and paste; do not block password paste.
- Error text identifies field and correction. Suggestions do not auto-submit.
- OAuth provider names are text.
- CAPTCHA, if later required, needs accessible alternatives and would require spec review.

### 10.6 Charts and calendars

- Analytics/mood charts include data table or accessible summary.
- Never rely on red/green alone.
- Calendar supports keyboard date navigation or an equivalent complete list view; Month/List preference does not hide events.

## 11. Content and microcopy

### 11.1 Voice

- Warm, direct, nonjudgmental, concise.
- Use “you may,” “if you’d like,” and “share what feels comfortable.”
- Avoid diagnosis, promises of healing, “safe space” absolutes, “we understand exactly,” “addictive,” and shame-based urgency.
- Avoid “anonymous account”; say “post anonymously” because admins retain traceability.

### 11.2 Required boundary copy

- Product: “NotOnlyHere is a peer-support community, not professional mental health care or an emergency service.”
- Ava: “Ava is an AI companion, not a therapist or emergency service.”
- Automation: “NotOnlyHere does not automatically detect or escalate crises.”
- Crisis: Use legally/safety-approved localized static resources; do not hard-code 988 as globally applicable. Where US is supported: “In the U.S., call or text 988. If you are in immediate danger, contact local emergency services.”
- Anonymous: “Your name and profile won’t appear on this contribution. Authorized administrators can trace it to your account for safety and legal reasons.”
- Mood: “Only you can see your mood check-ins.”
- Resource purchase: “One-time access to this resource. Your core community access stays free.”

### 11.3 Action labels

Use concrete verbs: Join circle, Request to join, Post anonymously, Send message, Save mood, RSVP Going, Publish now, Schedule post, Suspend member, Reveal identity. Avoid OK, Yes, Submit, or ambiguous Continue when a more exact label fits.

### 11.4 Date, number, and status

- Use member locale for display; include timezone for event creation/scheduling.
- Relative time may be paired with exact time on hover/focus/detail.
- Do not fabricate precision: analytics cards label delayed/incomplete data.
- Explain system terms such as “Relevant” in an info disclosure without claiming hidden sensitive inference.

## 12. Sensitive-data redaction and presentation

### 12.1 Never place in URLs, analytics, email subjects, or routine logs

- Post/comment/message/Ava text bodies.
- Mood value or note.
- Anonymous account mapping.
- Block relationships.
- Password/reset/verification/OAuth tokens.
- Full payment details or processor secrets.
- Suspension details beyond safe reason class where not authorized.

### 12.2 Notification and email previews

- Prefer “Someone commented on your post” over quoting sensitive content.
- DM email: “You have a new message from [permitted identity]” with no message body.
- Anonymous actor notification stays “An anonymous member”; deep links re-authorize.
- Lock-screen/browser push is excluded, reducing but not removing email privacy concerns.

### 12.3 Admin redaction

- Default tables show display identifiers and operational status only.
- Mask email where full value is unnecessary; reveal only by permission and purpose.
- Anonymous mapping is a separate, audited reveal—not a hidden column or export field.
- Safety-alert screenshots/exports are not provided by default.
- Analysts receive aggregates; no raw DMs, Ava history, mood data, or anonymous mappings.
- Donation views show amount/cadence/status and safe donor reference, never full payment instrument.

### 12.4 Shared-device protections

- Logout clears protected local presentation and browser-held drafts according to policy.
- Session expiry obscures protected content before asking to sign in.
- Do not include sensitive page content in browser titles.
- Back-button behavior after logout must not reveal cached protected screens.

## 13. Admin workflow rules

- Role-filter admin nav for clarity, but show a safe 403 if a bookmarked route is denied.
- Privileged dialogs state target, scope, duration when relevant, member-visible effect, and audit consequence.
- Require typed target confirmation only for high-impact irreversible actions where it improves safety; do not overuse.
- Reasons are required for suspend, ban, circle archive, circle post removal, member mute, and anonymous identity reveal.
- AI rationale is visually subordinate to source content/context and labeled fallible.
- Role assignment shows permission delta and prevents last-Super-Admin removal.
- Broadcast requires audience estimate, channel summary, preview, test where supported, and final confirm. It is not a digest/preferences feature.
- CSV export states fields, date window, row estimate, sensitive-data classification, and expiry.

## 14. Metrics and UX validation

### 14.1 Reference signals

These reflect `01-product-prd.md` and do not independently block release:

- Registration completion and verification completion.
- Time and steps from activation to first meaningful action.
- First post/comment and circle join within seven days.
- Relevant/Chronological selection and search success without capturing query text when sensitive.
- Anonymous composer abandonment and quota encounters, measured without body text.
- Ava consent acceptance/decline/withdrawal and quota encounters, without conversation content.
- Resource entitlement completion and basic progress.

### 14.2 Release blockers

- Users can accurately identify post identity and audience in moderated usability tests; no critical anonymous/public-sharing confusion.
- Required Ava/not-therapy/no-automatic-crisis language and static resources are present and keyboard/screen-reader reachable.
- WCAG acceptance in section 10 passes.
- Authorization/redaction tests prove sensitive content does not leak across roles, deep links, notification previews, search, or exports.
- No prohibited content body appears in first-party analytics payload samples.

### 14.3 Test scenarios

Include at minimum:

- New member at 320 px width with keyboard-only and screen reader.
- Member switching anonymous/identified twice before submitting.
- Anonymous quota reached while draft exists.
- Block occurs while DM thread is open.
- Circle request approved/declined in another tab.
- Ava consent declined, withdrawn, and history deleted.
- OpenAI unavailable and Ava quota reached while crisis resources remain reachable.
- Stripe return precedes webhook.
- Event crosses daylight-saving boundary.
- Analyst opens direct URL to user/safety details and is denied.
- Moderator attempts anonymous reveal without permission/reason.
- 400% zoom in admin action dialog and analytics table.

## 15. Transition and migration UX

- **Transition:** Imported users whose password cannot migrate receive a reset path, not a false “wrong password” loop.
- Imported accounts missing age/legal evidence complete those confirmations before member access.
- Imported unsupported profile privacy/badge data is not surfaced.
- Imported content with ambiguous visibility remains unavailable pending approved reconciliation.
- Legacy public blog URLs use agreed redirects without duplicate canonical pages.
- If private messages are not migrated, communicate only to affected members after policy approval; do not promise history.
- Migration banners are dismissible, dated, and removed after transition; they do not become permanent app chrome.
- Circle event links from legacy data are not recreated; events remain standalone.

## 16. Explicit anti-requirements

Design and copy must not create placeholders, disabled teasers, “coming soon” cards, settings, routes, or marketing claims for:

- Native/mobile apps, downloads, App Store/Play Store.
- TOTP/2FA or P0/P1 impersonation.
- Profile privacy/visibility, verification badge, notification preference center.
- Mentions, hashtags, pinning, content warnings, report-post/message.
- Anonymous DMs, consistent pseudonyms, AI toxicity scan.
- Circle Moderator, member-facing featured circles, circle-linked events.
- DM read receipts, typing, attachments, group chat, voice notes.
- Automated crisis detection/escalation, summarization, journal prompts, AI config.
- Digests, web push, mute-thread.
- Journal, mood streak/reminder/export.
- Event recurrence/virtual meeting links.
- User-report queue, feature flags, circle-health/moderation analytics.
- Course builder, ordered modules, quizzes, downloadable-PDF lessons, certificates.
- Core subscription plans/paywalls or third-party product analytics claims.

## 17. Cross-document traceability

| UX area | PRD IDs/section | Technical follow-through |
|---|---|---|
| Auth and sessions | AUTH-01–09 | `03-tech-design.md`, `04-backend-schema.md` |
| Profile/connections/block | PROF-01–08 | Data visibility and block policy in `04-backend-schema.md`; contracts in `03-tech-design.md` |
| Feed/anonymity | FEED-01–12, ANON-01–07 | Authorization, cursor, quota, and errors in `03-tech-design.md`; entities in `04-backend-schema.md` |
| Circles | CIRC-01–13 | Role/access contracts in `03-tech-design.md`; persistence in `04-backend-schema.md` |
| Messaging | MSG-01–07 | Socket/reconnect/auth in `03-tech-design.md`; retention in `04-backend-schema.md` |
| Ava/safety | AVA-01–12, SAFE-01–03 | Provider/privacy contracts in `03-tech-design.md`; consent/history in `04-backend-schema.md` |
| Notifications/blog/mood/events/resources/donations | Sections 7.8–7.13 of `01-product-prd.md` | `03-tech-design.md`, `04-backend-schema.md`, `05-implementation-plan.md` |
| Admin/RBAC/audit/analytics | ADM-01–14, MET-01–19 | All companion technical docs; verification in `06-testing-plan.md` |
| Responsive/WCAG/content/redaction | A11Y/PRIV + this sections 8–12 | Test and release ownership in `06-testing-plan.md` |
| Migration | PRD section 12 + this section 15 | Models in `04-backend-schema.md`; cutover in `05-implementation-plan.md`; verification in `06-testing-plan.md` |

All implementation tickets and test cases should cite the PRD requirement ID and relevant flow/screen section here. `05-implementation-plan.md` sequences the work and `06-testing-plan.md` includes release-blocking checks from sections 10 and 14.

## 18. UX handoff checklist

- [ ] Every P0 route has loading, empty, error, success, unauthorized, and responsive behavior where applicable.
- [ ] Identity/audience summaries are present in every post/comment context.
- [ ] Anonymous first-use, quota, traceability, no-profile, and no-DM behavior matches ANON requirements.
- [ ] Ava consent, withdrawal, deletion, personalization, recommendation opt-in, quota, disclaimer, and static crisis states are designed.
- [ ] Block policy is reflected across profile, feed, circles, messages, search, notifications, and direct routes.
- [ ] Standalone events have no circle, recurrence, or virtual-link controls.
- [ ] Core community remains visibly free; resource payment says one-time item access.
- [ ] Admin panel includes only role-permitted dashboard/users/circles/safety/content/donations/analytics/audit functions.
- [ ] Sensitive content is absent from analytics, routine logs, URLs, emails, previews, and unauthorized exports.
- [ ] Keyboard, focus, screen-reader, contrast, zoom, reduced-motion, touch-target, chart/table, and virtual-keyboard criteria pass.
- [ ] Static marketing handoffs and migration transition states are agreed with owners.
- [ ] No excluded feature appears as a placeholder, setting, route, or “coming soon” promise.
