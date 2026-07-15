# Decisions

## What I changed and why

### Critical security fixes

**SQL injection** — Every endpoint in `server/src/index.ts` used string interpolation
(`'${userInput}'`) in SQL queries. An attacker could submit `'; DROP TABLE ...` as a
search term, status filter, or route param. Converted all dynamic queries to
parameterised `?` bindings. This was the most important fix in the entire codebase.

**JWT verification bypass** — `auth.ts` used `jwt.decode()` which base64-decodes the
token without verifying the HMAC signature. Anyone could forge a token with arbitrary
user identity. Changed to `jwt.verify(token, secret)`. Also moved the hardcoded secret
into `process.env.JWT_SECRET` so it's no longer baked into the source.

**XSS** — Messages, AI summaries, and internal notes were rendered via
`dangerouslySetInnerHTML`. Customer-submitted feedback could contain `<script>` tags
that would execute in the browser of every agent who viewed it. Changed all three to
React text interpolation.

### Functional bugs

**Pagination** — `offset = page * PAGE_SIZE` skipped the first page (offset started at
10 instead of 0). Fixed to `(page - 1) * PAGE_SIZE`.

**Stale closure in polling** — The 45-second auto-refresh closed over the initial items
array, so status changes were silently discarded on every poll. Changed to functional
`setItems(prev => ...)` and added the missing effect dependencies.

**CSV export** — Auth token was passed as a URL query parameter, leaking in server logs
and referrer headers. Switched to `Authorization` header via fetch + blob download.

**Status toggle not removing items from filtered view** — When toggling status while a
filter was active, items stayed visible until a manual refresh. Now they're filtered out
immediately after the optimistic update.

**Fake summarizer** — Returned the exact same static string for every item. Replaced with
a heuristic summariser that detects category and sentiment from the message content.

### UX improvements

**UI redesign** — The original Comic Sans / neon / rainbow / blinking-animation theme was
intentionally absurd for the demo but unusable for real work. Replaced with a clean,
neutral palette, system font stack, proper spacing, rounded corners, and semantic colours
(red for urgent, green for resolved, etc.).

**Sticky table header + pager** — The table now scrolls internally with a fixed header
and fixed pagination bar, so page controls are always visible without scrolling the full
page.

**Error handling** — Added `fetchOrThrow()` that validates response status. On 401,
auto-clears session and redirects to login. Added loading/error states to the inbox.

**Confirmation dialogs** — Added `window.confirm()` before logout, resolve/reopen, and
routing changes to prevent accidental destructive actions.

**Priority filter** — Added a dropdown to filter by priority alongside the existing
status and search filters.

### What I chose not to touch

**Plaintext passwords** — Fixing this requires `bcrypt` (a new dependency). It's
important but was deprioritised because the immediate attack vector is SQL injection
and JWT forgery, not credential theft from the database.

**TypeScript `any` types** — Prevalent across the entire codebase. Converting fully is
an architectural effort that touches every file and every route handler. I left it alone
to keep changes scoped and verifiable.

**Seed data CSV injection** (`=HYPERLINK(...)`) — This is in the seed data file, not
application code. It's a demo data concern, not a production vulnerability.

**No tests** — The project had no test framework. Adding tests from scratch would exceed
the time budget and is better done as infrastructure work with the team's chosen tools.

**Input validation** — The assignment endpoint accepts arbitrary `assignee_id` values
without checking they correspond to real users. Worth adding, but the main validation
gap (SQL injection) is now closed.

**Rate limiting / HTTPS / production hardening** — These are deployment concerns, not
codebase issues. They belong in the deployment infrastructure.
