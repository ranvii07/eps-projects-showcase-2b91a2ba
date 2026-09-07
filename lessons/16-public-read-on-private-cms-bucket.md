**A public page that renders images from a PRIVATE storage bucket via `createSignedUrl` needs a bucket-scoped `anon` SELECT policy on `storage.objects` — otherwise anonymous visitors cannot mint signed URLs and images silently never load (names/text still render). The bucket stays private; only read is opened, and only for that one bucket.**

## Context (T3.10 infra, 2026-07-11)

The CMS image buckets (`client-images`, `project-images`, `documents`) are all
**private** (`storage.buckets.public = false`) and, until now, had **only staff
policies** on `storage.objects` (all `TO authenticated` + `is_staff`, from
`20260630074609`). The public renderers use `useSignedUrl`/`SignedImage`
(`createSignedUrl`) — which authorizes against `storage.objects` RLS **as the
caller's role**. For an anonymous visitor that role is `anon`, which had no
matching SELECT policy → `createSignedUrl` is denied → logos never appear.

This had never surfaced because the `clients` table was empty (0 rows), so no
logo path had ever been exercised publicly. T3.10 was the first task to hit it.

## Fix (migration `20260711000000_client_images_public_read.sql`)

A single bucket-scoped read policy, matching the existing content-table
"public read" convention (`TO anon, authenticated`):

```sql
create policy "Public can read client logos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'client-images');
```

- Bucket stays **private**; the `createSignedUrl` flow is unchanged (no frontend edit).
- Scoped to `client-images` ONLY — `project-images`/`documents` stay staff-only.
- SELECT only — no anon INSERT/UPDATE/DELETE, so uploads/writes remain staff-only.
- Client logos are public brand marks, so anon read of that one bucket is acceptable;
  the policy is bucket-scoped, not row-joined to `clients.published`.

## Two prerequisites for signed URLs to work as anon (both required)

1. A **matching RLS SELECT policy** for `anon` (this migration).
2. The **table-level GRANT**: `has_table_privilege('anon','storage.objects','SELECT')`
   must be true — it already is (Supabase default). Policy without grant = "permission
   denied for table objects"; grant without policy = 0 rows. Verified both, plus
   `relrowsecurity = true`, via `query_database`.

## How to apply / verify (no local runtime — lesson 02)

- Migration file is idempotent (`drop policy if exists` + `create policy`), so it is
  safe whether applied by the Lovable sync or run directly. It was also applied live
  via the `query_database` MCP so the policy could be verified this session.
- Verify with `pg_policies` (the only `anon`-roled policy is SELECT scoped to
  `client-images`) + `has_table_privilege`. End-to-end signed-URL render against a real
  object is confirmed once a logo exists (seed step).

## Applies next: T3.11 (projects)

`project-images` is the **same setup** (private bucket, staff-only policies) and the
public `/projects` page renders images via the same signed-URL flow. It will need the
**identical anon-read policy for `project-images`** before project images show publicly.
Do not make the buckets public and do not open the other buckets — add one bucket-scoped
anon SELECT policy per public-image bucket.
