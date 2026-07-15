# Product Note — Two-Week Plan

## What I'd build next

**1. Notifications & assignments** — The biggest gap is that agents have no reason to
come back. Add browser notifications (or daily digest emails) when new high-priority
feedback arrives, when something is assigned to them, or when a due date is approaching.
This turns Pulse from a "check it when you remember" tool into something that actively
surfaces what matters.

**2. Collaboration features** — Internal notes exist but feel bolted on. Threaded
replies, @mentions with notifications, and a simple activity feed per feedback item
would make Pulse the central place the team discusses customer issues instead of Slack.

**3. Customer 360** — The customer profile sidebar shows recent history and health score.
Expand it: show plan changes, payment history, support ticket count over time, and
a sentiment trend chart. The goal is to give the agent everything they need to
understand the customer without switching tabs.

**4. Bulk actions** — Select multiple feedback items and resolve, reassign, or change
priority in one action. This is the most common workflow ask for a support inbox and
it's currently missing.

## What I'd cut

**The AI Summarize feature** — It's a demo hook, not a real product feature. The fake
summariser returns heuristics, and the real LLM integration has no guardrails (no
prompt injection protection, no cost controls, no rate limiting). In a two-week window,
I'd disable the summarise button and use that time on the notification and
collaboration work instead. When we do ship AI features, they should solve a specific
problem (e.g., "suggest a reply based on similar past tickets") rather than a generic
"summarise this" button.

## Metrics to watch

- **Time to first response** — how long between feedback creation and an agent's first
  note or status change.
- **Backlog age** — how many items are past their due date.
- **Assignee balance** — are items evenly distributed or is one agent overloaded?
