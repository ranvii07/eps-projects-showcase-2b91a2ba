**T1.3 added a read-only status-history timeline to the enquiry detail dialog — no ⛔ was needed because T0.2 had already confirmed the status-change trigger exists/fires and RLS permits both reads.**

Pre-work verification (why no checkpoint):

- `contact_status_history` has a staff SELECT policy (`is_staff(auth.uid())`), and
  `profiles` is self-read **OR staff-read-all** (`(id = auth.uid()) or is_staff(...)`)
  — both confirmed in the reconstructed baseline (supabase/migrations/2026062800…sql
  lines ~292 and ~296). So the history query and the `changed_by → profiles.full_name`
  join both return data for any staff user. The trigger `log_contact_status_change`
  writes the rows (T0.2/lesson 04), so no trigger creation was required.

What was done (all in admin/contact-management.tsx, additive):

- `HistoryRow` type + `history`/`historyLoading` state; `loadHistory(submissionId)`
  reads `contact_status_history` filtered by `submission_id`, embedding
  `profiles(full_name,email)`.
- A `useEffect` keyed on `viewing?.id` loads history on dialog open and clears it on
  close; a successful in-dialog status change also re-calls `loadHistory` so the new
  transition appears without reopening (the trigger writes the row during the UPDATE).
- Renders a "Status History" block in the detail dialog: `from → to` status badges
  (reusing T1.2's `statusLabel`/`statusStyle`), timestamp + changed-by
  (`full_name || email || "System"`), optional note, with loading + empty states.

Decisions / gotchas:

- **Order:** user chose **newest-first** at review (`created_at` descending) over the
  initial chronological ascending. One-line query flag; render unchanged.
- **Embedded-select typing:** the `profiles(...)` to-one embed's supabase-js TS
  inference is unreliable and `tsc` can't run locally (lesson 02), so the result is
  cast `as unknown as HistoryRow[]` to guarantee the commit compiles. Deliberate, not
  sloppy — flagged for the Lovable/CI build to confirm.
- **statusStyle("")** on a null `from_status` returns the neutral `text-slate-200`
  fallback and the badge shows "—"; confirms T1.2's `statusStyle` was worth centralizing.

Verification:

- Local build NOT run (lesson 02); verified by read-through + type reasoning + RLS check.
- Runtime verification (open an enquiry with a changed status → timeline shows
  transitions newest-first with name/timestamp; untouched enquiry shows "No status
  changes yet.") is PENDING in Lovable, bundled with T1.1's pending runtime check.

Commit: 115b196 "T1.3: show status-history timeline in the enquiry detail dialog".
