# Database Architecture Review (T0.6)

**Date:** 2026-07-07 · **Method:** read-only Lovable introspection (T0.2) + code cross-check.
**Scope:** does the live schema support Blueprint Phases 1–7? **Verdict: YES — no schema change is required for launch.** Details below.

Legend: ✅ verified · ⚠ observation (non-blocking) · ⛔ change would be destructive (propose only).

## Verdict matrix (Blueprint T0.6 checks a–g)

| #   | Check                                                                     | Verdict   | Evidence / notes                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| a   | Contact status-change trigger + `handle_new_user()` exist and fire        | ✅        | `contact_status_history_trg` AFTER UPDATE on `contact_submissions` → `log_contact_status_change()` (SECURITY DEFINER, inserts only when `status` changes). `on_auth_user_created` AFTER INSERT on `auth.users` → `handle_new_user()` (inserts profile, on-conflict-do-nothing). Both present in live catalog.                                             |
| b   | Buckets match admin `BUCKET` constants + storage policies cover all three | ✅        | Buckets `project-images`, `client-images`, `documents` all exist and are **private** (`public=false`). Admin constants: projects.tsx=`project-images`, clients.tsx=`client-images`, credentials.tsx=`documents` — exact match. `storage.objects` has staff SELECT/INSERT/UPDATE/DELETE policies scoped to those three buckets (migration 20260630074609). |
| c   | `contact_submissions`: anon INSERT / staff SELECT-UPDATE-DELETE           | ✅        | `submissions public insert` (anon,authenticated, `with_check true`); `submissions staff select/update` (authenticated, `is_staff`); `submissions staff delete` (`is_staff`). RLS enabled. Unblocks T1.1.                                                                                                                                                  |
| d   | `user_roles` self-read policy (needed by T5.2)                            | ✅        | `user_roles self or staff select`: `(user_id = auth.uid()) OR is_staff(auth.uid())`. Client-side role check in T5.2 is feasible; INSERT/DELETE are admin-only (`has_role(...,'admin')`).                                                                                                                                                                  |
| e   | Unused columns dispositioned                                              | see below | No drops proposed.                                                                                                                                                                                                                                                                                                                                        |
| f   | Enum `app_role` covers the role model                                     | ✅        | `(director, coo, admin)`. `is_staff()` = "has any role"; `has_role()` = specific role. Matches the Director/COO/Admin model in the Blueprint.                                                                                                                                                                                                             |
| g   | No table required by §2.4's CMS-managed set is missing                    | ✅        | CMS-managed set (services, clients, projects, faq, hse_content, company_credentials) all exist with `published`+`sort_order`. `contact_submissions`(+history) present. Hardcoded set (Material Supply, Industries, Stats, Hero, Vision/Mission, Contact roster) is intentionally not in the DB.                                                           |

## (e) Unused-column dispositions

| Column                                                                          | Current use                                                                            | Disposition                                                                                            |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `faq.category`                                                                  | Not shown in UI                                                                        | **Keep / use** — T2.2 may group by it. No change.                                                      |
| `hse_content.section`                                                           | `NOT NULL`, fetched but not used to group in About.tsx                                 | **Keep** — natural grouping key for the future T2.3 `/hse` page.                                       |
| `projects.client` / `location` / `status` / `project_value` / `completion_date` | Fetched in admin; public `/projects` currently hides client/location/status/value/date | **Keep** — admin captures them; public display is a content/design decision (T3.11). No schema change. |
| `contact_submissions.company`                                                   | DB column exists; public form never sets it                                            | **Use** — T1.1 adds the missing `company` input. No schema change (column already present).            |
| `contact_submissions.source`                                                    | DB default `'website'`; form doesn't set it                                            | **Keep** — default already yields `'website'`; T1.1 may set it explicitly. No change.                  |

## Change proposals

**None required for launch.** The schema fully supports Phases 1–7 as-is. Items to keep in mind (not actioned here):

1. **T1.2 status vocabulary (⛔ if constrained at DB level).** `contact_submissions.status` is free `text` with default `'new'` and **no CHECK constraint**. Changing the status vocabulary needs _no_ DB change if enforced app-side. If the user later wants DB-level enforcement (CHECK or enum), that is a Lovable schema change and stays behind T1.2's ⛔ — propose, don't execute.
2. **Indexes (⚠ P2, additive).** Only PKs + `user_roles(user_id,role)` unique exist. No indexes on FK columns (`contact_status_history.submission_id`/`changed_by`, `user_roles.user_id`) or on `published`/`sort_order` used by public reads. **Fine at current volume (≤ dozens of rows).** If any table grows to thousands, add indexes via a reviewed Lovable migration. Not needed for launch.
3. **`contact_status_history` write path.** No INSERT policy by design — rows are written only by the SECURITY DEFINER trigger. Correct; T1.3 reads via the staff SELECT policy. No change.

## Cross-check against plan.md (from lesson 04)

- Content public-read policies are **stricter** than plan.md documented (`published OR is_staff` vs `USING (true)`) — keep the stricter live version.
- `contact_status_history` protection is trigger + no-INSERT-policy, not a "service_role-only grant"; grants are Supabase blanket defaults, so **RLS is the sole security boundary** — all policies verified present and correct.

## Bottom line

The database is production-ready for the Blueprint's scope. No migration is proposed by this review. The only DB-touching decisions ahead are user-gated: T1.2 (optional status constraint) and any future indexing — both additive/reviewed, both behind their existing checkpoints.
