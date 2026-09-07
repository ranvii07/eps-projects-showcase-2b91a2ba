# Admin CMS — CRUD Audit (T7.1)

Static end-to-end audit of the seven admin surfaces. Each manager was read in
full for how every operation wires to Supabase (table, columns, storage bucket)
and whether every field round-trips (`rowToForm` → form → `formToPayload` →
insert/update, and back on reload). RLS staff-write access was confirmed in T0.2.

**Legend:** ✅ verified by code wiring · ⏳ needs a live authenticated session to
confirm end-to-end (admin write → visible on public page) · ➡️ follow-up logged to
the owning task · N/A not applicable to this surface.

**Live limitation:** admin routes require the user's authenticated session, and the
local runtime is blocked (Defender EPERM, lesson 02), so "reflects on public page"
cells are ⏳ — verified by wiring here, to be confirmed on a deployed/authenticated
run. No app code was changed by this audit (no trivial defects found; the issues
found belong to T7.2/T7.5 by the Blueprint's own scoping).

## Matrix (manager × operation)

| Manager (table)                                             | Create                        | Edit                    | Delete                                | Publish toggle      | Sort order | Upload / replace / remove                                                      | Field round-trip                                           | Reflects on public      |
| ----------------------------------------------------------- | ----------------------------- | ----------------------- | ------------------------------------- | ------------------- | ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------- | ----------------------- |
| **projects** (`projects`, bucket `project-images`)          | ✅ insert                     | ✅ update               | ✅ delete + storage remove (L210-212) | ✅ Switch in dialog | ✅ numeric | ✅ upload; replace removes old (L174-176); delete removes (L210-212) ➡️T7.5    | ✅ all 11 cols                                             | ⏳ `/projects`          |
| **clients** (`clients`, bucket `client-images`)             | ✅ insert                     | ✅ update               | ✅ delete + storage remove (L179)     | ✅ Switch           | ✅ numeric | ✅ upload; replace removes old (L143); delete removes (L179) ➡️T7.5            | ✅ all 5 cols                                              | ⏳ `/clients` + banner  |
| **services** (`services`)                                   | ✅ insert                     | ✅ update               | ✅ delete                             | ✅ Switch           | ✅ numeric | N/A                                                                            | ✅ all 5 cols (title/description/icon_name/sort/published) | ⏳ `/services` + home   |
| **faq** (`faq`)                                             | ✅ insert                     | ✅ update               | ✅ delete                             | ✅ Switch           | ✅ numeric | N/A                                                                            | ✅ all 5 cols (requires question+answer)                   | ⏳ home FAQ section     |
| **hse** (`hse_content`)                                     | ✅ insert                     | ✅ update               | ✅ delete                             | ✅ Switch           | ✅ numeric | N/A                                                                            | ✅ all 5 cols (requires section)                           | ⏳ About QHSE block     |
| **credentials** (`company_credentials`, bucket `documents`) | ✅ insert                     | ✅ update               | ✅ delete + storage remove (L202)     | ✅ Switch           | ✅ numeric | ✅ upload; replace removes old (L166); delete removes (L202); openSignedUrl ✅ | ✅ all 9 cols                                              | ⏳ footer CIN/PAN/GSTIN |
| **contact-management** (`contact_submissions`)              | N/A (public form owns create) | ✅ status update (L128) | ✅ delete (L149)                      | N/A                 | N/A        | N/A                                                                            | ✅ status + status-history timeline (T1.3)                 | N/A (internal)          |

## Notes per operation

- **Create / Edit** — every manager branches `editing ? update().eq("id") : insert(payload)`
  on the same `formToPayload`, so create and edit share one code path and one field set.
- **Delete** — all use `.delete().eq("id", target.id)` behind an `AlertDialog`
  confirmation; the three uploading managers also remove the storage object after a
  successful row delete (no orphaned file on delete).
- **Publish toggle** — toggled via the edit dialog's `Switch` (not an inline list
  toggle); the list shows a read-only Live/Draft badge. Works; consistent everywhere.
- **Sort order** — numeric `<input type="number">`; lists `.order("sort_order")`.
- **Field round-trip** — `rowToForm`/`formToPayload` cover every column of each row
  type (checked field-by-field for all seven); no form field is dropped before insert
  and no column is unmapped on reload.

## Follow-ups (larger issues logged, NOT fixed here — owned by later tasks)

- **➡️ T7.5 (upload hygiene): replace-then-cancel orphan.** In projects/clients/
  credentials, `handleUpload` deletes the _previous_ storage object immediately on a
  new upload (before the form is saved). If the user replaces an image/document and
  then clicks Cancel, the row still references the just-deleted object → broken image /
  missing document. The remove _fires_ (as T7.5 asks to verify), but the timing orphans
  the reference on cancel. Fix belongs to T7.5 (defer object removal to save, or restore
  on cancel).
- **➡️ T7.5 (upload validation): no client-side type/size check.** Uploads accept
  `image/*` (projects/clients) or any file (credentials) with no max-size guard before
  hitting storage. T7.5 owns accepted-type + max-size validation.
- **➡️ T7.2 (validation): numeric bounds.** `sort_order` and `project_value` accept any
  number (including negative) with no bound/format enforcement beyond `Number.isFinite`.
  T7.2 owns zod bounds per manager.

## Verdict

All seven managers are correctly wired for their applicable CRUD operations with full
field round-trip; **no trivial defects required an inline fix**. The three issues found
are non-trivial and fall to T7.2/T7.5 by the Blueprint's own task scoping, logged above.
Build stays green (no code change; CI `verify.yml` is the runtime gate). The ⏳ public-
reflection cells are the only items pending a live authenticated/deployed run.
