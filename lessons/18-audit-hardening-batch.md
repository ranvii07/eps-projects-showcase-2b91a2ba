**A production audit batch (2026-07-20) landed as code: the `project-images` anon-read policy lesson 16 predicted, error fallbacks for signed URLs, DB length constraints on `contact_submissions`, security headers + CSP emitted from `src/server.ts` (because `public/_headers` only covers static-asset responses, not worker/SSR documents), a SIGNED_OUT listener in the admin shell, SVG dropped from image uploads, and CI switched to `prettier --check` + `tsc --noEmit` — which required a one-time repo-wide prettier format, since the old CI's `--write` only ever formatted a throwaway checkout.**

## What shipped (and why each was needed)

1. **`20260720000000_project_images_public_read.sql`** — the exact anon SELECT
   policy lesson 16 said `/projects` needs. Without it, anonymous visitors
   cannot mint signed URLs for `project-images`, and every published project
   image spins forever. `documents` stays staff-only (nothing public renders it).
2. **Signed-URL failure fallbacks** — `useSignedUrl` now returns
   `{ url, failed }`; `SignedImage`, `ClientsGrid`, and both
   `SignedProjectImage` copies render a placeholder icon on failure instead of
   an indefinite spinner. Loading ≠ failed is now distinguishable.
3. **`20260720000001_contact_submissions_length_checks.sql`** — CHECK
   constraints mirroring the client zod limits, added `NOT VALID` so existing
   rows can't fail the migration. Rationale: the anon INSERT policy is
   `WITH CHECK (true)` and zod runs client-side only, so a direct PostgREST
   call could previously store unbounded text. Rate limiting/CAPTCHA remains
   an external (Supabase/edge) follow-up — constraints bound size, not volume.
   **CAUTION (regression-audit finding):** `NOT VALID` only skips validation of
   existing rows at apply time — the constraints still fire on every later
   UPDATE, including a status-only change to a legacy row. Run the violating-
   rows query in the migration header and clean up before/right after applying,
   or staff cannot triage any oversized legacy submission.
4. **Security headers in `src/server.ts`** — `public/_headers` is applied by
   the static-asset layer only; SSR document responses (all pages, including
   /admin) shipped with no headers. `withSecurityHeaders` mirrors the
   `_headers` set and adds a baseline CSP (production builds only, so dev HMR
   is unaffected). CSP is deliberately permissive on `connect-src`/inline
   scripts — the framework injects inline hydration scripts and the Supabase
   origin is environment-defined; its value is frame-ancestors / object-src /
   base-uri / form-action lockdown and blocking externally-sourced scripts.
5. **Admin SIGNED_OUT listener** (`admin/route.tsx`) — the staff gate only ran
   in `beforeLoad`; a session ending mid-use left the CMS mounted and erroring.
   Now the shell clears the query cache and returns to login on sign-out.
6. **SVG removed from `IMAGE_TYPES`** (`src/lib/upload.ts`) — SVGs can embed
   scripts; a stored-XSS vector if any upload is ever rendered outside `<img>`.
7. **CI (`verify.yml`)** — `prettier --check` (the old `bun run format` used
   `--write`, which cannot fail and formatted only the CI checkout — the repo
   itself had 130 unformatted files), `tsc --noEmit` (vite build does not
   typecheck), and a `pull_request` trigger. The repo-wide prettier commit is
   a one-time enabler; from now on unformatted code fails CI.
8. Smaller fixes: generic public error on the contact form (no raw
   PostgREST/RLS messages to visitors), aria-labels on all icon-only admin
   row buttons, aria-invalid/aria-describedby wiring on contact-form errors,
   default `og:image` + Twitter card meta in `buildPageHead`,
   `fetchPriority="high"` on the hero image and `loading="lazy"` below the fold.

## Gotchas for future sessions

- Migrations here are **repo artifacts**; they still have to be applied to the
  live DB via the Lovable/Supabase path (lesson 04/16 protocol) and verified
  with `pg_policies` / `information_schema.check_constraints`.
- `withSecurityHeaders` sets a header **only if absent**, so anything the
  platform adds upstream wins. `frame-ancestors 'none'` + `X-Frame-Options:
DENY` match the pre-existing `_headers` intent — if a host dashboard ever
  needs to iframe the site, both places must change together.
- On this Windows workstation `bun install` intermittently fails with EPERM
  tarball extraction (leaves eslint unable to resolve its config). ESLint runs
  fine in CI; do not "fix" the config locally in response to `ResolveMessage`.
