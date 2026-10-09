-- =============================================================================
-- EPS Projects Showcase — full schema bootstrap
-- =============================================================================
-- Generated 2026-10-08 from the LIVE Lovable Cloud database (nmvcyaufxesjmseungcd)
-- via pg_catalog introspection: columns/defaults, pg_get_constraintdef,
-- pg_get_indexdef, pg_get_functiondef, pg_get_triggerdef, pg_policies, grants,
-- storage buckets and storage.objects policies. Replicates that state exactly
-- into a fresh Supabase project. Run once, in one transaction, on an EMPTY
-- project.
-- =============================================================================
begin;

-- ---- Enum -------------------------------------------------------------------
create type public.app_role as enum ('director', 'coo', 'admin');

-- ---- Tables -----------------------------------------------------------------
create table public.profiles (
  id uuid not null,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  logo_url text,
  industry text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.company_credentials (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  kind text not null,
  label text,
  value text,
  document_url text,
  issued_on date,
  expires_on date,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.faq (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  question text not null,
  answer text not null,
  category text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.hse_content (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  section text not null,
  title text,
  body text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.industries (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  description text,
  icon_name text,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.projects (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  client text,
  industry text,
  location text,
  description text,
  image_url text,
  status text,
  project_value numeric,
  completion_date date,
  sort_order integer not null default 0,
  published boolean not null default true,
  preview_token uuid not null default gen_random_uuid(),
  preview_enabled boolean not null default false
);

create table public.project_images (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  project_id uuid not null,
  image_url text not null,
  caption text,
  location text,
  category text,
  sort_order integer not null default 0,
  published boolean not null default false,
  is_cover boolean not null default false,
  visibility text not null default 'public'::text
);

create table public.services (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  description text,
  icon_name text,
  sort_order integer not null default 0,
  published boolean not null default true
);

create table public.contact_submissions (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  status text not null default 'new'::text,
  source text default 'website'::text
);

create table public.contact_status_history (
  id uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  submission_id uuid not null,
  from_status text,
  to_status text not null,
  changed_by uuid,
  note text
);

create table public.site_settings (
  key text not null,
  enabled boolean not null default false,
  label text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now()
);

-- ---- Constraints (verbatim pg_get_constraintdef) ----------------------------
alter table public.clients add constraint clients_pkey PRIMARY KEY (id);
alter table public.company_credentials add constraint company_credentials_pkey PRIMARY KEY (id);
alter table public.contact_status_history add constraint contact_status_history_pkey PRIMARY KEY (id);
alter table public.contact_submissions add constraint contact_submissions_pkey PRIMARY KEY (id);
alter table public.faq add constraint faq_pkey PRIMARY KEY (id);
alter table public.hse_content add constraint hse_content_pkey PRIMARY KEY (id);
alter table public.industries add constraint industries_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.project_images add constraint project_images_pkey PRIMARY KEY (id);
alter table public.projects add constraint projects_pkey PRIMARY KEY (id);
alter table public.services add constraint services_pkey PRIMARY KEY (id);
alter table public.site_settings add constraint site_settings_pkey PRIMARY KEY (key);
alter table public.user_roles add constraint user_roles_pkey PRIMARY KEY (id);
alter table public.user_roles add constraint user_roles_user_id_role_key UNIQUE (user_id, role);
alter table public.contact_submissions add constraint contact_submissions_company_len CHECK (((company IS NULL) OR (char_length(company) <= 150)));
alter table public.contact_submissions add constraint contact_submissions_email_len CHECK (((char_length(email) >= 3) AND (char_length(email) <= 255)));
alter table public.contact_submissions add constraint contact_submissions_message_len CHECK (((char_length(message) >= 1) AND (char_length(message) <= 5000)));
alter table public.contact_submissions add constraint contact_submissions_name_len CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100)));
alter table public.contact_submissions add constraint contact_submissions_phone_len CHECK (((phone IS NULL) OR (char_length(phone) <= 30)));
alter table public.contact_submissions add constraint contact_submissions_source_len CHECK (((source IS NULL) OR (char_length(source) <= 50)));
alter table public.contact_submissions add constraint contact_submissions_subject_len CHECK (((subject IS NULL) OR (char_length(subject) <= 200)));
alter table public.project_images add constraint project_images_visibility_check CHECK ((visibility = ANY (ARRAY['public'::text, 'private'::text])));
alter table public.site_settings add constraint site_settings_key_check CHECK ((key <> ''::text));
alter table public.contact_status_history add constraint contact_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
alter table public.contact_status_history add constraint contact_status_history_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.contact_submissions(id) ON DELETE CASCADE;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.project_images add constraint project_images_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
alter table public.user_roles add constraint user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ---- Indexes ----------------------------------------------------------------
CREATE UNIQUE INDEX project_images_one_cover_per_project ON public.project_images USING btree (project_id) WHERE is_cover;
CREATE UNIQUE INDEX projects_preview_token_key ON public.projects USING btree (preview_token);
CREATE INDEX project_images_project_sort_idx ON public.project_images USING btree (project_id, sort_order);

-- ---- Functions (verbatim pg_get_functiondef) --------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end; $function$;

CREATE OR REPLACE FUNCTION public.log_contact_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.contact_status_history (submission_id, from_status, to_status, changed_by)
    values (new.id, old.status, new.status, auth.uid());
  end if;
  return new;
end; $function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$function$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin new.updated_at = now(); return new; end; $function$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (select 1 from public.user_roles where user_id = _user_id);
$function$;

CREATE OR REPLACE FUNCTION public.get_preview_gallery_images(p_token uuid)
 RETURNS TABLE(id uuid, project_id uuid, project_name text, image_url text, caption text, location text, category text, sort_order integer, is_cover boolean, visibility text)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select i.id, i.project_id, p.name, i.image_url, i.caption, i.location,
         i.category, i.sort_order, i.is_cover, i.visibility
  from public.project_images i
  join public.projects p on p.id = i.project_id
  where p.preview_enabled = true
    and p.preview_token = p_token
    and i.published = true
  order by i.sort_order asc, i.created_at asc;
$function$;

-- Function grants (live: get_preview_gallery_images has PUBLIC revoked).
revoke all on function public.get_preview_gallery_images(uuid) from public;
grant execute on function public.get_preview_gallery_images(uuid) to anon, authenticated, service_role;

-- ---- Triggers (verbatim pg_get_triggerdef) ----------------------------------
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER projects_touch BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER clients_touch BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER services_touch BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER faq_touch BEFORE UPDATE ON public.faq FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER hse_touch BEFORE UPDATE ON public.hse_content FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER credentials_touch BEFORE UPDATE ON public.company_credentials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER submissions_touch BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER contact_status_history_trg AFTER UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION public.log_contact_status_change();
CREATE TRIGGER industries_touch BEFORE UPDATE ON public.industries FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER project_images_touch BEFORE UPDATE ON public.project_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ---- Grants (live = Supabase blanket defaults; RLS is the boundary) ---------
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- ---- Row Level Security -----------------------------------------------------
alter table public.profiles               enable row level security;
alter table public.clients                enable row level security;
alter table public.company_credentials    enable row level security;
alter table public.faq                    enable row level security;
alter table public.hse_content            enable row level security;
alter table public.industries             enable row level security;
alter table public.projects               enable row level security;
alter table public.project_images         enable row level security;
alter table public.services               enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.contact_status_history enable row level security;
alter table public.site_settings          enable row level security;
alter table public.user_roles             enable row level security;

-- ---- Policies (verbatim pg_policies) ----------------------------------------
create policy "clients public read" on public.clients as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "clients staff write" on public.clients as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "credentials public read" on public.company_credentials as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "credentials staff write" on public.company_credentials as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "history staff select" on public.contact_status_history as PERMISSIVE for SELECT to authenticated using (is_staff(auth.uid()));
create policy "submissions public insert" on public.contact_submissions as PERMISSIVE for INSERT to anon, authenticated with check (true);
create policy "submissions staff delete" on public.contact_submissions as PERMISSIVE for DELETE to public using (is_staff(auth.uid()));
create policy "submissions staff select" on public.contact_submissions as PERMISSIVE for SELECT to authenticated using (is_staff(auth.uid()));
create policy "submissions staff update" on public.contact_submissions as PERMISSIVE for UPDATE to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "faq public read" on public.faq as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "faq staff write" on public.faq as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "hse public read" on public.hse_content as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "hse staff write" on public.hse_content as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "industries public read" on public.industries as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "industries staff write" on public.industries as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "profiles self select" on public.profiles as PERMISSIVE for SELECT to authenticated using (((id = auth.uid()) OR is_staff(auth.uid())));
create policy "profiles self update" on public.profiles as PERMISSIVE for UPDATE to authenticated using ((id = auth.uid())) with check ((id = auth.uid()));
create policy "project_images public read" on public.project_images as PERMISSIVE for SELECT to anon, authenticated using ((is_staff(auth.uid()) OR ((published = true) AND (visibility = 'public'::text) AND (EXISTS ( SELECT 1
   FROM projects p
  WHERE ((p.id = project_images.project_id) AND (p.published = true)))))));
create policy "project_images staff write" on public.project_images as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "projects public read" on public.projects as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "projects staff write" on public.projects as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "services public read" on public.services as PERMISSIVE for SELECT to anon, authenticated using (((published = true) OR is_staff(auth.uid())));
create policy "services staff write" on public.services as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "site_settings public read" on public.site_settings as PERMISSIVE for SELECT to anon, authenticated using (true);
create policy "site_settings staff write" on public.site_settings as PERMISSIVE for ALL to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
create policy "user_roles admin delete" on public.user_roles as PERMISSIVE for DELETE to authenticated using (has_role(auth.uid(), 'admin'::app_role));
create policy "user_roles admin insert" on public.user_roles as PERMISSIVE for INSERT to authenticated with check (has_role(auth.uid(), 'admin'::app_role));
create policy "user_roles self or staff select" on public.user_roles as PERMISSIVE for SELECT to authenticated using (((user_id = auth.uid()) OR is_staff(auth.uid())));

-- ---- Storage buckets (live: all private, no size/MIME limits) ---------------
insert into storage.buckets (id, name, public) values
  ('client-images', 'client-images', false),
  ('documents', 'documents', false),
  ('industry-images', 'industry-images', false),
  ('project-images', 'project-images', false);

-- ---- Storage policies (verbatim pg_policies) --------------------------------
create policy "Public can read client logos" on storage.objects as PERMISSIVE for SELECT to anon, authenticated using ((bucket_id = 'client-images'::text));
create policy "Public can read industry images" on storage.objects as PERMISSIVE for SELECT to anon, authenticated using ((bucket_id = 'industry-images'::text));
create policy "Public can read project images" on storage.objects as PERMISSIVE for SELECT to anon, authenticated using ((bucket_id = 'project-images'::text));
create policy "Staff can delete CMS storage objects" on storage.objects as PERMISSIVE for DELETE to authenticated using (((bucket_id = ANY (ARRAY['project-images'::text, 'client-images'::text, 'documents'::text])) AND is_staff(auth.uid())));
create policy "Staff can delete industry images" on storage.objects as PERMISSIVE for DELETE to authenticated using (((bucket_id = 'industry-images'::text) AND is_staff(auth.uid())));
create policy "Staff can read CMS storage objects" on storage.objects as PERMISSIVE for SELECT to authenticated using (((bucket_id = ANY (ARRAY['project-images'::text, 'client-images'::text, 'documents'::text])) AND is_staff(auth.uid())));
create policy "Staff can update CMS storage objects" on storage.objects as PERMISSIVE for UPDATE to authenticated using (((bucket_id = ANY (ARRAY['project-images'::text, 'client-images'::text, 'documents'::text])) AND is_staff(auth.uid()))) with check (((bucket_id = ANY (ARRAY['project-images'::text, 'client-images'::text, 'documents'::text])) AND is_staff(auth.uid())));
create policy "Staff can update industry images" on storage.objects as PERMISSIVE for UPDATE to authenticated using (((bucket_id = 'industry-images'::text) AND is_staff(auth.uid()))) with check (((bucket_id = 'industry-images'::text) AND is_staff(auth.uid())));
create policy "Staff can upload CMS storage objects" on storage.objects as PERMISSIVE for INSERT to authenticated with check (((bucket_id = ANY (ARRAY['project-images'::text, 'client-images'::text, 'documents'::text])) AND is_staff(auth.uid())));
create policy "Staff can upload industry images" on storage.objects as PERMISSIVE for INSERT to authenticated with check (((bucket_id = 'industry-images'::text) AND is_staff(auth.uid())));

commit;
