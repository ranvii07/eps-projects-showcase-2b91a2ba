# Storage Hygiene — Upload Lifecycle & Orphan Review (T7.5)

Reference for the three private Supabase Storage buckets the admin CMS writes to, how
objects map to database columns, and how to find/remove orphaned objects.

## Buckets ↔ referencing column

| Bucket           | Path prefix    | DB column                                 | Manager                 |
| ---------------- | -------------- | ----------------------------------------- | ----------------------- |
| `project-images` | `projects/`    | `public.projects.image_url`               | `admin/projects.tsx`    |
| `client-images`  | `clients/`     | `public.clients.logo_url`                 | `admin/clients.tsx`     |
| `documents`      | `credentials/` | `public.company_credentials.document_url` | `admin/credentials.tsx` |

All three buckets are **private**; the public site and admin render them through short-lived
signed URLs (`src/lib/use-signed-url.ts`, T0.3). The DB column stores the object **path within the
bucket** (e.g. `projects/2f9c…​.png`), not a URL. Uploads are named `<{prefix}>/<uuid>.<ext>`.

## Upload lifecycle (how orphans are prevented — T7.5)

Each manager's edit dialog tracks a `pendingUpload` — the path of an object uploaded in the current
dialog session that has **not yet been persisted** to the DB. Cleanup is deferred to the outcome so
no flow leaves an orphaned object **or** a dangling DB reference:

- **Upload** (`handleUpload`): validate type/size client-side first (`src/lib/upload.ts`), upload the
  new object, then remove only a _prior_ `pendingUpload` from this same unsaved session (so repeated
  re-uploads before saving don't pile up). The previously **saved** object is left untouched.
- **Save** (`handleSave`, on success): the new object is now referenced by the row, so the object it
  **replaced** (`editing.<col>`, if it changed) is removed, and `pendingUpload` is cleared.
- **Cancel / Esc / overlay / X** (`closeDialog`): the uploaded-but-unsaved object is removed; the
  original saved object is kept (the row still validly points at it).
- **Delete** (`handleDelete`): the DB row is deleted first, then its object is removed.

Result: a replace-then-cancel keeps the original file and discards the new one; a replace-then-save
discards the original and keeps the new one. Neither leaks.

## Manual orphan-review procedure

Run periodically (or after any interrupted/aborted admin session) to catch stragglers — e.g. an
object uploaded when the browser closed before `closeDialog` could fire.

For each bucket:

1. **List stored objects** — Supabase Dashboard → Storage → the bucket (or the Storage API
   `storage.from('<bucket>').list('<prefix>')`). Note each object's full path and `created_at`.
2. **List referenced paths** — read-only query against the referencing column (via the Lovable
   `query_database` MCP; no writes):

   ```sql
   -- project-images
   select image_url    from public.projects            where image_url    is not null;
   -- client-images
   select logo_url     from public.clients             where logo_url     is not null;
   -- documents
   select document_url from public.company_credentials where document_url is not null;
   ```

3. **Diff** — any stored object whose path is **not** in the referenced set is a candidate orphan.
   Ignore objects **younger than ~1 day** (an upload may be mid-edit and not yet saved).
4. **Remove** confirmed orphans — Dashboard delete, or `storage.from('<bucket>').remove([paths])`.
   Deleting an object never affects a DB row; deleting a row is handled in-app (see above).

A referenced path with **no** matching stored object (the inverse) indicates a broken reference —
should not occur under the T7.5 flow, but if found, re-upload via the manager's edit dialog.
