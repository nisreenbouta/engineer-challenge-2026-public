


## What this is

Pulse a small internal customer-feedback inbox for support teams. Agents log in,
browse feedback across channels, open items to read the message and customer details,
resolve/reopen them, route (assignee/priority/due date), add internal notes, view
metrics, search, export CSV, and generate an AI summary of a message.

This is a take-home challenge repo. The app was built fast with an AI agent it runs on
the happy path but is not production-ready. The job is to make it genuinely shippable for
a paying client: real users, real load, untrusted input.

## Stack & layout

- server/ — Node + Express + TypeScript API, SQLite via better-sqlite3.
  - index.ts routes · auth.ts JWT/auth · db.ts connection · llm.ts summarizer · seed.ts seed data
- web/ — React + TypeScript SPA (Vite). api.ts client · components/ views.
- npm workspaces. npm run dev runs both (API :4000, web :5173). npm run seed seeds.

## How I want you to work

- Understand before changing. Read the relevant code and trace data flow end to end
  before editing. Don't pattern-match fixes.
- Verify, don't assume. Confirm a bug against the actual code before fixing it, and
  check your fix actually works — don't just claim it does. Flag anything you couldn't verify.
- Ask before big moves. Small, obvious fixes: go ahead. Architectural changes,
  new dependencies, or anything that reshapes the codebase: propose it and wait.
- Explain your reasoning. For each change, say what was wrong and why the fix is
  right. I have to defend every decision in an interview, so no black boxes.
- Scope tightly. Prefer the smallest change that fixes the actual problem. Don't
  gold-plate, don't refactor unrelated code, don't add features nobody asked for.
- Leave a clean base. Changes should make it easier for the next engineer, not just
  patch the demo. Match existing style and conventions.

## Standards

- Security first: parameterized SQL only, verify (never just decode) JWTs, no secrets in
  source or shipped to the client, never render untrusted input as raw HTML.
- Validate input at the API boundary. Handle error paths (network, LLM, DB) explicitly.
- TypeScript: prefer real types over any. 
- UI/UX matters, keep the ui user-centered always but also fast at rendering

## Commits

Don't commit or push unless I ask.