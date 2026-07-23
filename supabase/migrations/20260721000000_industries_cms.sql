-- Industries CMS: make the hardcoded /industries page CMS-driven.
--
-- The page currently renders a fixed INDUSTRIES array in src/routes/industries.tsx
-- using lucide icons (no images). This migration introduces public.industries,
-- mirroring the public.services shape (title/description/icon_name/sort_order/
-- published) so the existing Services manager patterns carry over unchanged, plus
-- an image_url column for CMS-uploaded artwork.
--
-- Rendering note: the industry cards keep using icon_name (the cyan icon tile), so
-- the public page is byte-identical after this migration. image_url is stored and
-- editable but is NOT rendered by the current card design — it exists so artwork can
-- be attached now and surfaced by a future design change without another migration.
--
-- The eight seeded rows reproduce the hardcoded list exactly: same names, same
-- descriptions, same icons, same order, all published. No new business facts are
-- introduced. After this migration the page is CMS-driven with zero visual change.

create table if not exists public.industries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  name        text not null,
  description text,
  icon_name   text,
  image_url   text,
  sort_order  integer not null default 0,
  published   boolean not null default true
);

-- Matches the touch_updated_at() triggers on the other content tables.
drop trigger if exists industries_touch on public.industries;
create trigger industries_touch
  before update on public.industries
  for each row execute function public.touch_updated_at();

-- ---- Row Level Security -----------------------------------------------------
-- Identical to the other content tables: public reads published rows (staff read
-- all); staff-only writes.

alter table public.industries enable row level security;

drop policy if exists "industries public read" on public.industries;
create policy "industries public read" on public.industries
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));

drop policy if exists "industries staff write" on public.industries;
create policy "industries staff write" on public.industries
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

-- ---- Storage ----------------------------------------------------------------
-- Private bucket + createSignedUrl, exactly like client-images / project-images.
-- Public read is required so anon visitors can mint signed URLs (Lesson 16 /
-- migration 20260720000000 documented this prerequisite). Writes stay staff-only.

insert into storage.buckets (id, name, public)
values ('industry-images', 'industry-images', false)
on conflict (id) do nothing;

drop policy if exists "Public can read industry images" on storage.objects;
create policy "Public can read industry images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'industry-images');

drop policy if exists "Staff can upload industry images" on storage.objects;
create policy "Staff can upload industry images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'industry-images' and public.is_staff(auth.uid()));

drop policy if exists "Staff can update industry images" on storage.objects;
create policy "Staff can update industry images"
  on storage.objects for update to authenticated
  using (bucket_id = 'industry-images' and public.is_staff(auth.uid()))
  with check (bucket_id = 'industry-images' and public.is_staff(auth.uid()));

drop policy if exists "Staff can delete industry images" on storage.objects;
create policy "Staff can delete industry images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'industry-images' and public.is_staff(auth.uid()));

-- ---- Seed -------------------------------------------------------------------
-- Verbatim migration of the hardcoded INDUSTRIES array. icon_name values are the
-- kebab-case keys resolved by the iconMap in src/routes/industries.tsx.
--
-- Idempotent: public.industries has no unique constraint on `name`, so ON CONFLICT
-- is not applicable. Each row is guarded by a NOT EXISTS on the name (the equivalent
-- "do nothing if already present"), so re-running the migration — or a later CMS
-- edit — will not create duplicates.

insert into public.industries (name, description, icon_name, sort_order, published)
select v.name, v.description, v.icon_name, v.sort_order, true
from (values
  ('Cement Industry',
   'Full E&I for raw mill, kiln, packing & power systems',
   'factory', 1),
  ('Sugar & Distillery',
   'Boiler, turbine, ethanol plant automation & instrumentation',
   'flask-conical', 2),
  ('Oil & Gas',
   'Hazardous area E&I, fire & gas, DCS/SCADA integration',
   'flame', 3),
  ('Infrastructure',
   'Substations, transmission lines, lighting & ELV systems',
   'tower-control', 4),
  ('Steel Industry',
   'MCC, VFD drives, power distribution & HT/LT systems',
   'cog', 5),
  ('Petrochemical',
   'Process control, analyzer systems, safety instrumentation',
   'beaker', 6),
  ('Hydro Power',
   'Control & protection systems for hydro turbine generators',
   'waves', 7),
  ('Co-gen / Captive Power',
   'Complete E&I for co-gen, WHR and captive power plants',
   'zap', 8)
) as v(name, description, icon_name, sort_order)
where not exists (
  select 1 from public.industries i where i.name = v.name
);
