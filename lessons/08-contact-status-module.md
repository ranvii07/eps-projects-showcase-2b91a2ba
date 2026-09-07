**T1.2 kept the generic lead statuses (new/in_progress/resolved/spam/archived) and centralized them into `src/lib/contact-status.ts` — a pure UI refactor with no DB change, chosen over the sales-pipeline option.**

Decision (user, 2026-07-07, resolving the T1.2 ⛔):

- **Keep the existing generic statuses**; do NOT adopt the sales pipeline
  (`contacted/meeting_scheduled/quotation_sent/won/lost`) and make **no schema
  change**. Because the five values are unchanged, existing `contact_submissions`
  rows stay valid and no migration/CHECK-constraint work is needed (T0.6 confirmed
  `status` has no DB CHECK constraint, so DB-level enforcement was never in play).

What was done:

- New `src/lib/contact-status.ts` is the single source of truth. Exports:
  `STATUS_OPTIONS` (as-const tuple), `ContactStatus` type, `STATUS_STYLES`
  (badge-color map), `statusLabel(s)` (snake→Title formatter), and a new
  `statusStyle(s)` helper centralizing the `?? "text-slate-200"` fallback.
- `admin/contact-management.tsx` deleted its local copies of the first three and
  imports from the module; its two inline `STATUS_STYLES[x] ?? "text-slate-200"`
  expressions became `statusStyle(x)`. Rendered UI is byte-identical.

Design note — how generic (review question, user, 2026-07-07):

- The module is ready for **T1.3** (status-history timeline) and **T5.1**
  (dashboard status badges) to import directly with no changes — they need only
  `statusLabel` / `statusStyle` / `STATUS_OPTIONS` / `ContactStatus`.
- Deliberately withheld speculative additions (`DEFAULT_STATUS`, an
  `isContactStatus()` guard, open-vs-terminal grouping) — no current task needs
  them and each is a one-line additive export when a task does. Principle:
  centralize what exists, grow additively, don't pre-build for imagined needs.

Verification:

- Grep confirms the three constants are declared only in the module and every
  import in the admin page resolves; no dangling `STATUS_STYLES` reference remains.
- Local build NOT run (lesson 02 — Defender blocks `bun install`); verified by
  grep + type reasoning. Defer to Lovable/CI.

Commit: 51475a2 "T1.2: centralize contact lead-status vocabulary into a shared module".
