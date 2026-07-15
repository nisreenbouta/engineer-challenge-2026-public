# Known Issues

## Remaining bugs

1. **Total count not updated after resolve/reopen** — When toggling status from the
   inbox list, the total item count and page count don't update to reflect the new
   filter match until the next server fetch. The background `load()` call does sync
   eventually, but there's a brief inconsistency. Fix: update the total count locally
   after the optimistic toggle, or disable optimistic updates and always wait for the
   server.

2. **No feedback when resolve/reopen fails** — The catch block reverts the optimistic
   update silently. The user has no indication that the server rejected their change.
   Fix: surface the error via the existing error state.

3. **Metrics don't refresh after resolve** — The metrics strip shows stale data until
   the page is reloaded or the 45-second poll fires (which only refreshes the inbox,
   not the metrics). Fix: re-fetch metrics after a successful resolve/reopen.

4. **Search is trigger on every keystroke** — The `search` state updates on every
   keystroke, firing a new API call. No debounce. Fix: add a ~300ms debounce to the
   search input.

## Not implemented (would do with another day)

5. **Input validation on assignment** — The `POST /feedback/:id/assignment` endpoint
   accepts any `assignee_id` without verifying the user exists. Fix: validate
   `assignee_id` against the users table.

6. **Password hashing** — Passwords are stored and compared in plaintext. Fix: use
   `bcrypt` to hash on seed and verify on login.

7. **TypeScript strictness** — Most of the server code uses `any` types liberally,
   defeating type checking. Fix: add proper types for query results, request bodies,
   and response shapes.

8. **No loading state on detail view** — The `ItemDetail` component shows a blank
   "Back to inbox" button until the data loads. Fix: add a loading skeleton or spinner.

9. **Optimistic race condition in detail view** — `ItemDetail.onResolve` doesn't
   revert on API failure (unlike the inbox list version). Fix: add try/catch with
   revert.

10. **No CSRF protection** — The API uses `cors()` with default settings (no origin
    restriction). For a real deployment the CORS config should be tightened.

11. **No request logging** — The server has `console.error` scattered throughout but
    no structured logging. Fix: add a logger (pino/winston) for request tracing and
    error aggregation.

12. **Seed data has no `updated_at` timestamps** — The feedback and notes tables lack
    `updated_at` columns, making it impossible to track when a record was last modified.
