-- =============================================================================
-- Baseline schema (public) — reconstructed from the LIVE database
-- =============================================================================
-- EPS Projects Showcase
--   Supabase project : nmvcyaufxesjmseungcd
--   Lovable project  : da3f9ef6-7ac0-4acf-81e4-c52b574b01ce
--
-- SOURCE OF TRUTH: the live database, read via Lovable read-only introspection
-- (pg_catalog / information_schema / pg_policies) on 2026-07-07. The original
-- schema was applied through the Lovable / dashboard SQL editor and was never
-- versioned as a migration (see plan.md Part D). This file records that live
-- state for versioning and audit — Blueprint task T0.2.
--
-- WARNING — NOT an executable migration for the existing environment:
--   Every object below ALREADY EXISTS in production. Do NOT run this file
--   against the live database. It is a reconstructed baseline intended as a
--   fresh-environment rebuild reference and an audit artifact. Schema changes
--   continue to be made through Lovable, not by executing this file.
--   (A follow-up proposal about how Lovable-managed baselines should be stored
--   is raised separately, after T0.2, per instruction.)
--
-- SCOPE: public schema only — enum, tables, constraints, functions, triggers,
--   RLS + policies, and a note on grants. Storage-object policies are already
--   versioned in 20260630074609_*.sql and are NOT duplicated here; storage
--   buckets are documented at the end for completeness.
--
-- Every statement below is transcribed from live-catalog output. Nothing here
-- is inferred: functions and triggers are verbatim from pg_get_functiondef /
-- pg_get_triggerdef; policies from pg_policies; columns/defaults from
-- information_schema.columns. Cross-checked against src/integrations/supabase/
-- types.ts and plan.md Part D (discrepancies noted in lessons/04-*).
-- =============================================================================


-- ---- Enum -------------------------------------------------------------------
create type public.app_role as enum ('director', 'coo', 'admin');


-- ---- Tables -----------------------------------------------------------------

-- profiles (1:1 with auth.users; populated by handle_new_user trigger)
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name       text not null,
  logo_url   text,
  industry   text,
  sort_order integer not null default 0,
  published  boolean not null default true
);

create table public.company_credentials (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  kind         text not null,
  label        text,
  value        text,
  document_url text,
  issued_on    date,
  expires_on   date,
  sort_order   integer not null default 0,
  published    boolean not null default true
);

create table public.faq (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  question   text not null,
  answer     text not null,
  category   text,
  sort_order integer not null default 0,
  published  boolean not null default true
);

create table public.hse_content (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  section    text not null,
  title      text,
  body       text,
  sort_order integer not null default 0,
  published  boolean not null default true
);

create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  name            text not null,
  client          text,
  industry        text,
  location        text,
  description     text,
  image_url       text,
  status          text,
  project_value   numeric,
  completion_date date,
  sort_order      integer not null default 0,
  published       boolean not null default true
);

create table public.services (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title      text not null,
  description text,
  icon_name  text,
  sort_order integer not null default 0,
  published  boolean not null default true
);

create table public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  subject    text,
  message    text not null,
  status     text not null default 'new'::text,
  source     text default 'website'::text
);

-- append-only; rows written by the log_contact_status_change trigger
create table public.contact_status_history (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  submission_id uuid not null references public.contact_submissions(id) on delete cascade,
  from_status   text,
  to_status     text not null,
  changed_by    uuid references public.profiles(id) on delete set null,
  note          text
);

create table public.user_roles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);


-- ---- Functions (verbatim from pg_get_functiondef) ---------------------------

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

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$function$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (select 1 from public.user_roles where user_id = _user_id);
$function$;

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

CREATE OR REPLACE FUNCTION public.touch_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin new.updated_at = now(); return new; end; $function$;


-- ---- Triggers (verbatim from pg_get_triggerdef) -----------------------------

-- on auth.users: create a profile row on signup
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- contact status-change audit trail
CREATE TRIGGER contact_status_history_trg AFTER UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION log_contact_status_change();

-- updated_at maintenance
CREATE TRIGGER clients_touch     BEFORE UPDATE ON public.clients             FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER credentials_touch BEFORE UPDATE ON public.company_credentials FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER submissions_touch BEFORE UPDATE ON public.contact_submissions FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER faq_touch         BEFORE UPDATE ON public.faq                 FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER hse_touch         BEFORE UPDATE ON public.hse_content         FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER profiles_touch    BEFORE UPDATE ON public.profiles            FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER projects_touch    BEFORE UPDATE ON public.projects            FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER services_touch    BEFORE UPDATE ON public.services            FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- ---- Row Level Security -----------------------------------------------------

alter table public.profiles               enable row level security;
alter table public.clients                enable row level security;
alter table public.company_credentials    enable row level security;
alter table public.faq                    enable row level security;
alter table public.hse_content            enable row level security;
alter table public.projects               enable row level security;
alter table public.services               enable row level security;
alter table public.contact_submissions    enable row level security;
alter table public.contact_status_history enable row level security;
alter table public.user_roles             enable row level security;

-- Content tables: public reads published rows (staff read all); staff-only writes.
create policy "clients public read" on public.clients
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "clients staff write" on public.clients
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

create policy "credentials public read" on public.company_credentials
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "credentials staff write" on public.company_credentials
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

create policy "faq public read" on public.faq
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "faq staff write" on public.faq
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

create policy "hse public read" on public.hse_content
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "hse staff write" on public.hse_content
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

create policy "projects public read" on public.projects
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "projects staff write" on public.projects
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

create policy "services public read" on public.services
  for select to anon, authenticated using ((published = true) or is_staff(auth.uid()));
create policy "services staff write" on public.services
  for all to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));

-- contact_submissions: anyone may submit; only staff may read / update / delete.
create policy "submissions public insert" on public.contact_submissions
  for insert to anon, authenticated with check (true);
create policy "submissions staff select" on public.contact_submissions
  for select to authenticated using (is_staff(auth.uid()));
create policy "submissions staff update" on public.contact_submissions
  for update to authenticated using (is_staff(auth.uid())) with check (is_staff(auth.uid()));
-- NB: role list is {public} in the catalog but the USING (is_staff) clause makes
-- it staff-only in practice (from migration 20260702091748_*.sql).
create policy "submissions staff delete" on public.contact_submissions
  for delete to public using (is_staff(auth.uid()));

-- contact_status_history: staff read only. No INSERT policy — rows are written
-- exclusively by the SECURITY DEFINER trigger log_contact_status_change().
create policy "history staff select" on public.contact_status_history
  for select to authenticated using (is_staff(auth.uid()));

-- profiles: self read (staff read all); self update only.
create policy "profiles self select" on public.profiles
  for select to authenticated using ((id = auth.uid()) or is_staff(auth.uid()));
create policy "profiles self update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- user_roles: self-or-staff read; admin-only insert/delete. No UPDATE policy.
create policy "user_roles self or staff select" on public.user_roles
  for select to authenticated using ((user_id = auth.uid()) or is_staff(auth.uid()));
create policy "user_roles admin insert" on public.user_roles
  for insert to authenticated with check (has_role(auth.uid(), 'admin'::app_role));
create policy "user_roles admin delete" on public.user_roles
  for delete to authenticated using (has_role(auth.uid(), 'admin'::app_role));


-- ---- Grants -----------------------------------------------------------------
-- The live DB carries Supabase's DEFAULT blanket grants: every public table
-- grants ALL (SELECT/INSERT/UPDATE/DELETE/REFERENCES/TRIGGER/TRUNCATE) to
-- anon, authenticated, and service_role. Access is therefore gated ENTIRELY by
-- the RLS policies above — the grants are not a security boundary. Reproduced
-- as the standard Supabase defaults:
grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;


-- ---- Storage (reference only — not created/altered here) ---------------------
-- Buckets (all PRIVATE, public=false; no size/MIME limits set):
--   project-images, client-images, documents
-- Their staff RLS policies on storage.objects are versioned in
-- 20260630074609_e76152b6-e3ff-455a-b0f3-0185e2d10ed6.sql.
-- Bucket creation itself is unversioned Lovable/dashboard infrastructure.
-- =============================================================================
