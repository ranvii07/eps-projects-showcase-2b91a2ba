-- T3.10: allow public (anonymous) read of client logo objects only.
--
-- The client-images bucket stays PRIVATE (public = false) and the app keeps
-- using createSignedUrl. This policy lets the anon/authenticated roles mint
-- short-lived signed URLs for client logos so the public /clients page and the
-- homepage ClientsBanner can display them. Mirrors the existing "public read"
-- convention used by the content tables (to anon, authenticated).
--
-- Scope: client-images ONLY. project-images and documents remain staff-only
-- (their staff policies in 20260630074609 are unchanged). Writes to
-- client-images stay staff-only — no INSERT/UPDATE/DELETE is granted here.
-- Client logos are public brand marks, so anon read of this one bucket is
-- appropriate; the policy is bucket-scoped, not row-joined to clients.published.

drop policy if exists "Public can read client logos" on storage.objects;
create policy "Public can read client logos"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'client-images');
