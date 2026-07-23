drop policy if exists "Public can read client logos" on storage.objects;
create policy "Public can read client logos"
  on storage.objects for select to anon, authenticated using (bucket_id = 'client-images');

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
  on storage.objects for select to anon, authenticated using (bucket_id = 'project-images');

alter table public.contact_submissions
  add constraint contact_submissions_name_len check (char_length(name) between 1 and 100) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_email_len check (char_length(email) between 3 and 255) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_phone_len check (phone is null or char_length(phone) <= 30) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_company_len check (company is null or char_length(company) <= 150) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_subject_len check (subject is null or char_length(subject) <= 200) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_message_len check (char_length(message) between 1 and 5000) not valid;
alter table public.contact_submissions
  add constraint contact_submissions_source_len check (source is null or char_length(source) <= 50) not valid;

create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  description text,
  icon_name text,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.industries TO authenticated;
GRANT SELECT ON public.industries TO anon;
GRANT ALL ON public.industries TO service_role;

drop trigger if exists industries_touch on public.industries;
create trigger industries_touch before update on public.industries
  for each row execute function public.touch_updated_at();

alter table public.industries enable row level security;

drop policy if exists "industries public read" on public.industries;
create policy "industries public read" on public.industries
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));

drop policy if exists "industries staff write" on public.industries;
create policy "industries staff write" on public.industries
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

drop policy if exists "Public can read industry images" on storage.objects;
create policy "Public can read industry images"
  on storage.objects for select to anon, authenticated using (bucket_id = 'industry-images');

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

insert into public.industries (name, description, icon_name, sort_order, published)
select v.name, v.description, v.icon_name, v.sort_order, true
from (values
  ('Cement Industry','Full E&I for raw mill, kiln, packing & power systems','factory',1),
  ('Sugar & Distillery','Boiler, turbine, ethanol plant automation & instrumentation','flask-conical',2),
  ('Oil & Gas','Hazardous area E&I, fire & gas, DCS/SCADA integration','flame',3),
  ('Infrastructure','Substations, transmission lines, lighting & ELV systems','tower-control',4),
  ('Steel Industry','MCC, VFD drives, power distribution & HT/LT systems','cog',5),
  ('Petrochemical','Process control, analyzer systems, safety instrumentation','beaker',6),
  ('Hydro Power','Control & protection systems for hydro turbine generators','waves',7),
  ('Co-gen / Captive Power','Complete E&I for co-gen, WHR and captive power plants','zap',8)
) as v(name, description, icon_name, sort_order)
where not exists (select 1 from public.industries i where i.name = v.name);