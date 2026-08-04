-- Project Gallery: split the Projects section into a Project Directory (the
-- existing /projects page, unchanged) and a Project Gallery of site photographs.
--
-- Minimal extension of the existing schema:
--   1. public.project_images — many photographs per project, each with optional
--      caption/location/category, sort_order, the standard published flag, a
--      `visibility` flag (public | private), and an `is_cover` flag marking the
--      one image that represents the project's gallery.
--   2. public.projects gains two columns that drive the shareable client preview:
--      preview_token (unguessable uuid) and preview_enabled (off by default).
--   3. public.get_preview_gallery_images(uuid) — SECURITY DEFINER accessor that
--      returns a project's gallery to whoever holds the token. RLS cannot read a
--      URL query parameter, so token-scoped access has to go through a function;
--      this mirrors the existing is_staff() SECURITY DEFINER convention.
--
-- Table naming: the section is "Project Gallery", but the rows are individual
-- images of a project, so the table stays `project_images` — one gallery per
-- project is implied by project_id, and no separate galleries table is needed.
--
-- Storage reuses the existing private `project-images` bucket (anon read policy
-- added in 20260720000000, per lesson 16) under a `gallery/` path prefix, so no
-- new bucket and no new storage policies are required.
--
-- Backward compatibility: public.projects keeps every existing column and its
-- current row-level behaviour; the two new columns have defaults, so existing
-- rows and existing inserts from the Projects manager are unaffected. Nothing
-- reads project_images unless the new pages are visited.

-- ---- Preview-link controls on projects ---------------------------------------
-- preview_enabled defaults to false: a project is never previewable until staff
-- deliberately turns the link on. Regenerating preview_token (CMS action) revokes
-- every link that was shared previously.

alter table public.projects
  add column if not exists preview_token   uuid    not null default gen_random_uuid(),
  add column if not exists preview_enabled boolean not null default false;

create unique index if not exists projects_preview_token_key
  on public.projects (preview_token);

-- ---- Gallery table -----------------------------------------------------------
-- `published` defaults to false (unlike the other content tables, which default
-- true) because the requirement for this table is draft-first: an uploaded photo
-- stays invisible until it is explicitly published. The CMS always sends the flag
-- explicitly, so the default only governs direct SQL inserts.
--
-- `visibility` is a text + CHECK rather than a new enum type: app_role is the only
-- enum in this schema, and a two-value CHECK keeps the migration reversible and
-- matches how `status` is already stored on projects/contact_submissions.

create table if not exists public.project_images (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  image_url   text not null,
  caption     text,
  location    text,
  category    text,
  sort_order  integer not null default 0,
  published   boolean not null default false,
  is_cover    boolean not null default false,
  visibility  text not null default 'public'
              check (visibility in ('public', 'private'))
);

-- Every read path filters by project and orders by sort_order.
create index if not exists project_images_project_sort_idx
  on public.project_images (project_id, sort_order);

-- At most one cover per project, enforced in the database rather than trusted to
-- the CMS. A partial unique index is the right tool: it constrains only the rows
-- where is_cover is true and leaves the many false rows unconstrained. The CMS
-- therefore clears the previous cover BEFORE setting the new one.
create unique index if not exists project_images_one_cover_per_project
  on public.project_images (project_id)
  where is_cover;

-- Matches the touch_updated_at() triggers on the other content tables.
drop trigger if exists project_images_touch on public.project_images;
create trigger project_images_touch
  before update on public.project_images
  for each row execute function public.touch_updated_at();

-- ---- Row Level Security -----------------------------------------------------
-- Staff read/write everything. Anonymous and non-staff authenticated visitors see
-- an image only when all three hold:
--   * the image is published (draft workflow), and
--   * its visibility is 'public' (private images are preview-only), and
--   * its parent project is itself published — so a draft project cannot leak its
--     photographs. The subquery is evaluated under the caller's role, so the
--     existing "projects public read" policy is what gates it.
-- Private-preview reads deliberately do NOT go through this policy; they go
-- through get_preview_gallery_images() below.

alter table public.project_images enable row level security;

drop policy if exists "project_images public read" on public.project_images;
create policy "project_images public read" on public.project_images
  for select to anon, authenticated
  using (
    is_staff(auth.uid())
    or (
      published = true
      and visibility = 'public'
      and exists (
        select 1 from public.projects p
        where p.id = project_images.project_id and p.published = true
      )
    )
  );

drop policy if exists "project_images staff write" on public.project_images;
create policy "project_images staff write" on public.project_images
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

-- ---- Private preview accessor ------------------------------------------------
-- Returns the full published gallery for the project whose preview link is both
-- enabled and matched by the supplied token — public AND private images, which is
-- the point of a stakeholder preview. The parent project does NOT need to be
-- published: previewing work that is not yet live is exactly the use case.
--
-- SECURITY DEFINER (owner-rights) with a pinned search_path, same shape as
-- is_staff(). A wrong or stale token simply returns zero rows; the token is a
-- random uuid, so the function cannot be used to enumerate projects.

create or replace function public.get_preview_gallery_images(p_token uuid)
returns table (
  id           uuid,
  project_id   uuid,
  project_name text,
  image_url    text,
  caption      text,
  location     text,
  category     text,
  sort_order   integer,
  is_cover     boolean,
  visibility   text
)
language sql
stable
security definer
set search_path = public
as $$
  select i.id, i.project_id, p.name, i.image_url, i.caption, i.location,
         i.category, i.sort_order, i.is_cover, i.visibility
  from public.project_images i
  join public.projects p on p.id = i.project_id
  where p.preview_enabled = true
    and p.preview_token = p_token
    and i.published = true
  order by i.sort_order asc, i.created_at asc;
$$;

revoke all on function public.get_preview_gallery_images(uuid) from public;
grant execute on function public.get_preview_gallery_images(uuid) to anon, authenticated;
