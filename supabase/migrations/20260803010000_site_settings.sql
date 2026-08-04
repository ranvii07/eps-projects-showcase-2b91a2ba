-- Site settings: CMS-controlled boolean toggles for publicly-visible features.
--
-- Motivation: the Project Gallery (20260803000000) is built but should stay
-- hidden until the business decides to publish it. Rather than commenting the
-- feature out — which loses it — the site reads a flag from the database, so
-- turning the gallery on or off is a CMS action, not a deploy.
--
-- Shape: one row per toggle, `key` as the primary key. Deliberately NOT a
-- generic jsonb key/value store — every existing content table in this schema
-- uses plain typed columns, and every setting this site needs is a yes/no
-- switch. `label` and `description` live in the row so /admin/settings can
-- render the whole table generically: adding a future toggle is an INSERT, with
-- no CMS code change.
--
-- Visibility: rows are readable by anon. That is required — the navbar has to
-- know whether to show the Project Gallery link before anyone signs in. This
-- table is therefore for publicly-observable feature flags ONLY; never put a
-- secret, key, or internal-only value in it.

create table if not exists public.site_settings (
  key         text primary key check (key <> ''),
  enabled     boolean not null default false,
  label       text not null,
  description text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Matches the touch_updated_at() triggers on the other content tables.
drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch
  before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ---- Row Level Security -----------------------------------------------------
-- Read: everyone, including anon (see the visibility note above).
-- Write: staff only, and INSERT/DELETE are staff-only too, so a toggle can only
-- be added or removed deliberately. Same is_staff() convention as every other
-- table in this schema.

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings staff write" on public.site_settings;
create policy "site_settings staff write" on public.site_settings
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

-- ---- Seed --------------------------------------------------------------------
-- Defaults to false: the gallery ships hidden. `on conflict do nothing` keeps
-- this migration safe to re-run and never clobbers a value staff has already set.

insert into public.site_settings (key, enabled, label, description, sort_order)
values (
  'project_gallery_enabled',
  false,
  'Enable Project Gallery',
  'Shows Project Gallery in the site''s Projects menu and makes /projects/gallery publicly reachable. While this is off the page returns 404 for visitors; per-project private preview links (?preview=<token>) keep working either way, so the gallery can still be reviewed and shared with clients before launch.',
  10
)
on conflict (key) do nothing;
