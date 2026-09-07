**T1.1 hardened ContactForm.tsx with zod, a company field, a honeypot, and source="website" — a pure client-side change on the unchanged anon-INSERT path, so it carries no RLS/schema risk.**

Context (2026-07-07):

- The public form already inserted into `contact_submissions` (lesson 01); T1.1
  was hardening, not wiring. Anon INSERT + staff SELECT/UPDATE/DELETE on the
  table were confirmed live in T0.2, so the insert path was known safe before
  editing — no ⛔ needed.
- `contact_submissions` already had `company` and `source` columns (types.ts
  Insert), both nullable — so mapping them required no schema change.

What was done:

- Added `contactSchema` (zod) mirroring the `admin.login.tsx:12` pattern:
  name req ≤100, email req/valid ≤255, message 10-5000; phone/subject/company
  optional with max lengths. `safeParse` maps issues to per-field error state
  rendered as red text under each input (satisfies the "field-level messages"
  acceptance criterion — the login page only toasts the first issue, this goes
  further because T1.1 asked for it).
- Added the `company` input mapped to the existing column.
- Reconciled required-_ labels with real validation: `_`+ HTML`required`now
only on name/email/message; phone/subject/company are truly optional (the old
form marked phone/subject`\*`+required while JS ignored them — a real mismatch).
- Honeypot: a `hidden` + `aria-hidden` + `tabIndex=-1` decoy input named
  `website`, kept in its own state. If filled, the form shows the normal success
  toast and resets but writes nothing — bots get no signal they were dropped.
- Set `source: "website"` on the insert; trimming now comes from zod `.trim()`
  on `parsed.data` (same result as the old inline `.trim()`).

Decisions / corrections during review (user, 2026-07-07):

- **Field order is a review criterion.** I first inserted `company` 3rd (grouping
  identity fields); the user required the original order preserved, so `company`
  was appended LAST: Name, Email, Phone, Subject, Company. Lesson: when a task
  touches an ordered, design-locked list, default to appending, and call out any
  reordering explicitly in the review gate rather than treating it as free
  implementation judgment.
- All existing `data-testid`s were preserved; only additive ones were added
  (`contact-input-company`, `contact-error-*`).

Verification:

- Local build NOT run (lesson 02 — Defender blocks `bun install`); verified by
  type-level reasoning against tsconfig (`strict` on, `exactOptionalPropertyTypes`
  off, so the `[name]: undefined` error-clear is fine) and the `contact_submissions`
  Insert shape. Defer to Lovable/CI build.
- DoD's live test (submit real enquiry → visible in /admin/contact-management with
  source=website + company → delete) is user-performed in the Lovable preview,
  pending at commit time. If it surfaces an issue, fix in a follow-up patch.

Commit: 09a2655 "T1.1: harden public contact form (zod, company field, honeypot, source)".
