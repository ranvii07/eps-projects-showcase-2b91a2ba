alter table public.projects
  add column if not exists preview_token   uuid    not null default gen_random_uuid(),
  add column if not exists preview_enabled boolean not null default false;

create unique index if not exists projects_preview_token_key
  on public.projects (preview_token);

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

grant select on public.project_images to anon;
grant select, insert, update, delete on public.project_images to authenticated;
grant all on public.project_images to service_role;

create index if not exists project_images_project_sort_idx
  on public.project_images (project_id, sort_order);

create unique index if not exists project_images_one_cover_per_project
  on public.project_images (project_id)
  where is_cover;

drop trigger if exists project_images_touch on public.project_images;
create trigger project_images_touch
  before update on public.project_images
  for each row execute function public.touch_updated_at();

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

create table if not exists public.site_settings (
  key         text primary key check (key <> ''),
  enabled     boolean not null default false,
  label       text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

grant select on public.site_settings to anon;
grant select, insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings staff write" on public.site_settings;
create policy "site_settings staff write" on public.site_settings
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

insert into public.site_settings (key, enabled, label, description, sort_order)
values (
  'project_gallery_enabled',
  false,
  'Enable Project Gallery',
  'Shows Project Gallery in the site''s Projects menu and makes /projects/gallery publicly reachable. While this is off the page returns 404 for visitors; per-project private preview links (?preview=<token>) keep working either way, so the gallery can still be reviewed and shared with clients before launch.',
  10
)
on conflict (key) do nothing;