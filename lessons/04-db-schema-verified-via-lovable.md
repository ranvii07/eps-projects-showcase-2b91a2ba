**The live DB schema was verified via Lovable read-only introspection (T0.2) and matches types.ts exactly; plan.md Part D is accurate except two points — public-read policies are stricter than documented, and contact_status_history is protected by trigger+RLS, not a service_role-only grant.**

Method: `query_database` (Lovable MCP) read-only SELECTs against pg_catalog /
information_schema / pg_policies on 2026-07-07. No Supabase CLI. Result captured
in `supabase/migrations/20260628000000_baseline_schema_reconstructed.sql` (a
NON-executable reconstructed baseline — every object already exists in prod).

Confirmed (all from live catalogs, nothing inferred):

- 10 public tables + columns/types/defaults/nullability — **identical to types.ts**
  (validates the Blueprint §4 assumption that types.ts is fresh).
- Enum `app_role = (director, coo, admin)`.
- Functions: `handle_new_user`, `has_role`, `is_staff`, `log_contact_status_change`,
  `touch_updated_at` — first four SECURITY DEFINER with `search_path=public`.
- Triggers: `on_auth_user_created` on auth.users (→ handle_new_user);
  `contact_status_history_trg` AFTER UPDATE on contact_submissions
  (→ log_contact_status_change); `*_touch` BEFORE UPDATE on all mutable tables.
- RLS enabled on all 10 public tables.
- Policies: content tables = `(published = true OR is_staff())` public read +
  `is_staff()` staff write (FOR ALL). contact_submissions = anon INSERT
  (with_check true), staff SELECT/UPDATE/DELETE. contact_status_history = staff
  SELECT only (no INSERT policy). profiles = self select (+staff) / self update.
  user_roles = self-or-staff select, admin-only insert/delete.
- Storage: buckets project-images / client-images / documents all PRIVATE, no
  size/MIME limits; their storage.objects policies live in migration 20260630074609.

Discrepancies vs plan.md Part D:

1. plan.md said content public-read = `SELECT ... USING (true)`. **Reality is
   stricter:** `USING (published = true OR is_staff(auth.uid()))` — anon sees only
   published rows. Reality is better than the plan; keep it.
2. plan.md said contact_status_history writes are guarded by "service_role grant
   only". **Reality:** grants are Supabase's blanket defaults (ALL to anon/
   authenticated/service_role on every table), so grants are NOT the boundary —
   protection comes from having no INSERT policy + the SECURITY DEFINER trigger.
   Everything else in Part D matches.

Unblocks / informs later tasks:

- **T1.1** — anon INSERT policy confirmed; also `contact_submissions.source` has a
  DB DEFAULT 'website', so an explicit source is optional (still fine to set).
- **T1.2** — `status` is free text with DEFAULT 'new'; **no CHECK constraint**, so a
  status-vocabulary change needs no DB constraint change (app-level only, unless
  we choose to add one — which would be a Lovable schema change ⛔).
- **T1.3** — the status-change trigger + history table exist and fire.
- **T5.2** — `user_roles` self-read policy exists, so a client-side role check is
  feasible; RLS remains the real boundary.
- **T7.5** — buckets have no server-side size/MIME limits; client-side validation
  is the only guard.

Security posture (Blueprint §2.1 #6 / §4): grants are blanket defaults and the
app has no server-side authz, so **every RLS policy is the production security
boundary** — they are all present and correct as of this verification.
