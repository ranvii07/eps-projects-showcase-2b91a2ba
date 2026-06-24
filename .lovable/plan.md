## Phase 2 — Frontend Port + Admin Shell (no DB writes)

Scope locked per your last message: port the frontend, build auth-gated admin shell, deliver SQL in chat for your review only. No `supabase--migration` call. No storage buckets. No seed data.

### Part A — Frontend port (pixel-equivalent)

The uploaded CRA app uses raw Tailwind utility colors (`bg-zinc-950`, `text-cyan-400`, `bg-blue-600`, `text-slate-300`, etc.) — all valid in the v4 setup already in this project, so no theme-token migration is needed. JSX is copied byte-for-byte with only these mechanical changes:

- `react-router-dom` → `@tanstack/react-router` (`Link`, `useNavigate`, `useRouterState`)
- The `<Seo />` component is removed; per-page SEO moves into route `head()` via a `buildPageHead({ title, description, path })` helper in `src/lib/site.ts`
- `data-testid`, classNames, copy, image URLs, icons, animations, scroll-indicator, marquee timing — all preserved

**Files created**

- `src/lib/site.ts` — `SITE_URL`, `SITE_NAME`, `SITE_LOGO`, `buildPageHead()`
- `src/components/site/` (new folder): `Navbar.tsx`, `Footer.tsx`, `Hero.tsx`, `About.tsx`, `Services.tsx`, `WhyChooseUs.tsx`, `ClientsBanner.tsx`, `FAQ.tsx`, `Contact.tsx`, `ContactForm.tsx`, `ContactInfo.tsx`, `PageHeader.tsx`, `ScrollToTop.tsx`
- Routes: `src/routes/index.tsx` (Home), `about.tsx`, `services.tsx`, `why-choose-us.tsx`, `projects.tsx`, `clients.tsx`, `contact.tsx`, `privacy.tsx`, `terms.tsx`
- `public/sitemap.xml`, `public/robots.txt` — copied verbatim from the upload

**Files edited**

- `src/routes/__root.tsx` — sitewide `head()` defaults (viewport, charset, og:type, og:site_name, theme-color), Organization JSON-LD via `scripts`, `<body className="bg-zinc-950 text-white">`, render `<ScrollToTop />` + `<Navbar />` + `<main><Outlet /></main>` + `<Footer />` + `<Toaster />`. Existing `NotFoundComponent` / `ErrorComponent` kept (restyled minimally to match the dark theme).
- Contact form keeps the original frontend-only mock submit (sonner toast); wiring it to `contact_submissions` happens after you run the SQL.

### Part B — Auth foundation (TanStack-native)

- `src/integrations/supabase/client.ts` — already auto-generated, publishable key. Used as-is.
- `src/start.ts` — `attachSupabaseAuth` already in `functionMiddleware`. No change.
- No `VITE_SUPABASE_ANON_KEY` introduced (per your approval of the divergence).

### Part C — Admin shell

- `src/routes/admin.login.tsx` — **public** route. shadcn `Card` + `Label` + `Input` + `Button`, Zod-validated email/password, calls `supabase.auth.signInWithPassword`, sonner toast on error, on success `navigate({ to: "/admin/dashboard", replace: true })`. If already signed in, redirects to dashboard via `beforeLoad`.
- `src/routes/_authenticated/route.tsx` — pathless layout, `ssr: false`, `beforeLoad` calls `supabase.auth.getUser()`, on no user `throw redirect({ to: "/admin/login" })`. Component: `<Outlet />`. (Integration-managed pattern, but the default redirects to `/auth`; this project's sign-in lives at `/admin/login`, so this file is authored once with that target.)
- `src/routes/_authenticated/admin/route.tsx` — admin shell: `SidebarProvider` + `AppSidebar` (links: Dashboard, Projects, Clients, Services, FAQs, HSE, Credentials, Contact Submissions, Settings — all link to `/admin/<section>`; sections beyond Dashboard render a shared "Coming soon" placeholder for now), top bar with `SidebarTrigger` + signed-in email + Sign-out button (cancel queries → clear cache → `supabase.auth.signOut()` → `navigate({ to: "/admin/login", replace: true })`).
- `src/routes/_authenticated/admin/index.tsx` — redirects to `/admin/dashboard`.
- `src/routes/_authenticated/admin/dashboard.tsx` — "Welcome to EPS CMS" + cards for each future section, each labelled "Coming soon".
- `src/routes/_authenticated/admin/$.tsx` — splat catch-all for the not-yet-built sections; renders the same "Coming soon" panel so sidebar links don't 404 in the meantime.

No role gate on the client. Role enforcement (Director/COO/Admin) runs server-side via `has_role()` + RLS once you run the SQL.

### Part D — SQL script for your review (delivered in chat; NOT executed)

A single, paste-ready SQL block printed in the chat. You run it in your dashboard's SQL Editor when ready. No `supabase--migration` call until you say so. Structure per project rules: every public-schema table follows CREATE → GRANT → ENABLE RLS → POLICY in the same script.

Includes:

- `public.app_role` enum: `director | coo | admin`
- `public.profiles` (id PK FK `auth.users` on delete cascade, full_name, email, avatar_url, timestamps) + `handle_new_user()` trigger on `auth.users`
- `public.user_roles` (unique on `(user_id, role)`)
- `public.has_role(uuid, app_role)` and `public.is_staff(uuid)` — `security definer stable`, fixed `search_path`
- `public.projects` (name, client, industry, location, description, image_url, status, project_value, completion_date)
- `public.clients` (name, logo_url, industry)
- `public.services` (title, description, icon_name)
- `public.faq` (question, answer, category, sort_order)
- `public.hse_content` (section, title, body, sort_order)
- `public.company_credentials` (kind, label, value, document_url, issued_on, expires_on)
- `public.contact_submissions` (name, email, phone, company, subject, message, status, source)
- `public.contact_status_history` (submission_id FK, from_status, to_status, changed_by FK profiles, note) + trigger on `contact_submissions` status change
- RLS:
  - Public-read content tables: `SELECT TO anon, authenticated USING (true)`; write `TO authenticated USING (is_staff(auth.uid()))`
  - `profiles`: self SELECT/UPDATE; staff SELECT all
  - `user_roles`: SELECT self-or-staff; INSERT/DELETE admin-only
  - `contact_submissions`: `INSERT TO anon, authenticated WITH CHECK (true)`; SELECT/UPDATE staff-only
  - `contact_status_history`: SELECT staff-only; writes via trigger (service_role grant only)
- `GRANT` block per table as required

### Out of scope this pass

`site_settings`, `audit_logs`, storage buckets, CMS data-entry forms, contact pipeline UI, email/webhooks, analytics, GA4, deploy changes.

### Verification before stopping

1. `bun run build` clean
2. Headless Playwright: `/`, `/about`, `/services`, `/why-choose-us`, `/projects`, `/clients`, `/contact`, `/privacy`, `/terms`, `/admin/login` render with no console errors; navbar scroll, FAQ accordion, contact-form toast, marquee, footer year all behave; `/admin/dashboard` redirects to `/admin/login` when signed out
3. Screenshot home + one inner route at 1280px to confirm pixel-equivalent output vs the upload

Then I stop and print the SQL block. Approve to switch me into build mode.
