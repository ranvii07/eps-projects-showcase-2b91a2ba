-- Audit fix C2 (database side): server-enforced length bounds on the one
-- publicly writable table.
--
-- The "submissions public insert" policy allows anon INSERTs with CHECK (true),
-- and all field validation (zod in ContactForm.tsx) runs client-side only — a
-- direct PostgREST call with the publishable key bypasses it entirely, and
-- `message` is an unbounded text column. These constraints mirror the client
-- zod schema so a bypassing caller cannot store oversized payloads.
--
-- NOT VALID: skips validation of existing rows at apply time, so this
-- migration cannot fail on pre-existing data. CAUTION: NOT VALID constraints
-- ARE still enforced on every subsequent INSERT and UPDATE — including a
-- staff status change that touches no other column. If a legacy row already
-- violates a limit, updating it will fail until the row is fixed. BEFORE (or
-- right after) applying, list violating rows and trim/delete them:
--
--   select id, char_length(name) n, char_length(email) e, char_length(message) m
--   from public.contact_submissions
--   where char_length(name) not between 1 and 100
--      or char_length(email) not between 3 and 255
--      or coalesce(char_length(phone), 0) > 30
--      or coalesce(char_length(company), 0) > 150
--      or coalesce(char_length(subject), 0) > 200
--      or char_length(message) not between 1 and 5000
--      or coalesce(char_length(source), 0) > 50;
--
-- Once clean, optionally promote each constraint:
--   alter table public.contact_submissions validate constraint <name>;
--
-- NOTE: this bounds row size only. Rate limiting / bot protection (CAPTCHA or
-- an edge-function insert path) still requires external configuration and is
-- intentionally NOT addressed here.

alter table public.contact_submissions
  add constraint contact_submissions_name_len
  check (char_length(name) between 1 and 100) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_email_len
  check (char_length(email) between 3 and 255) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_phone_len
  check (phone is null or char_length(phone) <= 30) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_company_len
  check (company is null or char_length(company) <= 150) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_subject_len
  check (subject is null or char_length(subject) <= 200) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_message_len
  check (char_length(message) between 1 and 5000) not valid;

alter table public.contact_submissions
  add constraint contact_submissions_source_len
  check (source is null or char_length(source) <= 50) not valid;
