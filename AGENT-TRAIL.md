# Agent Trail

## Tools used

- **Code editor**: opencode (CLI-based agent with file read/write/edit, bash, grep, glob, web fetch/search)
- **Model**: deepseek-v4-flash-free

## Prompts and responses

### 1. Initial setup
**User:** "follow the instructions in the readme.md file to run the project. i already did the first step"

**Agent:** Ran `cp .env.example .env` for server and web, then `npm run seed`, then explained the project is Pulse — a customer feedback inbox.

---

### 2. Understanding the challenge
**User:** Shared the full challenge text (RULES.md + description). Asked to understand the requirements and make Pulse shippable in 3-4 hours.

**Agent:** Read the entire codebase (server/src/*.ts, web/src/**/*.tsx, configs). Identified critical issues: SQL injection, JWT bypass, XSS, pagination bug. Created a todo list and started fixing.

---

### 3. Security fixes
**User:** Approved proceeding with fixes.

**Agent:** 
- Converted 6 SQL injection points to parameterised queries (`server/src/index.ts`)
- Changed `jwt.decode()` to `jwt.verify()` with env-based secret (`server/src/auth.ts`)
- Removed `dangerouslySetInnerHTML` from 3 locations (`web/src/components/ItemDetail.tsx`)
- Fixed pagination offset bug
- Removed token-from-URL CSV export
- Removed unused `x-llm-key` header

---

### 4. "The table is empty, I don't see any records"
**User:** Reported "Failed to load feedback" and empty table.

**Agent:** Traced to JWT fix — old token in localStorage was signed with the old hardcoded secret, now fails verification with `.env` secret. Added auto-logout on 401 and safe `localStorage` parsing.

---

### 5. AI summarizer + confirmation dialogs
**User:** Noticed summarizer returns same text for all records. Asked for confirmation dialogs.

**Agent:** Rewrote `fakeSummarize()` to analyse message content (category + sentiment). Added `window.confirm()` before logout, resolve/reopen, and routing changes.

---

### 6. UI redesign
**User:** "The UI is messy and has bad UX" — listed issues: page jumps on pagination, cursor, bright colours, moving background, fast banner.

**Agent:** Rewrote entire `styles.css` — removed Comic Sans, neon colours, animations, crosshair cursor. Clean neutral palette with semantic colours. Sticky table header + pager. Removed marquee animation (kept as static notice bar).

---

### 7. "I need to scroll to reach Previous/Next buttons"
**User:** Pagination requires scrolling and page jumps on load.

**Agent:** Made `.table-wrapper` have `max-height: calc(100vh - 260px)` with `overflow-y: auto`. Made `thead` and `.pager` sticky inside the wrapper. Added `scrollTo(0,0)` on page change instead of `scrollIntoView`.

---

### 8. Priority filter dropdown
**User:** "Add a dropdown to filter by priority."

**Agent:** Added `priorityFilter` state, `<select>` dropdown, passed through `api.ts` to server, added `WHERE priority = ?` condition on the backend.

---

### 9. "Status toggle doesn't remove items from filtered view"
**User:** Changing status while filter is active keeps item visible until refresh.

**Agent:** Added `filterItems()` helper that removes items not matching the active filter after optimistic update. Also calls `load()` in background after server confirms.

---

### 10. Deliverables
**User:** Asked for commit messages, then for the required deliverable files.

**Agent:** Created `DECISIONS.md`, `KNOWN-ISSUES.md`, `PRODUCT-NOTE.md`, `AGENT-TRAIL.md`.

---

## Key decisions made without asking

| Decision | Rationale |
|---|---|
| Prioritised SQL injection over password hashing | SQL injection is exploitable immediately; password hashing needs a new dep (bcrypt) |
| Rewrote entire CSS instead of patching | The original design was intentionally absurd; incremental fixes would leave it inconsistent |
| Sticky table over pagination at bottom of page | Keeps page controls always visible without scrolling |
| Removed `dangerouslySetInnerHTML` | User-submitted content must never be rendered as raw HTML |
| Heuristic summarizer over static string | Even the fake mode should produce believable per-item output |
