-- Audit fix C1: allow public (anonymous) read of project image objects only.
--
-- The public /projects page and the homepage FeaturedProjects section mint
-- short-lived signed URLs for project-images client-side (useSignedUrl). The
-- storage `sign` endpoint requires SELECT on storage.objects, and until now the
-- only policies on project-images were the staff-only ones from 20260630074609.
-- Anonymous visitors therefore could not mint signed URLs, and every published
-- project image rendered as a permanent loading spinner. Lesson 16 documented
-- this exact prerequisite: an anon-read policy identical to the client-images
-- one (20260711000000) must exist before project images show publicly.
--
-- The project-images bucket stays PRIVATE (public = false) and the app keeps
-- using createSignedUrl. Scope: project-images ONLY — `documents` remains
-- staff-only (no public surface renders it). Writes to project-images stay
-- staff-only — no INSERT/UPDATE/DELETE is granted here.

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'project-images');
