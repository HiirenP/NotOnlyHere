# Member App — Full Test Plan & Fix Roadmap

**Purpose:** End-to-end test specification for every member-facing feature in `apps/web`.  
**Goal:** Replace mock/dead UI with real API-backed behavior and prove it with automated + manual tests.  
**Demo credentials:** `demo@notonlyhere.local` / `Demo1234!` (username: `demo`)  
**Seeded peers:** Jordan (`jordanl`), Sam (`samr`), Morgan (`morgank`)  
**Seeded circles:** Anxiety Support (`00000000-0000-5000-8000-000000000011`), New Parents, Grief & Loss, Work Stress

---

## Executive summary (current state)

| Area | Estimated working | Primary issue |
|------|-----------------|---------------|
| Auth & guards | ~90% | Solid; smoke tests only |
| Shell / navigation | ~70% | Dead footer buttons; static badges; mood not in sidebar |
| Feed | ~50% | API loads posts; moments rail + right rail news are mock |
| Composer / posts | ~40% | Create works; reactions/comments/share dead |
| Post detail | ~10% | No post ID in URL; always shows first feed item |
| Search | ~20% | Input does nothing; People tab is hardcoded |
| Circles | ~45% | List from API; join/leave/create dead; wrong feed on detail |
| Profile | ~35% | Own profile only; `[username]` param ignored |
| Messages | ~35% | Read works; send button dead; no new conversation |
| Notifications | ~60% | List + read-all; single-read + copy formatting weak |
| Connections | ~25% | Right rail partial; Connect button dead |
| Ava | ~5% | Entirely static; no `/api/ai/*` calls |
| Mood / wellness | ~65% | Check-in + trends wired |
| Events | ~50% | List from API; RSVP dead |
| Resources | ~45% | List from API; detail/progress dead |
| Explore | ~30% | Navigation hub only; no data |
| Settings | ~10% | All rows are inert buttons |

**Overall member app integration: ~30–35%** (matches observation). API backend is ~90% complete; design UI wiring is the gap.

---

## Test conventions

### Status codes used in this document

| Code | Meaning |
|------|---------|
| `PASS` | Works with real API today |
| `MOCK` | Renders but uses `mock.ts` or hardcoded data |
| `DEAD` | UI present, no behavior / wrong route |
| `MISSING` | Route or BFF proxy does not exist |
| `BUG` | Implemented but incorrect behavior |

### Test case fields

- **ID:** `MOD-NNN` (module + number)
- **Priority:** P0 (blocker), P1 (core UX), P2 (polish)
- **Type:** `E2E` (browser), `API` (contract), `UNIT` (mapper/component)

### Automation target files (to create)

```
apps/web/test/member/
  00-auth.spec.mjs
  01-navigation.spec.mjs
  02-feed.spec.mjs
  03-composer-posts.spec.mjs
  04-post-detail.spec.mjs
  05-search.spec.mjs
  06-circles.spec.mjs
  07-profile.spec.mjs
  08-messages.spec.mjs
  09-notifications.spec.mjs
  10-connections.spec.mjs
  11-ava.spec.mjs
  12-wellness.spec.mjs
  13-events.spec.mjs
  14-resources.spec.mjs
  15-explore-settings.spec.mjs
  16-redirects.spec.mjs
```

Run after seed: `npm run db:seed` from repo root.

---

## Module 0 — Authentication & session

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| AUTH-001 | Email login | P0 | PASS | POST `/api/auth/login` with demo email + password | 303 → `/app`; cookies `noh_access`, `noh_refresh`, `noh_csrf` set |
| AUTH-002 | Username login | P0 | PASS | Login with `demo` + password | Same as AUTH-001 |
| AUTH-003 | Invalid credentials | P0 | UNTESTED | Wrong password | Stay on `/login`; error message; no cookies |
| AUTH-004 | `returnTo` after login | P0 | PASS | `/login?returnTo=/app/feed` → login | Lands on `/app/feed` |
| AUTH-005 | Protected route guard | P0 | PASS | Visit `/app/feed` logged out | Redirect to `/login` |
| AUTH-006 | Logout | P0 | PASS | GET `/api/auth/logout` | Redirect `/login`; cookies cleared |
| AUTH-007 | Session persistence | P1 | UNTESTED | Login → reload `/app/feed` | Still authenticated |
| AUTH-008 | Register page loads | P1 | PASS | GET `/register` | Form visible; POST `/api/auth/register` available |
| AUTH-009 | Ingress login form action | P1 | PASS | Cloud host headers on `/login` | Form action includes `/_ingress/api/auth/login` |
| AUTH-010 | `requireAccount` on all `/app/*` | P0 | UNTESTED | Hit every member route logged out | All redirect to login with `returnTo` |

**Fixes:** Add AUTH-003, 007, 010 to automated suite.

---

## Module 1 — Shell, navigation & routing

### 1.1 Routes inventory

| Route | Page | Redirect? | Screen |
|-------|------|-----------|--------|
| `/app` | yes | — | `FeedScreen` |
| `/app/feed` | — | — | `FeedScreen` |
| `/app/composer` | — | — | `ComposerScreen` |
| `/app/search` | — | — | `SearchScreen` |
| `/app/post` | — | — | `PostDetailScreen` (**should be `/app/post/[id]`**) |
| `/app/circles` | — | — | `CirclesScreen` |
| `/app/circles/[circleId]` | — | — | `CircleDetailScreen` |
| `/app/circles/[circleId]/members` | — | → `/app/circles/[circleId]` | redirect only |
| `/app/profile` | — | → `/app/profile/{username}` | redirect |
| `/app/profile/[username]` | — | — | `ProfileScreen` |
| `/app/profile/edit` | — | → `/app/settings` | redirect |
| `/app/messages` | — | — | `MessagesScreen` |
| `/app/notifications` | — | — | `NotificationsScreen` |
| `/app/ava` | — | — | `AvaScreen` |
| `/app/mood` | — | — | `MoodScreen` |
| `/app/wellness` | — | → `/app/mood` | redirect |
| `/app/events` | — | — | `EventsScreen` |
| `/app/resources` | — | — | `ResourcesScreen` |
| `/app/explore` | — | — | `ExploreScreen` |
| `/app/settings` | — | — | `SettingsScreen` |
| `/app/settings/data` | — | → `/app/settings` | redirect |
| `/app/settings/connections` | — | → `/app/settings` | redirect |
| `/app/settings/sessions` | — | → `/app/settings` | redirect |

### 1.2 Navigation test cases

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| NAV-001 | Logo → feed | P0 | PASS | Click header logo | `/app/feed` |
| NAV-002 | Sidebar: all 9 links | P0 | PARTIAL | Click each sidebar item | Correct route; active state highlights |
| NAV-003 | Header nav (Feed/Circles/Explore/Ava) | P0 | PASS | Click each | Correct route |
| NAV-004 | Header icons (Messages/Settings/Notifications) | P0 | PASS | Click each | `/app/messages`, `/app/settings`, `/app/notifications` |
| NAV-005 | Profile avatar → own profile | P0 | PASS | Click avatar | `/app/profile/demo` (or current username) |
| NAV-006 | Mobile bottom nav (5 tabs) | P0 | UNTESTED | Resize to mobile; tap Feed/Circles/Post/Chat/Profile | `/app/feed`, `/app/circles`, `/app/composer`, `/app/messages`, `/app/profile/{user}` |
| NAV-007 | Search bar → search page | P1 | PASS | Click desktop search placeholder | `/app/search` |
| NAV-008 | Sidebar badge counts | P2 | MOCK | Messages badge `2`, Notifications `3` | Should reflect API unread counts |
| NAV-009 | Footer About/Support/Privacy/Terms | P2 | DEAD | Click each button | Should navigate to marketing/legal pages |
| NAV-010 | Mood reachable | P1 | PARTIAL | No sidebar link; only via `/app/wellness` or Explore | `/app/mood` loads with API data |
| NAV-011 | `DesignNavLink` ingress prefix | P1 | UNTESTED | On cloud host, click nav links | URLs preserve `/_ingress` when required |
| NAV-012 | Active route highlighting | P2 | UNTESTED | Visit `/app/circles` | Circles nav item active |

**Fixes (P0):**
1. Wire sidebar badges to `GET /api/notifications` (unread) + conversations unread.
2. Add Mood to sidebar OR document wellness redirect as canonical.
3. Implement footer links → `/about`, `/support`, `/privacy`, `/terms` (or external URLs).

---

## Module 2 — Feed (`FeedScreen`)

| ID | Title | Pri | Status | Preconditions | Steps | Expected API | Expected UI |
|----|-------|-----|--------|---------------|-------|--------------|-------------|
| FEED-001 | Load feed from API | P0 | PASS | Logged in, seeded | Open `/app/feed` | `GET /api/feed?mode=CHRONOLOGICAL` 200 | ≥4 seeded posts visible (Jordan, anonymous, Sam, Taylor bodies) |
| FEED-002 | No mock fallback when API ok | P0 | BUG | API healthy | Load feed | Single feed request | Posts match DB, not `mockFeedPosts` IDs |
| FEED-003 | Empty feed state | P1 | UNTESTED | Fresh user, no posts | Load feed | 200, `items: []` | “No posts yet” message |
| FEED-004 | API failure fallback | P2 | MOCK | Stop API | Load feed | 5xx | Falls back to `mockFeedPosts` (document or remove) |
| FEED-005 | Refresh feed button | P1 | PASS | Posts visible | Click “Refresh feed” | Second `GET /api/feed` | List updates |
| FEED-006 | Create post card | P0 | PASS | On feed | Click “Share your thoughts” | — | Navigate `/app/composer` |
| FEED-007 | Post author display | P1 | PARTIAL | Seeded posts | View Jordan post | — | Shows “Jordan Lee”, not mock-only name |
| FEED-008 | Anonymous post badge | P1 | PASS | Seeded anonymous post | View feed | — | Purple “Anonymous” badge; no avatar |
| FEED-009 | Post images render | P1 | UNTESTED | Post with media | View post | — | Image or graceful fallback |
| FEED-010 | Reaction count from API | P1 | BUG | Post with reactions | View post | Reactions in payload | Count matches seed (not 0) |
| FEED-011 | Comment count from API | P1 | BUG | Post with comments | View post | Comments exist in API | Count > 0 in card (mapper sets `comments: 0`) |
| FEED-012 | Like button toggles | P0 | DEAD | On post card | Click “Liked” | `PUT /api/posts/{id}/reactions/SUPPORT` | Count increments; filled heart |
| FEED-013 | Comments link | P0 | BUG | Click Comments on post A | — | — | Should go `/app/post/{postA.id}`; today all → `/app/post` |
| FEED-014 | Share button | P2 | DEAD | Click Share | — | — | No action |
| FEED-015 | Bookmark button | P2 | DEAD | Click bookmark | — | — | No action |
| FEED-016 | Post overflow menu | P2 | DEAD | Click ⋯ | — | — | Edit/delete/report menu |
| FEED-017 | Inline comment input | P1 | DEAD | Type + submit on card | `POST /api/posts/{id}/comments` | Comment appears |
| FEED-018 | Comment avatar | P2 | MOCK | View comment input | — | — | Uses `currentUser` mock, not live profile |
| FEED-019 | Circle moments rail | P1 | MOCK | View feed top | — | Should be `GET /api/circles` joined | Shows `circleHighlights` mock |
| FEED-020 | Right rail connections | P1 | PARTIAL | View feed (xl) | `GET /api/profile/me`, `GET /api/connections` | Jordan/Sam/Morgan from seed |
| FEED-021 | Right rail “Connect” | P1 | DEAD | Click Connect | `POST /api/connections/request` | Request sent |
| FEED-022 | Right rail today’s news | P2 | MOCK | View feed | — | Always `todaysNews` mock | Replace with events/blog API or remove |
| FEED-023 | Pagination / infinite scroll | P2 | MISSING | >20 posts | Scroll bottom | `cursor` param | Loads more posts |
| FEED-024 | RELEVANT feed mode | P2 | MISSING | — | Toggle mode | `mode=RELEVANT` | UI toggle does not exist |

**Fixes (P0):**
1. `PostCard` → `/app/post/[postId]`; add route `app/post/[postId]/page.tsx`.
2. Wire reactions via BFF `PUT /api/posts/[id]/reactions/[kind]`.
3. Fix `postItemToFeedPost` comment/reaction counts from API.
4. Replace `CircleMomentsRail` data with joined circles from API.
5. `CreatePostCard`/`PostCard` avatars from `account` or `/api/profile/me`.

---

## Module 3 — Composer (`ComposerScreen`)

| ID | Title | Pri | Status | Steps | Expected API | Expected UI |
|----|-------|-----|--------|-------|--------------|-------------|
| COMP-001 | Page loads | P0 | PASS | `/app/composer` | — | Textarea, Publish button |
| COMP-002 | Publish text post | P0 | PASS | Enter text → Publish | `POST /api/posts` `{body, visibility: MEMBERS}` | Redirect `/app/feed`; post at top |
| COMP-003 | Empty body blocked | P1 | UNTESTED | Publish with empty textarea | No POST | Button disabled or validation |
| COMP-004 | Anonymous toggle | P0 | PARTIAL | Toggle anonymous → publish | `isAnonymous: true` in POST | Post shows anonymous in feed |
| COMP-005 | Anonymous quota | P1 | MISSING | Exceed quota | `GET /api/anonymous/quota` | Warning before publish |
| COMP-006 | Audience selector | P1 | DEAD | Change “Members ▾” | POST with circle/visibility | Only static button |
| COMP-007 | Add photo | P1 | DEAD | Click Photo | `POST /api/media/uploads` | No upload flow |
| COMP-008 | Add mood / location | P2 | DEAD | Click Mood/Location | — | Decorative only |
| COMP-009 | Cancel / back | P2 | UNTESTED | Navigate away | — | No data loss warning |
| COMP-010 | Circle-scoped post | P1 | MISSING | Post to circle from composer | `circleId` in POST | Not available from composer |

---

## Module 4 — Post detail (`PostDetailScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| POST-001 | Route with post ID | P0 | MISSING | Visit `/app/post/{seededPostId}` | Page exists; loads that post |
| POST-002 | Current broken behavior | P0 | BUG | Visit `/app/post` | Loads **first feed item**, not clicked post |
| POST-003 | Load post by ID | P0 | MISSING | Open Jordan’s post | `GET /api/posts/{id}` 200 |
| POST-004 | Load comments | P0 | DEAD | View post detail | `GET /api/posts/{id}/comments` | List seeded comments (Jordan/Sam on post 1) |
| POST-005 | Post comment | P0 | DEAD | Submit comment | `POST /api/posts/{id}/comments` | Comment in thread |
| POST-006 | Reply to comment | P1 | DEAD | Reply | POST with `parentId` | Nested reply |
| POST-007 | Anonymous post detail | P1 | UNTESTED | Open anonymous post | Author hidden; anonymous badge |
| POST-008 | Reaction on detail | P1 | DEAD | Toggle like | `PUT .../reactions/SUPPORT` | Updates count |
| POST-009 | Edit own post | P1 | DEAD | Author views own post | `PATCH /api/posts/{id}` | Edit UI within 15min window |
| POST-010 | Delete own post | P1 | DEAD | Delete | `DELETE /api/posts/{id}` | Removed from feed |
| POST-011 | Back to feed | P2 | UNTESTED | Browser back | Returns to feed scroll position |

**Fixes (P0):**
1. Add `apps/web/src/app/app/post/[postId]/page.tsx`.
2. Redirect `/app/post` → `/app/feed` or remove.
3. Wire `PostDetailScreen` to `GET /api/posts/[id]` + comments BFF routes.
4. Add BFF: `GET/POST /api/posts/[id]/comments` if missing.

---

## Module 5 — Search (`SearchScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| SRCH-001 | Page loads | P0 | PASS | `/app/search` | Tabs: Posts, Circles, People |
| SRCH-002 | Search input filters posts | P0 | DEAD | Type “anxiety” | `GET /api/feed/search?q=anxiety` | Matching posts only |
| SRCH-003 | Search input filters circles | P0 | DEAD | Type “parents” on Circles tab | `GET /api/circles?q=parents` | Filtered circles |
| SRCH-004 | People tab from API | P0 | MOCK | Open People tab | Profile search API or connections | Shows Jordan/Sam/Morgan from DB, not hardcoded |
| SRCH-005 | Click search result post | P1 | DEAD | Click result | Navigate `/app/post/{id}` | — |
| SRCH-006 | Click search result circle | P1 | PARTIAL | Click circle | `/app/circles/{id}` | Works if GroupCard used |
| SRCH-007 | Click person | P1 | DEAD | Click Jordan | `/app/profile/jordanl` | Other user profile |
| SRCH-008 | Empty search results | P1 | UNTESTED | Query `zzzznonexistent` | — | Empty state message |
| SRCH-009 | Debounce / no spam | P2 | UNTESTED | Fast typing | — | ≤1 request per 300ms |

**Fixes (P0):**
1. Wire search input to `GET /api/feed/search` and `GET /api/circles?q=`.
2. Add BFF `GET /api/feed/search` proxy.
3. Replace People tab with `GET /api/profiles` search or connections directory.

---

## Module 6 — Circles directory (`CirclesScreen`)

| ID | Title | Pri | Status | Steps | Expected API | Expected UI |
|----|-------|-----|--------|-------|--------------|-------------|
| CIRC-001 | Load circles | P0 | PASS | `/app/circles` | `GET /api/circles` | 4 design circles + 3 seed fixtures |
| CIRC-002 | Joined vs Discover tabs | P0 | PARTIAL | Switch tabs | — | Filter by `viewer.isMember` |
| CIRC-003 | Circle card click | P0 | PASS | Click Anxiety Support | — | `/app/circles/00000000-0000-5000-8000-000000000011` |
| CIRC-004 | Search circles input | P1 | DEAD | Type in search box | `GET /api/circles?q=` | Filters list |
| CIRC-005 | Create circle button | P1 | DEAD | Click Create | `POST /api/circles` | Create flow / modal |
| CIRC-006 | Member counts | P1 | PASS | View cards | From API `memberCount` | Matches seed |
| CIRC-007 | Access badges | P1 | PASS | View Open/Request/Invite | From `joinPolicy` | Correct labels |
| CIRC-008 | Circle cover images | P2 | MOCK | View cards | — | All use same mock image in mapper |

**Fixes:** CIRC-004, 005, 008; use per-circle imagery or generated placeholders from slug.

---

## Module 7 — Circle detail (`CircleDetailScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| CDET-001 | Load circle by ID | P0 | PASS | `/app/circles/{anxietyId}` | `GET /api/circles/{id}` → name “Anxiety Support” |
| CDET-002 | Wrong feed source | P0 | BUG | View Discussion tab | Should `GET /api/circles/{id}/feed` | Uses global `/api/feed` |
| CDET-003 | Join open circle | P0 | DEAD | Click Join on Work Stress | `POST /api/circles/{id}/membership` | Member count +1; “Joined” |
| CDET-004 | Leave circle | P1 | DEAD | Click Leave | `DELETE /api/circles/{id}/membership` | Removed from joined |
| CDET-005 | Request join (approval) | P1 | DEAD | New Parents circle | POST membership → pending | “Request sent” |
| CDET-006 | Invite button | P2 | DEAD | Click Invite | Invite flow | — |
| CDET-007 | Members tab | P1 | PARTIAL | Switch to Members | `GET /api/circles/{id}/members` | Shows seeded members, not random `images` |
| CDET-008 | Events tab | P1 | PARTIAL | Switch to Events | Filter events by circle | Link to `/app/events` empty state |
| CDET-009 | About tab | P2 | PASS | View description | From API `description` | Matches seed |
| CDET-010 | Composer prompt in circle | P1 | PARTIAL | Click “Share with circle” | `/app/composer?circleId=` | Composer lacks circle context |
| CDET-011 | `/members` redirect | P2 | PASS | `/app/circles/{id}/members` | Redirect to detail | — |
| CDET-012 | Invalid circle ID | P1 | UNTESTED | Random UUID | 404 API | Error state UI |

**Fixes (P0):** CDET-002 (circle feed), CDET-003/004 (membership).

---

## Module 8 — Profile (`ProfileScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| PROF-001 | Own profile via redirect | P0 | PASS | `/app/profile` | Redirect `/app/profile/demo` |
| PROF-002 | Load own profile | P0 | PASS | View profile | `GET /api/profile/me` | “Alex Morgan”, bio from seed |
| PROF-003 | Username param ignored | P0 | BUG | `/app/profile/jordanl` | Should `GET /api/profiles/jordanl` | Shows **own** profile |
| PROF-004 | Other user profile | P0 | MISSING | View Jordan | Public profile fields | Connect / Message buttons |
| PROF-005 | Posts tab | P1 | PARTIAL | Posts tab | User’s posts only | Shows global feed slice |
| PROF-006 | About tab | P2 | PASS | About tab | Bio text | From profile |
| PROF-007 | Connections tab | P1 | PARTIAL | Connections tab | `GET /api/connections` | Shows count only; no list |
| PROF-008 | Edit profile button | P1 | DEAD | Click Edit | `/app/profile/edit` or settings form | Redirects to settings with no form |
| PROF-009 | Settings gear | P1 | PASS | Click settings icon | `/app/settings` | — |
| PROF-010 | Connection request (other user) | P1 | DEAD | On Jordan profile | `POST /api/connections/request` | Pending state |
| PROF-011 | Message user | P1 | DEAD | Message button | `POST /api/conversations` | Opens DM thread |
| PROF-012 | Block user | P2 | DEAD | Block action | `POST /api/blocks` | — |
| PROF-013 | Stats accuracy | P1 | BUG | View counts | posts/circles from API | `posts: 0`, `circles: 6` hardcoded in mapper |

**Fixes (P0):** PROF-003, 004; read `params.username`; add BFF `GET /api/profiles/[username]`.

---

## Module 9 — Messages (`MessagesScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| MSG-001 | List conversations | P0 | PASS | `/app/messages` | `GET /api/conversations` | ≥3 threads (Jordan, Sam, Morgan) |
| MSG-002 | Select conversation | P0 | PASS | Click Jordan | `GET /api/conversations/{id}/messages` | Seeded messages visible |
| MSG-003 | Message alignment | P1 | PASS | View thread | `senderUserId === account.id` | Mine right (blue), theirs left |
| MSG-004 | Send message | P0 | DEAD | Type + Send | `POST /api/conversations/{id}/messages` | Message appears; no BFF POST route |
| MSG-005 | New conversation | P1 | DEAD | From profile “Message” | `POST /api/conversations` | New thread |
| MSG-006 | Search messages | P2 | DEAD | Search box | Filter API | — |
| MSG-007 | Empty state | P1 | UNTESTED | User with no DMs | — | “No conversations” |
| MSG-008 | Unread indicator | P2 | DEAD | New message | — | Unread badge in list |
| MSG-009 | Mobile layout | P2 | UNTESTED | Small viewport | — | Thread view accessible |

**Fixes (P0):** Add BFF `POST /api/conversations/[id]/messages` and wire Send button.

---

## Module 10 — Notifications (`NotificationsScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| NOTIF-001 | Load notifications | P0 | PASS | `/app/notifications` | `GET /api/notifications` | 3 seeded items |
| NOTIF-002 | Readable text | P1 | BUG | View items | — | Shows raw `titleKey` strings (acceptable if human-readable) |
| NOTIF-003 | Unread styling | P1 | UNTESTED | Unread items | `readAt: null` | Bold / dot indicator |
| NOTIF-004 | Mark all read | P0 | PASS | Click Mark all read | `POST /api/notifications/read-all` | All `unread: false` |
| NOTIF-005 | Mark single read | P1 | DEAD | Click one notification | `PATCH /api/notifications/{id}/read` | No BFF route |
| NOTIF-006 | Click notification → target | P1 | DEAD | Click reaction notif | Navigate to post | — |
| NOTIF-007 | Empty state | P2 | UNTESTED | User with none | — | Empty message |
| NOTIF-008 | Pagination | P2 | MISSING | Many notifications | `cursor` param | — |

---

## Module 11 — Connections (feed right rail + profile)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| CONN-001 | List accepted connections | P0 | PARTIAL | Feed right rail | `GET /api/connections` | Jordan, Sam, Morgan |
| CONN-002 | Suggestion mapping | P1 | PASS | View names | Other party resolved | Correct display names |
| CONN-003 | Connect button | P0 | DEAD | Click Connect | `POST /api/connections/request` | — |
| CONN-004 | Pending requests UI | P1 | MISSING | Incoming from Priya seed | Accept/decline | Settings or dedicated page |
| CONN-005 | Accept request | P1 | DEAD | Accept Priya | `POST /api/connections/{id}/accept` | — |
| CONN-006 | Remove connection | P2 | DEAD | Remove | `DELETE /api/connections/{id}` | — |
| CONN-007 | Mutual count | P2 | MOCK | View “2 mutual” | From API | Hardcoded `mutual: 2` |

---

## Module 12 — Ava (`AvaScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| AVA-001 | Consent gate | P0 | MOCK | First visit | `GET /api/ai/consent` | Show consent if not accepted |
| AVA-002 | Accept consent | P0 | DEAD | Click accept | `PUT /api/ai/consent` | Persisted; chat unlocked |
| AVA-003 | Send message | P0 | DEAD | Type + send | `POST /api/ai/conversations/{id}/messages` | AI reply |
| AVA-004 | Daily quota display | P1 | MOCK | View counter | `GET /api/ai/quota` | Real count, not `3/50` static |
| AVA-005 | Conversation starters | P1 | DEAD | Click starter chip | `GET /api/ai/conversation-starters` | Prefills input |
| AVA-006 | Delete history | P2 | DEAD | Settings link | `DELETE /api/ai/conversations/{id}` | — |
| AVA-007 | Crisis disclaimer | P0 | PASS | Consent screen | Static copy | Visible |
| AVA-008 | Settings link | P1 | PASS | Footer link | `/app/settings` | — |

**Fixes (P0):** Full Ava integration with existing `/api/ai/*` BFF (add GET consent proxy).

---

## Module 13 — Mood / wellness (`MoodScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| MOOD-001 | Wellness redirect | P1 | PASS | `/app/wellness` | — | Redirect `/app/mood` |
| MOOD-002 | Load trends | P0 | PASS | `/app/mood` | `GET /api/wellness/trends?window=7d` | 7 seeded check-ins |
| MOOD-003 | Chart renders | P1 | PASS | View chart | — | Bars from API or fallback |
| MOOD-004 | Submit check-in | P0 | PASS | Select mood → save | `POST /api/wellness/checkins` | 201; chart updates |
| MOOD-005 | Period toggle 7/30d | P1 | UNTESTED | Switch period | Different `window` param | Refetch trends |
| MOOD-006 | Note on check-in | P2 | UNTESTED | Add note | Encrypted note field | — |
| MOOD-007 | Duplicate same day | P2 | UNTESTED | Two check-ins same day | Upsert behavior | Per API rules |

---

## Module 14 — Events (`EventsScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| EVNT-001 | Load events list | P0 | PASS | `/app/events` | `GET /api/events?from&to&view=list` | Seeded + Welcome Gathering |
| EVNT-002 | Event fields | P1 | PASS | View card | title, date, location, going count | From API |
| EVNT-003 | RSVP going | P0 | DEAD | Click RSVP | `PUT /api/events/{id}/rsvp` | Status “going”; count +1 |
| EVNT-004 | RSVP maybe / not going | P1 | DEAD | Change RSVP | PUT with status | Updates |
| EVNT-005 | Staff create event | P2 | DEAD | Staff button (demo user) | Hidden or 403 | Button visible but dead |
| EVNT-006 | Event detail page | P2 | MISSING | Click event | `/app/events/{id}` route | — |
| EVNT-007 | Cover images | P2 | MOCK | View cards | — | Cycles mock `images.event1/2` |

---

## Module 15 — Resources (`ResourcesScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| RES-001 | Load resources | P0 | PASS | `/app/resources` | `GET /api/resources` | ≥3 items (grounding + 2 demo) |
| RES-002 | Resource metadata | P1 | PASS | View cards | title, kind, access | From API |
| RES-003 | Progress display | P1 | PARTIAL | View progress % | `viewer.progressPercent` | Shown if seeded |
| RES-004 | Open resource | P0 | DEAD | Click Open/Continue | `GET /api/resources/by-slug/{slug}` | Detail view |
| RES-005 | Update progress | P1 | DEAD | Mark complete | `PUT /api/resources/{id}/progress` | — |
| RES-006 | Search resources | P2 | DEAD | Search input | Client filter or API | — |
| RES-007 | Paid resource purchase | P2 | MISSING | Purchase flow | `POST .../purchase-session` | — |

---

## Module 16 — Explore & Settings

### Explore (`ExploreScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| EXPL-001 | Page loads | P0 | PASS | `/app/explore` | Grid of cards |
| EXPL-002 | Card → Search | P1 | PASS | Click Search card | `/app/search` | — |
| EXPL-003 | Card → Circles | P1 | PASS | Click Circles | `/app/circles` | — |
| EXPL-004 | Card → Events | P1 | PASS | Click Events | `/app/events` | — |
| EXPL-005 | Card → Resources | P1 | PASS | Click Resources | `/app/resources` | — |
| EXPL-006 | Card → Ava | P1 | PASS | Click Ava | `/app/ava` | — |
| EXPL-007 | Card → Mood | P1 | PASS | Click Mood | `/app/mood` | — |
| EXPL-008 | Dynamic content | P2 | MOCK | Featured section | API-driven highlights | Static images only |

### Settings (`SettingsScreen`)

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| SET-001 | Page loads | P0 | PASS | `/app/settings` | Section list |
| SET-002 | Profile settings | P0 | DEAD | Click Profile | Form: displayName, bio, avatar | `PATCH /api/profile` |
| SET-003 | Connections settings | P0 | DEAD | Click Connections | Pending requests list | Redirect stub only |
| SET-004 | Sessions | P1 | DEAD | Click Sessions | `GET /api/account/sessions` | List + revoke |
| SET-005 | Ava consent | P1 | DEAD | Click Ava data | `GET/PUT /api/ai/consent` | — |
| SET-006 | Export data | P1 | DEAD | Click Export | `POST /api/account/export` | — |
| SET-007 | Delete account | P1 | DEAD | Click Delete | `DELETE /api/account` | Confirmation flow |
| SET-008 | Blocks | P2 | DEAD | Blocked users | `GET /api/blocks` | — |
| SET-009 | Legacy redirects | P1 | PASS | `/app/settings/data` etc. | → `/app/settings` | — |

---

## Module 17 — Redirects & edge cases

| ID | Title | Pri | Status | Steps | Expected |
|----|-------|-----|--------|-------|----------|
| REDIR-001 | `/app` → feed content | P0 | PASS | Visit `/app` | Same as feed | `FeedScreen` |
| REDIR-002 | `/app/profile/edit` | P1 | PASS | Visit | → `/app/settings` | — |
| REDIR-003 | `/app/wellness` | P1 | PASS | Visit | → `/app/mood` | — |
| REDIR-004 | Ingress-prefixed routes | P1 | UNTESTED | All nav on cloud host | `/_ingress/app/...` works | — |
| REDIR-005 | 404 unknown `/app/foo` | P2 | UNTESTED | Visit | Next.js 404 | — |
| REDIR-006 | Admin from member shell | P2 | N/A | Admin link | Only if admin role | `/admin` |

---

## Module 18 — Mapper & contract unit tests

| ID | Title | Pri | File | Assertion |
|----|-------|-----|------|-----------|
| MAP-001 | `postItemToFeedPost` anonymous | P0 | `mappers.ts` | Maps `displayLabel`, `isAnonymous` |
| MAP-002 | `postItemToFeedPost` comment count | P0 | `mappers.ts` | Uses API comment count when available |
| MAP-003 | `circleSummaryToGroup` join policy | P1 | `mappers.ts` | OPEN→Open, APPROVAL→Request |
| MAP-004 | `profileToCurrentUser` stats | P1 | `mappers.ts` | No hardcoded posts/circles |
| MAP-005 | `notificationToListItem` | P1 | `mappers.ts` | Human-readable text |
| MAP-006 | `connectionToSuggestion` | P1 | `mappers.ts` | Correct “other” party |

---

## Fix roadmap (phased)

### Phase A — Routing & dead links (P0, ~2–3 days agent time)

1. Add `/app/post/[postId]` route; fix `PostCard` links.
2. Fix `/app/profile/[username]` to load `GET /api/profiles/:username`.
3. Add missing BFF proxies:
   - `GET /api/feed/search`
   - `GET /api/profiles/[username]`
   - `GET /api/circles/[id]/feed`
   - `GET/POST /api/posts/[id]/comments`
   - `POST /api/conversations/[id]/messages`
   - `POST /api/conversations`
   - `PATCH /api/notifications/[id]/read`
   - `GET /api/ai/consent`
4. Fix `CircleDetailScreen` to use circle feed endpoint.

### Phase B — Core interactions (P0, ~3–4 days)

1. Post reactions (feed + detail).
2. Post comments (read + create).
3. Messages send.
4. Circle join/leave.
5. Event RSVP.
6. Fix mapper counts and profile stats.

### Phase C — Search, connections, profile actions (P1)

1. Functional search (posts, circles, people).
2. Connection request accept/decline UI.
3. Profile edit form in settings.
4. Message user from profile.

### Phase D — Ava, resources, settings (P1)

1. Full Ava consent + chat.
2. Resource detail + progress.
3. Settings sections (sessions, export, blocks).

### Phase E — Polish & remove mocks (P2)

1. Replace `CircleMomentsRail` with API data.
2. Remove or gate mock fallbacks (fail visibly in dev).
3. Footer legal links; event detail pages.
4. Pagination on feed, notifications.

### Phase F — Test automation (parallel with A–E)

1. Implement `apps/web/test/member/*.spec.mjs` from this document.
2. Add `npm run test:member` script.
3. CI gate: smoke + design + member integration.
4. Optional: Playwright API assertion helper (`expectApiCall`).

---

## Coverage matrix (target 100%)

| Module | Test cases | Automatable | Currently tested |
|--------|------------|-------------|------------------|
| Auth | 10 | 10 | 5 |
| Navigation | 12 | 11 | 4 |
| Feed | 24 | 20 | 3 |
| Composer | 10 | 8 | 2 |
| Post detail | 11 | 10 | 0 |
| Search | 9 | 8 | 1 |
| Circles | 8 | 7 | 2 |
| Circle detail | 12 | 10 | 1 |
| Profile | 13 | 11 | 2 |
| Messages | 9 | 8 | 2 |
| Notifications | 8 | 7 | 2 |
| Connections | 7 | 6 | 1 |
| Ava | 8 | 7 | 1 |
| Wellness | 7 | 6 | 2 |
| Events | 7 | 6 | 1 |
| Resources | 7 | 6 | 1 |
| Explore/Settings | 17 | 14 | 3 |
| Redirects | 6 | 5 | 3 |
| Mappers | 6 | 6 | 0 |
| **Total** | **191** | **166** | **~36 (19%)** |

**Target:** 166 automated E2E/API tests + 25 manual-only (visual/polish) = **100% feature coverage**.

---

## Immediate next actions

1. **Run manual audit** using this checklist against `http://localhost:3000` after `npm run db:seed`.
2. **Start Phase A** (routing + BFF gaps) — highest impact on “feels mock” perception.
3. **Add `test:member`** with FEED-001, POST-001, PROF-003, MSG-004, SRCH-002 as first five automated regression tests.
4. **Track progress** by updating Status column in this doc per module.

---

*Generated from codebase audit: design screens, BFF routes, API e2e phases, and `seed-design-demo.ts`.*
