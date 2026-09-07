# Master Progress Tracker — EPS Projects Website

Mirror of the Execution Blueprint §5. Update after **every** task.

**Status legend:** ☐ pending · ▶ in progress · ⛔ awaiting user · ✅ done · ✖ waived.

**Task-level tracking & resume:** the table below is the index. Underneath it,
keep **one entry block per task**, appended when a task first moves off ☐, in
the shape shown at the bottom — so any session (or a fresh Opus instance) can
resume mid-task from this file alone.

| ID     | Task                                 | Phase | Pri | Effort | Deps          | Status                                                      |
| ------ | ------------------------------------ | ----- | --- | ------ | ------------- | ----------------------------------------------------------- |
| T0.1   | Lessons + progress scaffold          | 0     | P0  | S      | —             | ✅                                                          |
| T0.2   | Version DB schema ⛔                 | 0     | P0  | L      | T0.1          | ✅                                                          |
| T0.3   | Dedup signed-image                   | 0     | P1  | M      | T0.1          | ✅                                                          |
| T0.4   | TanStack Query (optional)            | 0     | P2  | M      | T0.3          | ☐ deferred                                                  |
| T0.5   | Hide admin from crawlers             | 0     | P0  | S      | —             | ✅                                                          |
| T0.6   | Database architecture review         | 0     | P1  | M      | T0.2          | ✅                                                          |
| T1.1   | Harden public form                   | 1     | P0  | M      | T0.2          | ▶ code done, live test pending                              |
| T1.2   | Lead-status vocabulary ⛔            | 1     | P1  | M      | T0.2          | ✅ (kept generic, no DB change)                             |
| T1.3   | Status history timeline              | 1     | P2  | M      | T0.2,T1.2     | ▶ code done, live test pending                              |
| T1.4   | Email notification ⛔                | 1     | P1  | L      | T1.1          | ⏸ deferred (infra)                                          |
| T1.5   | Realtime inbox (optional)            | 1     | P2  | S      | T1.2          | ⏸ deferred (infra)                                          |
| T2.x⛔ | Phase-2 IA decision                  | 2     | P0  | —      | —             | ✅ (industries only; recommended nav split)                 |
| T2.1   | /industries page                     | 2     | P0  | M      | ⛔            | ▶ code done, live test pending                              |
| T2.2   | Searchable /faq                      | 2     | P1  | M      | ⛔,T0.3       | ⏸ deferred (IA: not built)                                  |
| T2.3   | /hse page                            | 2     | P2  | M      | ⛔            | ⏸ deferred (IA: not built)                                  |
| T2.4   | Nav + sitemap sync                   | 2     | P0  | S      | T2.1-3        | ▶ code done, live test pending                              |
| T3.1   | Company stats band                   | 3     | P0  | M      | —             | ▶ code done, live test pending                              |
| T3.2   | Credentials in footer ⛔(data)       | 3     | P0  | M      | —             | ▶ render done; ⛔ seed pending approval                     |
| T3.3   | Copy-rule pass                       | 3     | P0  | S      | —             | ✅                                                          |
| T3.4   | Homepage projects teaser             | 3     | P1  | M      | T0.3          | ▶ code done, live test pending                              |
| T3.5   | Hero messaging                       | 3     | P0  | S      | —             | ▶ code done, live test pending                              |
| T3.6   | Services de-generification ⛔(data)  | 3     | P0  | L      | T2.1\*        | ▶ code + data seeded; live render pending deploy            |
| T3.7   | Why Choose Us replacement            | 3     | P0  | S      | —             | ✖ waived — page + homepage section removed (2026-09-07)     |
| T3.8   | About approved copy                  | 3     | P0  | M      | —             | ▶ code done, live test pending                              |
| T3.9   | Contact roster ⛔                    | 3     | P0  | M      | —             | ▶ code done, live test pending                              |
| T3.10  | Seed clients ⛔                      | 3     | P1  | L      | T0.3          | ◐ infra done (policy+SEO); seeding pending list/assets      |
| T3.11  | Seed projects ⛔                     | 3     | P1  | L      | T3.4          | ☐                                                           |
| T3.12  | Admin CMS polish                     | 3     | P2  | M      | —             | ▶ code done, live test pending                              |
| T4.1   | Social meta ⛔(asset)                | 4     | P1  | S      | T5.4          | ☐                                                           |
| T4.2   | Structured data                      | 4     | P1  | S      | T3.9          | ▶ code done, live test pending                              |
| T4.3   | GA4 ⛔                               | 4     | P1  | S      | —             | ☐                                                           |
| T4.4   | Search Console + sitemap             | 4     | P1  | S      | T2.4          | ◐ doc done; ⛔ owner GSC verification pending               |
| T5.1   | Real dashboard                       | 5     | P1  | M      | —             | ▶ code done, live test pending                              |
| T5.2   | Role-gate admin UI                   | 5     | P0  | M      | T0.2          | ▶ code done, live test pending                              |
| T5.3   | Settings nav item ⛔                 | 5     | P2  | S      | —             | ▶ delivered by T8.2 (table + page + nav), live test pending |
| T5.4   | Own static assets ⛔                 | 5     | P0  | M      | —             | ▶ code done, live test pending                              |
| T5.5   | Favicon + app icons                  | 5     | P0  | S      | T5.4          | ▶ code done, live test pending                              |
| T6.1   | Build/lint gate                      | 6     | P0  | S      | —             | ✅ (CI-verified; workflow `.github/workflows/verify.yml`)   |
| T6.2   | Smoke tests                          | 6     | P1  | L      | T6.1          | ☐                                                           |
| T6.3   | A11y + responsive pass               | 6     | P1  | L      | T6.1,Ph3      | ☐                                                           |
| T6.4   | Production deployment ⛔             | 6     | P0  | L      | T6.1,T6.2,Ph3 | ☐                                                           |
| T6.5   | Launch checklist + handover          | 6     | P0  | M      | T6.4          | ☐                                                           |
| T7.1   | Complete CRUD audit                  | 7     | P1  | M      | —             | ✅ (audit matrix; docs/cms-audit.md)                        |
| T7.2   | Admin validation consistency         | 7     | P1  | M      | T7.1          | ▶ code done, live test pending                              |
| T7.3   | List state consistency               | 7     | P2  | M      | T7.1          | ▶ code done, live test pending                              |
| T7.4   | Search/pagination/bulk actions       | 7     | P2  | L      | T3.12,T7.1    | ☐                                                           |
| T7.5   | Upload consistency + storage hygiene | 7     | P1  | M      | T0.3,T7.1     | ▶ code done, live test pending                              |
| T7.6   | CMS coverage verification            | 7     | P1  | S      | T7.1,Ph3      | ☐                                                           |
| T8.1   | Projects split + Project Gallery     | 8     | P1  | L      | T7.5          | ▶ code done, migration + live test pending                  |
| T8.2   | Projects dropdown + gallery toggle   | 8     | P1  | M      | T8.1          | ▶ code done, migration + live test pending                  |

\*T3.6's strip link needs T2.1; the rest of T3.6 does not.

**Minimum launch set (all P0):** T0.1, T0.2, T0.5, T1.1, T2.1, T2.4, T3.1–T3.3,
T3.5–T3.9, T5.2, T5.4, T5.5, T6.1, T6.4, T6.5.

---

## Per-task entry blocks

### T8.2 — Projects navbar dropdown + Project Gallery CMS toggle [▶ code done, migration + live test pending, 2026-08-03]

User-requested follow-up to T8.1. Two changes: (a) replace the Projects sub-navigation strip
with a **dropdown on the navbar's Projects entry**, holding Project Directory and Project
Gallery; (b) add a **CMS-controlled toggle** that decides whether Project Gallery is listed
and publicly reachable at all, so the feature can ship built-but-hidden until the business
decides to publish it. Constraint given (same as T8.1): reuse the existing CMS and
architecture patterns; no UI redesign, no architecture change.
Done (code):

- **Migration `20260803010000_site_settings.sql`** — new `public.site_settings`: one row per
  boolean toggle, `key` as PK, plus `enabled`, `label`, `description`, `sort_order` and the
  standard `touch_updated_at` trigger. Deliberately **not** a jsonb key/value store: every
  content table here uses plain typed columns and every setting the site needs is a yes/no
  switch. Carrying `label`/`description` in the row is what lets the CMS page render
  generically. RLS: **select open to anon** (the navbar must know the flag before anyone
  signs in — so this table is for publicly-observable flags only, never secrets) +
  the usual `is_staff()` write policy. Seeds `project_gallery_enabled` at **false**, with
  `on conflict do nothing` so a re-run never clobbers a value staff has set.
- **`src/lib/site-settings.ts`** — `SITE_SETTING_KEYS` (typed keys, so a typo is a compile
  error rather than a silently-false flag), `fetchSiteSetting()` and a `useSiteSetting()`
  hook in the same shape as `useSignedUrl`. **Fails closed** on every path — missing row, RLS
  denial, network error, and a throwing client (the supabase proxy throws on construction if
  the env vars are absent). That last case was found in local testing: it turned the route
  guard's 404 into an error page, which would have advertised the page's existence.
- **Navbar** — the Projects entry is **always** a `DropdownMenu` (existing shadcn primitive);
  the toggle controls only whether Project Gallery is one of its items, so with the gallery
  off the menu still opens and offers Project Directory alone. The menu content is portalled
  outside the nav, so it re-declares `dark` + `nav-surface-solid` to stay visually continuous.
  Mobile has no popup: the subpages are listed inline under a non-interactive "Projects"
  heading, which is the normal drawer idiom, rendered unconditionally to match desktop.
  (First cut collapsed the entry to a plain link when only one item remained — the user
  rejected that: the navbar's structure must not change with content.)
- **`ProjectsSubNav.tsx` deleted** and removed from both Projects pages — the dropdown
  replaces it, and the pages are otherwise untouched.
- **Route guard** — `/projects/gallery` throws `notFound()` from `beforeLoad` (before render,
  and on the SSR pass) when the toggle is off, so it renders the root 404. `?preview=<token>`
  is **exempt**: those links are already gated by T8.1's `preview_token` + `preview_enabled`
  pair in the DB, and showing unpublished work to a client is exactly what that feature is
  for — including while the public gallery is still switched off. This is the intended way to
  review the gallery before launch.
- **Footer** quick link is filtered out while the toggle is off (filter, not conditional
  spread, so the entries keep the literal `to` types `<Link to>` type-checks against).
- **`sitemap.xml`** — the `/projects/gallery` entry is removed and replaced by a comment
  holding the exact markup to restore, since listing a URL that 404s is worse than omitting it.
- **CMS `/admin/settings`** (closes the long-open T5.3) — renders whatever rows exist, using
  each row's own label/description, with an optimistic `Switch` that reverts + toasts on a
  failed write. Adding a future toggle is therefore one INSERT and no CMS code. Nothing is
  created or deleted from the UI, because a toggle only means anything if code reads its key.
  Sidebar entry added (`Settings` icon), replacing the "intentionally omitted until T5.3"
  comment. The dashboard's count-cards grid is left alone — those cards show published/total
  for content tables, which a settings table has no analogue for.
- **`types.ts`** hand-extended with `site_settings` so the typed client works before Lovable
  regenerates; `routeTree.gen.ts` regenerated by the local `vite build`.

Build: all four CI steps ran locally and passed — `format:check` clean, `lint` 0 errors
(7 pre-existing warnings, none in new files), `typecheck` 0 errors, `build` succeeded.
Behaviour verified against a local dev server (no Supabase credentials locally, so the flag
read fails closed = "off"): with the flag off the Projects dropdown opens with Project
Directory only, there is no sub-nav strip, and `/projects/gallery` renders the 404 page;
with `fetchSiteSetting` temporarily stubbed to `true`, the same dropdown also lists Project
Gallery and the gallery route renders normally. Stub removed afterwards.
DB: **migrations not yet applied** — both `20260803000000` (T8.1) and `20260803010000`
(this task) need a Lovable sync or a direct run. Until then `site_settings` does not exist,
the read fails closed, and the gallery stays hidden — which is the desired shipped state.
Remaining (DoD): apply both migrations; then live-check — /admin/settings lists
"Enable Project Gallery" as Off; with it Off confirm the Projects dropdown opens with
Project Directory only, the footer has no gallery link, and /projects/gallery 404s for a
signed-out visitor while a `?preview=<token>` link still works; flip it On and confirm
Project Gallery joins the same dropdown on desktop and mobile, the footer link returns, and
the gallery route loads; flip it back Off and re-confirm; then run the outstanding T8.1
gallery checks.
Files: +supabase/migrations/20260803010000*site_settings.sql, +src/lib/site-settings.ts,
+src/routes/\_authenticated/admin/settings.tsx, −src/components/site/ProjectsSubNav.tsx,
src/components/site/Navbar.tsx, src/components/site/Footer.tsx, src/routes/projects.tsx,
src/routes/projects*.gallery.tsx, src/routes/\_authenticated/admin/route.tsx,
src/integrations/supabase/types.ts, src/routeTree.gen.ts, public/sitemap.xml, PROGRESS.md.

### T8.1 — Projects split + Project Gallery [▶ code done (committed), migration + live test pending, 2026-08-03]

User-requested feature (outside the original blueprint): split Projects into **Project
Directory** (the existing `/projects`, retained as-is) and **Project Gallery**
(`/projects/gallery`), both CMS-driven, with a Public / Private-Preview visibility option
and a cover image per image. Constraint given: feature enhancement only — no architecture,
routing, DB-philosophy, CMS-architecture or folder-structure changes; reuse existing
patterns; extend the DB minimally; stay backward compatible.
Done (code):

- **Migration `20260803000000_project_gallery.sql`** — new `public.project_images`
  (project_id FK cascade, image_url, optional caption/location/category, sort_order,
  published, `is_cover`, visibility CHECK public|private) + `touch_updated_at` trigger + the
  standard public-read / staff-write RLS pair. Public read additionally requires the **parent
  project to be published** (EXISTS subquery, itself filtered by the existing projects policy).
  **Partial unique index** `(project_id) where is_cover` enforces at most one cover per project
  in the DB — which is why the CMS clears the old cover before setting the new one.
  Two columns added to `public.projects`: `preview_token uuid` (unique, defaulted) and
  `preview_enabled boolean default false`. New SECURITY DEFINER
  `get_preview_gallery_images(uuid)` granted to anon+authenticated — RLS cannot read a query
  parameter, so token access has to be a function (see lesson 19).
- **Public**: new `src/routes/projects_.gallery.tsx` (trailing-underscore = non-nested, so
  `projects.tsx` is NOT promoted to a layout and did not move). Groups images by project and
  fronts each group with its cover thumbnail (falls back to the first image); reuses
  `SignedImage` + the /projects card/loading/error/empty idiom; `?preview=<token>` switches
  the read to the RPC and shows an amber "Private preview" banner.
- **Sub-nav**: new `src/components/site/ProjectsSubNav.tsx` rendered on both pages. The
  navbar is untouched — user chose the tab-strip option over a navbar dropdown.
  **Superseded by T8.2**: the user reversed this call; the strip is deleted and the navbar's
  Projects entry is now the dropdown. Read the rest of this block as history.
- **CMS**: new `src/routes/_authenticated/admin/project-gallery.tsx`, cloned from the Projects
  manager (same zod shape, same `pendingUpload` orphan-prevention, same Live/Draft badge,
  same delete-with-storage-cleanup). Adds a project filter, ↑/↓ reordering (swap + renumber
  0..n-1, so galleries left at the default `sort_order = 0` still move), a Visibility select,
  a Cover switch plus a one-click cover star in the list, and a per-project preview-link panel
  (enable switch, copy, regenerate-with-confirm).
- **Wiring**: admin sidebar entry (`Images` icon), footer quick link, `sitemap.xml`
  (priority 0.6), `routeTree.gen.ts` (hand-synced, then confirmed correct by the local
  `vite build`, which regenerates it), hand-added `types.ts` entries (table, two columns,
  RPC signature) so the typed client works before Lovable regenerates.
- Storage reuses the `project-images` bucket under a `gallery/` prefix — lesson 16's
  anon-read policy already covers it, so no storage migration.

Naming: the section is "Project Gallery" throughout the UI, routes and CMS, but the table
stays `project_images` — the rows are images of a project, and one gallery per project is
implied by `project_id`.
Build: **all four CI steps ran locally and passed** — `format:check` (clean),
`lint` (0 errors; 7 pre-existing warnings, none in new files), `typecheck` (0 errors),
`build` (succeeded, and regenerated `routeTree.gen.ts` in agreement with the hand edits).
This reverses lesson 02's "cannot verify locally": node v26.4.0 turned out to be installed,
and the packages missing from the partial `node_modules` (typescript) can be fetched by
extracting the npm tarball directly, bypassing the Defender-blocked bun cache move.
`bun install` itself still fails. Commands recorded in lesson 19; lesson 02 annotated as
partly superseded.
Also fixed (user-requested, in scope): `format:check` had been **failing on `main`** for five
untouched files — `About.tsx`, `ContactInfo.tsx`, `Services.tsx`, `WhyChooseUs.tsx`,
`routes/industries.tsx`. Reformatted; diffs are pure JSX line-wrapping, no functional change.
DB: **migration not yet applied** — needs Lovable sync or a direct run.
Remaining (DoD): apply the migration; then live-check — add a gallery image in the CMS,
publish it, confirm it renders at /projects/gallery; mark one as Cover and confirm it fronts
the project group and that setting a second cover moves the flag; mark one Private Preview
and confirm it is absent for a normal visitor; enable the preview link and confirm it appears
via `?preview=`; regenerate and confirm the old link goes empty; confirm /projects is
visually unchanged apart from the sub-nav strip (T8.2: the strip is gone, so /projects should
now be visually unchanged from before T8.1 entirely). Note the gallery checks require the
T8.2 `project_gallery_enabled` toggle to be On, or a `?preview=<token>` link.
Files: +supabase/migrations/20260803000000*project_gallery.sql,
+src/routes/projects*.gallery.tsx, +src/routes/\_authenticated/admin/project-gallery.tsx,
+src/components/site/ProjectsSubNav.tsx, +lessons/19-project-gallery-and-private-preview.md,
src/routes/projects.tsx, src/components/site/SignedImage.tsx, src/components/site/Footer.tsx,
src/routes/\_authenticated/admin/route.tsx, src/integrations/supabase/types.ts,
src/routeTree.gen.ts, public/sitemap.xml, lessons/02-no-local-js-runtime.md, PROGRESS.md;
formatting-only: src/components/site/{About,ContactInfo,Services,WhyChooseUs}.tsx,
src/routes/industries.tsx.
Commit: (see git log — "T8.1: split Projects into Directory + Gallery…").

### T7.5 — Upload consistency & storage hygiene [▶ code done (local commit), live test pending, 2026-07-15]

No ⛔ (P1, deps T0.3 ✅ + T7.1 ✅; admin-facing, additive, no Design Lock exposure, no business
facts, no DB/schema change). Next unblocked task per §0.1.3 after T7.3 landed (T7.4 still blocked —
dep T3.12 is ▶ not ✅; T6.2/T6.3/T6.4/T6.5 blocked as before). Fixes the two T7.1 follow-ups routed
here + adds the storage-hygiene doc.
Root cause (T7.1 audit): each `handleUpload` removed the OLD object at **upload time**, before save
— so replace-then-**cancel** left the DB row pointing at a deleted object (broken ref) and an
upload-then-cancel left the new object orphaned. Fix = **defer cleanup to the outcome**.
Done (code), identical shape in all three uploading managers (projects/clients/credentials):

- **New `src/lib/upload.ts`** (shared, mirrors the T0.3 lib pattern): `validateUploadFile(file,kind)`
  → clear message on wrong type / oversize, and `UPLOAD_ACCEPT` for the file-picker. Kinds: `image`
  (5 MB; png/jpeg/webp/gif/svg/avif) and `document` (10 MB; pdf + those images). Pure module, no deps.
- **Client-side validation**: `handleUpload` now calls `validateUploadFile(...)` FIRST and toasts +
  returns on failure (the missing pre-upload type/size gate — T7.1 follow-up #2). File inputs use
  `accept={UPLOAD_ACCEPT.image|document}` so the picker and the validator agree (was `image/*` /
  `application/pdf,image/*`).
- **Deferred cleanup** (T7.1 follow-up #1): new `pendingUpload` state = the path uploaded in the
  current unsaved dialog session. `handleUpload` removes only a _prior_ `pendingUpload` (repeated
  re-uploads before save), never the saved object. `handleSave` (on success) removes the object it
  **replaced** (`editing.<col>` if changed) then clears `pendingUpload`. New `closeDialog()` discards
  an uploaded-but-unsaved object on Cancel/Esc/overlay (wired via `onOpenChange={(o) => !o &&
closeDialog()}` + the Cancel button); `pendingUpload` reset in openCreate/openEdit. Programmatic
  close after save doesn't fire onOpenChange (Radix controlled), so no double-remove; even if it did,
  `pendingUpload` is already null. `closeDialog` uses fire-and-forget (`void …remove`) for a snappy
  cancel; save/upload keep `await` (match the existing delete-path style).
- **Delete path unchanged** — already removes `target.<col>` after the DB delete (T7.1: correct).
- "Upload progress/failure distinct from form save" already held (separate `uploading` spinner +
  "Upload failed" vs "Save failed" toasts) — no change.
  Orphan matrix now: replace+save → old removed, new kept; replace+cancel → old kept, new removed;
  create+cancel → new removed; re-upload-before-save → prior unsaved removed. No leak either way.
  Docs: new **docs/storage-hygiene.md** — bucket↔column map (project-images/image_url,
  client-images/logo_url, documents/document_url), the upload lifecycle, and a manual orphan-review
  procedure (list objects vs referenced paths, ignore <1-day-old, remove the diff).
  Verification: static — git diff = the 3 managers (+99/−16) + new src/lib/upload.ts + docs; per file
  (grep-confirmed): validateUploadFile + UPLOAD_ACCEPT imported & used, `pendingUpload` threaded
  (10 refs each), `closeDialog` def+onOpenChange+Cancel (3 each), ZERO leftover upload-time
  `form.<col> !== path` removes, delete-path `remove([target.…])` intact (1 each), braces balanced,
  no line >100 cols (prettier printWidth — enforced as an eslint error via eslint-plugin-prettier).
  `validateUploadFile` types typed as `readonly string[]` so `.includes(file.type)` is assignable.
  Local eslint/build unavailable (Defender EPERM, lesson 02) → CI verify.yml is the gate. Admin routes
  need the user's auth session + real storage to exercise, so the live DoD (oversized/wrong-type
  rejected with a message; replace/delete/cancel leave no orphan in a manual bucket check) is pending —
  consistent with the other admin tasks. DB: none. CMS: none.
  Docs: no WEBSITE_CONTENT_GUIDE change (admin-only UI, no public copy/business facts). No new lesson
  (deferred-cleanup + shared-validator follow the established lib/admin patterns; the reusable
  procedure lives in docs/storage-hygiene.md, its proper home).
  Files: src/lib/upload.ts (new); src/routes/\_authenticated/admin/{projects,clients,credentials}.tsx;
  docs/storage-hygiene.md (new); PROGRESS.md.
  Commit: (below) "T7.5: unify uploads, defer storage cleanup to save/cancel, add validation".

### T7.3 — Loading/error/empty state consistency [▶ code done (local commit), live test pending, 2026-07-14]

No ⛔ (P2, dep T7.1 ✅; admin-facing, additive, no Design Lock exposure, no business facts, no
DB/schema change). **Task-selection note:** picked strictly per Blueprint §0.1.3/§0.6.6 ("lowest-
numbered unblocked task whose dependencies are ✅"). After T7.2, everything lower-numbered is
blocked — T6.2 (DoD "suite passes **locally**" is unreachable: no local JS runtime / `bun install`
blocked, lesson 02), T6.3 (Ph3 not complete + runtime), T6.4 ⛔, T6.5 (dep T6.4), T7.4 (dep **T3.12**
is ▶ not ✅) — so T7.3 (dep T7.1 ✅) is the lowest-numbered unblocked task. It outranks T7.5 by
task order even though T7.5 is P1: §0.1.3 selects by number, not priority, and "do not skip tasks"
forbids jumping T7.3. (T7.5 becomes the next pick once T7.3 lands.)
Done (code) — normalized all SEVEN admin managers to the contact-management three-state pattern
(the DoD's reference), touching ONLY the load function + the top of each `<TableBody>`:

- **Loader row while fetching**: `{loading && (<TableRow>…Loader2 spin + "Loading {noun}…"</TableRow>)}`
  — contact-management already had it; added the identical row to the other six (projects, clients,
  services, faq, hse, credentials).
- **Error state with a _visible retry affordance_** (the real gap — every manager previously only
  fired a `toast.error` on load failure, then fell through to the empty state, so a failed load
  looked like "no rows yet"): added a `loadError` boolean (`setLoadError(!!error)` in each `load()`,
  one line) and an error `<TableRow>` — "Couldn't load {noun}." + an outline **Retry** button
  (`onClick={load}`, `RefreshCw` icon) — shown when `!loading && loadError`. All seven now carry it.
- **Instructive empty state**: already present in all seven ("No {noun} yet. Click "New {X}"…";
  contact-management's "No enquiries yet." kept — public form owns creation, no Add button). Now
  guarded with `!loadError` so it no longer masquerades for a failed load; the filtered-empty row
  (search managers) likewise gated on `!loadError`.
  Consistency choices: loader/error rows use contact-management's exact markup (`border-zinc-800
hover:bg-transparent`, `colSpan` = each table's column count [contact 8 / projects 8 / clients 6 /
  services 6 / faq 5 / hse 6 / credentials 9], `text-center text-slate-500 py-10`). The row `.map`
  was left UNGUARDED (matching the reference) — during load/error the source array is empty so it
  renders nothing; briefly reverted an over-guard I'd added to the three no-search managers to keep
  all seven identical on reload.
  Verification: static — git diff = the 7 admin managers only (+192/−18 pre-format); per file: RefreshCw
  imported+used (2 hits), `loadError` decl+setter+render-guards present, exactly one loader row, braces
  balanced (grep-counted), zero leftover unguarded `!loading && rows.length === 0`, 7 Retry buttons.
  credentials.tsx lucide import exceeded printWidth:100 → pre-broke it multiline as `prettier --write`
  would (format is the CI gate). Local eslint/build unavailable (Defender EPERM, lesson 02) → CI
  verify.yml is the gate. Admin routes need the user's auth session to exercise, so the live DoD
  (force a load failure → error row + Retry re-fetches; slow load shows loader; empty table shows the
  instructive row) is pending — consistent with the other admin tasks. DB: none. CMS: none.
  Docs: no WEBSITE_CONTENT_GUIDE change (admin-only UI, no public copy/business facts). No new lesson
  (additive UI following the established admin-manager + contact-management patterns; nothing non-obvious).
  Files: the seven admin managers under src/routes/\_authenticated/admin/; PROGRESS.md.
  Commit: (below) "T7.3: normalize loading/error/empty states across the seven admin managers".

### T0.1 — Lessons + progress scaffold [✅ done (local commit), 2026-07-07]

Commits: `582cb13` "T0.1: add lessons/ scaffold, first lessons, and PROGRESS.md" (+ this status amend).
Done: `lessons/README.md` (protocol per §0 rule 7); `lessons/01-contact-form-already-wired.md` (cites ContactForm.tsx:41); `lessons/02-no-local-js-runtime.md` (environment blocker); this `PROGRESS.md` created from §5. All committed locally on `main`.
Remaining (not part of DoD): resolve how commits reach the connected repo — the clone is in an ephemeral scratchpad and push needs the user's GitHub credentials.
Resume notes: working clone is at `C:\Users\Dell\eps-web` (moved off scratchpad for MAX_PATH). bun 1.3.14 installed but `bun install` blocked by Defender EPERM; per user, verify code tasks via CI/Lovable builds (lesson 02). Commit locally; user's GitHub/Lovable integration propagates — no PAT (lesson 03).
Completion report: see chat report for T0.1.

### T0.2 — Version the database schema [✅ done (local commit), 2026-07-07]

Method: Lovable-native, read-only DB introspection via `query_database` (MCP) — no Supabase CLI (backend is Lovable-managed; user has no direct Supabase admin). Live DB = source of truth, cross-checked vs types.ts + plan.md. No modifying SQL executed.
Done: reconstructed the full public schema (enum, 10 tables, PK/FK/unique, 5 functions, 10 triggers, RLS enable + all policies, grants) into `supabase/migrations/20260628000000_baseline_schema_reconstructed.sql`, labeled NON-executable (all objects already exist in prod). Storage-object policies left in the existing fragment migration; buckets documented as reference. Discrepancies vs plan.md recorded in `lessons/04-db-schema-verified-via-lovable.md`.
Verified: types.ts matches live exactly; contact_submissions has anon INSERT + staff SELECT/UPDATE/DELETE; contact status-change trigger EXISTS (contact_status_history_trg → log_contact_status_change); handle_new_user + on_auth_user_created exist; user_roles self-read policy exists; RLS enabled on all 10 tables; 3 buckets private.
Discrepancies (see lesson 04): (1) content public-read is `(published OR is_staff())`, stricter than plan.md's `USING (true)` — keep. (2) contact_status_history protection is trigger+no-INSERT-policy, not "service_role grant only"; grants are blanket Supabase defaults so RLS is the sole boundary.
Follow-up (raised separately post-T0.2, not yet actioned): whether a hand-written baseline belongs in `supabase/migrations/` for a Lovable-managed project (risk of Lovable/`db push` trying to re-apply) or should live elsewhere.
Commit: df8f412 "T0.2: reconstruct live DB baseline via Lovable read-only introspection".

### T0.3 — Deduplicate signed-image rendering [✅ done (local commit), 2026-07-07]

Done: extracted `src/lib/use-signed-url.ts` (`getSignedUrl` = the single `createSignedUrl` call; `useSignedUrl` reactive hook) and `src/components/site/SignedImage.tsx` (shared admin renderer, param by bucket/className/fit). Refactored all 5 sites: public SignedProjectImage/SignedLogo now call the hook (unique markup kept verbatim); admin projects/clients use the shared SignedImage (object-cover/object-contain); credentials openSignedUrl uses getSignedUrl.
Verified: `grep createSignedUrl src -r` → 1 hit; all touched markup byte-identical; credentials error-toast behavior preserved via {url,error}. Blueprint §1.5 correction: credentials had no SignedImage, only openSignedUrl (lesson 05).
Build: NOT run locally (bun install blocked by Defender, lesson 02); verification by grep + type reasoning; defer to CI/Lovable.
Files: +src/lib/use-signed-url.ts, +src/components/site/SignedImage.tsx, routes/projects.tsx, routes/clients.tsx, admin/projects.tsx, admin/clients.tsx, admin/credentials.tsx.
Commit: 0a9372e "T0.3: deduplicate signed-URL rendering into a shared hook + SignedImage".

### T0.4 — Adopt TanStack Query for public reads [☐ deferred, 2026-07-07]

Decision (Blueprint + user): explicitly optional and off the critical path — "Do it only after Phase 3 content lands, or skip for launch. No other task hard-depends on it." Deferred for now; not waived. Revisit after Phase 3 content, or skip for launch.

### T0.5 — Hide admin from crawlers [✅ done (local commit), 2026-07-07]

Done: `public/robots.txt` gains `Disallow: /admin` (kept Allow:/ + Sitemap line); `admin.login.tsx` head() composes `{name:"robots",content:"noindex,nofollow"}` onto buildPageHead; `_authenticated/admin/route.tsx` gains a head() emitting the same meta. Shared site.ts/buildPageHead untouched.
Note: both admin surfaces are ssr:false, so the noindex meta is client-side; robots.txt is the real crawler gate (lesson 06). Relevant to T4.1/T4.2.
Build: NOT run locally (Defender, lesson 02); changes are a static file + two head() additions, type-checked by hand; defer to CI/Lovable.
Files: public/robots.txt, src/routes/admin.login.tsx, src/routes/\_authenticated/admin/route.tsx.
Commit: d4e9c98 "T0.5: hide admin from crawlers".

### Project directive — sole-owner + business-data gate [active from 2026-07-07]

User directive: Claude is now sole engineer/architect/reviewer/QA owner; Lovable is OUT
of the active dev workflow (never defer validation to it — do strongest static verification

- document residual risk + manual checklist). MANDATORY: no factual business data
  implemented/displayed/seeded/published/modified without explicit per-item approval in THIS
  project, even if in the blueprint — verify read-only first, present, wait. Full details in
  lessons/14-ownership-and-business-data-directive.md.

### Project directive — Content Classification Policy [canonical, doc-only, 2026-07-08]

User adopted a project-wide governance rule (also finalizes how the future Lovable credentials
portal is used). Three tiers: (1) Public Website = marketing/lead-gen — NO quantified
commercial/performance claims (cost %, ROI, OEE/PLF, energy savings, productivity, execution
speed, client-specific outcomes, pricing, commercial commitments); only explicitly-approved
factual company metrics. (2) Credentials Portal (restricted) = case studies, performance
metrics, OEE/PLF, energy savings, ROI, brochures — quantified outcomes only after explicit
business approval. (3) Proposals/meetings = pricing, terms, guarantees, financials.
Source hierarchy (finalized 2026-07-08): Website Blueprint → Approved Owner Decisions/
Directives → WEBSITE_CONTENT_GUIDE.md → EPS deck (deck is primary for messaging/positioning
but SUBJECT TO the governance above). Future rule: deck-sourced quantified
outcomes are Credentials-Portal-by-default, NOT auto-published publicly — directly governs
**T3.11** (deck slide 8 outcomes like "30% OEE", "₹2.5 Cr/yr", "35% Efficiency Gain" stay OFF
the public site). Recorded in docs/WEBSITE_CONTENT_GUIDE.md → "Content Classification Policy".
No code change (implementation already complies after the T3.7 revision, ee751a3).

### T3.10 (infra prep) — client-images public read + /clients SEO [▶ code done (local commit), 2026-07-11]

⛔ CHECKPOINT — client SEEDING is NOT done here (awaiting the user's approved client list +
logo assets; explicitly out of scope for this step). This step is the approved infra prep only.
Architecture assessment (approved): the clients CMS already fully supports CMS-driven manage
(admin create/edit/delete/upload/publish + sort_order ordering; public /clients + ClientsBanner
query the live table; no hardcoded names in the render path). One real gap found + fixed here;
one content fix done.
Done (code, c6fe2dd):

1. **Storage policy** (`supabase/migrations/20260711000000_client_images_public_read.sql`):
   added a bucket-scoped `anon, authenticated` SELECT policy on `storage.objects` for
   `client-images` ONLY. Root cause: the bucket is PRIVATE (public=false) and had only staff
   policies, so anon `createSignedUrl` was denied → public client logos would never render
   (names/text still would). Bucket stays private; existing signed-URL flow unchanged; other
   buckets + all writes untouched. Idempotent (drop-if-exists + create); also applied live via
   query_database MCP for verification.
2. **SEO** (`src/routes/clients.tsx`): removed the hardcoded client names (Triveni Engineering,
   DCM Shriram, JSW, Aditya Birla Group) from the /clients meta description → generic sector-
   based copy consistent with the content guide + the page's own subtitle. String-only change;
   no data-flow/logic change.
   Verification (live, read-only): `pg_policies` — the only anon-roled storage policy is SELECT
   scoped to `bucket_id='client-images'`; project-images/documents remain staff-only (authenticated

- is_staff); no anon write policy anywhere. `has_table_privilege('anon','storage.objects',
'SELECT') = true` and `relrowsecurity = true` → anon can obtain signed URLs for client logos,
  and RLS still hides all other buckets from anon. `clients` table = 0 rows (clean insert at seed
  time). End-to-end signed-URL render against a real object confirmed at seed time (no logo exists
  yet). No code change needed in clients.tsx (render/signed-URL flow) or ClientsBanner.tsx
  (name-cards only) — confirmed via diff (clients.tsx = SEO string only; ClientsBanner untouched).
  Local eslint/build unavailable (Defender EPERM, lesson 02).
  Scope guard honored: no seeding, no logo uploads, no refactor/redesign, no other buckets/policies
  touched, backwards compatible.
  Docs: new **lesson 16** (public read on a private CMS bucket — applies identically to
  project-images at T3.11); content guide SEO/Messaging gains the generic /clients description.
  Remaining for T3.10 (next task, after user provides list + assets): seed the 15 approved client
  rows (§7.7) + upload logos via the admin CMS path, then verify /clients + banner render.
  Files: supabase/migrations/20260711000000_client_images_public_read.sql, src/routes/clients.tsx;
  PROGRESS.md, lessons/16-public-read-on-private-cms-bucket.md, docs/WEBSITE_CONTENT_GUIDE.md.
  Commit: c6fe2dd "T3.10 (infra): public read policy for client-images; de-hardcode /clients SEO";
  docs in follow-up.

### T3.12 — Admin CMS usability polish [▶ code done (local commit), live test pending, 2026-07-12]

No ⛔ (P2, no deps, additive UI, no business facts, no DB/schema change). Resumed after the
canonical-repo recovery/sync; strict-next tasks T3.10-seed and T3.11 remain ⛔-blocked on
user-provided assets, so proceeded with the next unblocked task.
Done (code) — client-side search/filter added to the four admin managers, per §T3.12, WITHOUT
altering any table layout:

- **contact-management.tsx**: search-by-name Input + a status filter Select ("All statuses" +
  STATUS_OPTIONS). Reuses the existing `contact-status` helpers (statusLabel) for the options.
- **projects.tsx / clients.tsx**: search-by-title (the `name` field) Input.
- **faq.tsx**: search-by-title (the `question` field) Input.
  Pattern (identical in all four): a `search` (+ `statusFilter` for contacts) state; a
  `filtered = useMemo(...)` over the already-loaded `rows`; a toolbar `<div>` placed BETWEEN the
  header and the `<Card>` (never inside the table); table body renders `filtered.map` instead of
  `rows.map`; subtitle shows `"{filtered} of {total}"` while filtering; and a graceful
  "No … match your search" row (same colSpan as the existing empty state) when `rows>0 &&
filtered===0`. Purely client-side over loaded rows — no new queries, no backend/RLS/DB change.
  Verification: static — git diff = the 4 admin pages only (+133/−12); no `TableHead`/existing
  `colSpan`/`grid-cols` changed (grep-confirmed); no dangling `count` refs; no `rows.map` left in
  the tables (all `filtered.map`); `Input` imported in all four (added to contact-management,
  already present in the others); `useMemo` already imported everywhere. Local eslint/build
  unavailable (Defender EPERM, lesson 02). Admin routes need an authenticated session to
  exercise (credentials are the user's), so live filtering test is pending — consistent with the
  other admin tasks. DB: none. CMS: none.
  Note for **T7.4** (Search/pagination/bulk actions): this establishes the client-side
  filter pattern to extend later (server-side search/pagination if row counts grow).
  Docs: no WEBSITE_CONTENT_GUIDE change (admin-only UI, no public copy/business facts). No new
  lesson (additive UI following the established admin-manager pattern; nothing non-obvious).
  Files: the four admin pages under src/routes/\_authenticated/admin/; PROGRESS.md.

### T5.4 + T5.5 — Own the logo + favicon/app icons [▶ code done (local commit), live test pending, 2026-07-14]

⛔ CHECKPOINT CLEARED — user supplied the two official brand assets (Downloads/publiceps-logo.png,
publiceps-mark.png), authorized their exact use ("do not redesign/recolor/recreate"), and directed
keeping the Unsplash section photography unchanged (out of scope). Deps: none (T5.4) / T5.4 (T5.5).
Assets (copied byte-exact into public/, md5-verified vs source; visually confirmed before use):

- `public/eps-logo.png` — full "EPS Projects Private Limited" logo (496×333 RGBA, transparent).
- `public/eps-mark.png` — EPS symbol only (383×227 RGBA, transparent); source for all icons.
  **T5.4** — replaced the emergentagent CDN URL in all 4 reference sites: Navbar.tsx:54 (no invert,
  full color), Footer.tsx:47 (`brightness-0 invert` preserved), admin.login.tsx:60 (`brightness-0
invert` preserved) → `/eps-logo.png`; site.ts SITE_LOGO → `` `${SITE_URL}/eps-logo.png` `` (kept
  ABSOLUTE — it feeds the **root JSON-LD Organization/LocalBusiness `logo`/`image`, which crawlers
  need as absolute URLs; a relative path would break them). `grep emergentagent src/` → NONE.
  **T5.5** — generated from eps-mark.png via Pillow (mark centered on a square canvas, ~8% margin,
  no recolor): `favicon.ico` (16/32/48 multi-res), `favicon-16x16.png`, `favicon-32x32.png`
  (transparent); `apple-touch-icon.png` 180 and `android-chrome-192x192.png`/`-512x512.png`
  (composited on WHITE — iOS/Android render transparency as black); `site.webmanifest` (name/
  short_name from SITE_NAME, the two android icons, theme_color #000000 to match head, background
  #fff, display standalone). Wired into **root.tsx head() links: 3 favicon `<link>`s + apple-touch +
  `rel="manifest"`. Existing `theme-color: #000000` meta left as-is (DoD "emit …plus theme-color" —
  already present). Android icons referenced via the manifest (standard), not duplicate link tags.
  Decisions (flagged, user-approvable): (1) apple-touch + android icons on white bg (neutral; avoids
  black tile); favicons stay transparent. (2) SITE_LOGO kept absolute. (3) added the modern icon
  set + manifest per the user's pre-commit enhancement request.
  Verification: static — code diff = 5 files (Navbar/Footer/admin.login/site.ts/**root); no styling/
  class changes beyond the src swaps (diff-confirmed); manifest valid JSON (python json.load);
  icons visually confirmed (apple-touch, favicon-32 centered, gradient intact); .gitignore does not
  exclude any public asset (git check-ignore → none). Local eslint/build unavailable (Defender EPERM,
  lesson 02). DB: none. CMS: none.
  Remaining (owner/deploy-side, live DoD): after deploy, confirm the EPS logo renders in navbar
  (color) + footer/admin-login (white via invert); browser tab shows the EPS icon on all routes;
  `/favicon.ico`, `/site.webmanifest`, and each icon return 200 (no 404); optionally add-to-homescreen
  on Android/iOS shows the mark. No new lesson (asset self-hosting + icon generation are standard;
  nothing non-obvious beyond the absolute-SITE_LOGO note captured here).
  Files: public/{eps-logo.png,eps-mark.png,favicon.ico,favicon-16x16.png,favicon-32x32.png,
  apple-touch-icon.png,android-chrome-192x192.png,android-chrome-512x512.png,site.webmanifest};
  src/components/site/Navbar.tsx, src/components/site/Footer.tsx, src/routes/admin.login.tsx,
  src/lib/site.ts, src/routes/**root.tsx; PROGRESS.md.
  Commit: (below) "T5.4/T5.5: self-host EPS branding and add favicon/app icons".

### T4.4 — Search Console + sitemap freshness [◐ doc done (local commit); ⛔ owner GSC verification, 2026-07-13]

No code ⛔; the ⛔ is inherent — actual Google Search Console registration/verification is
owner-performed (needs the Google account + DNS access). Dep T2.4 ✅. Picked after T5.1 per user.
Sitemap audit → **NO CHANGE needed**: `public/sitemap.xml` already lists all 10 live public
routes with sensible priorities, and `/admin/login` is correctly excluded (robots Disallow:/admin

- noindex, T0.5/lesson 06). Domain `https://www.epsprojects.in` is consistent across SITE_URL
  (site.ts), sitemap.xml, and robots.txt. Audited every `src/routes/*.tsx` public route against the
  sitemap (script-confirmed 0 missing). Deliberately did NOT add `<lastmod>` (would be fabricated
  timestamps; not required by the goal) — flagged, can add real values on request.
  Done (doc): new **`docs/SEARCH_CONSOLE_SETUP.md`** — owner guide: add property (Domain, DNS-TXT
  recommended — HTML-tag/file methods noted as they'd need a code change, kept out of scope), verify
  ownership, submit `sitemap.xml`, confirm sitemap/robots reachable, request indexing, verify
  www + https canonical redirects, ongoing coverage checks (incl. `/admin/*` must NOT appear), a
  10-URL reference table, a keep-in-sync note (T2.4/lesson 11), and a deployment-checklist note to
  re-submit/audit the sitemap in Search Console whenever a public route changes. Placed in `docs/`
  to match the existing doc convention (db-review.md, WEBSITE_CONTENT_GUIDE.md).
  Verification: static — git diff = docs/SEARCH_CONSOLE_SETUP.md (new) + PROGRESS.md only;
  sitemap.xml untouched (git diff --quiet confirmed); route→sitemap coverage script = all 10 present,
  none missing. No code change → no build concern (lesson 02 n/a). DB: none. CMS: none.
  Remaining (owner-performed, ⛔): register epsprojects.in in GSC, verify ownership (DNS TXT),
  submit sitemap.xml, confirm non-www→www + http→https redirects. Flip to ✅ once the owner reports
  the property verified + sitemap accepted.
  Docs: no WEBSITE_CONTENT_GUIDE change (this is an SEO/ops runbook, its own file). No new lesson
  (the sync/deployment guidance lives in the setup doc; sitemap-sync pattern already in lesson 11).
  Files: docs/SEARCH_CONSOLE_SETUP.md; PROGRESS.md.
  Commit: (below) "T4.4: add Search Console setup guide; audit sitemap route coverage".

### T7.2 — Admin form validation consistency [▶ code done (local commit), live test pending, 2026-07-14]

No ⛔ (P1, deps T7.1 ✅ which surfaced the field rules; additive, admin-only, no business facts,
no DB/schema change). Added zod validation to all SIX editing managers (projects, clients,
services, faq, hse, credentials) following the admin.login.tsx safeParse pattern, with
FIELD-LEVEL messages (contact-management excluded — status/read-only, no create/edit form).
Pattern (identical in all six): a per-manager `z.object` schema over the FormState strings; a
`FieldErrors = Partial<Record<keyof FormState, string[]>>` state; a local
`fieldError(msg)` helper rendering `<p class="mt-1 text-xs text-red-400">`; handleSave now runs
`schema.safeParse(form)` → on failure `setErrors(error.flatten().fieldErrors)` + a "Please fix the
highlighted fields" toast + return; on success `setErrors({})` then proceeds; errors cleared in
openCreate/openEdit. Submit buttons already had `disabled={saving}` + Loader2 spinner (unchanged).
Rules (from the T7.1 audit + DB types — all content text cols are unbounded `text`, so the real
DB-constraint risks are the `integer` sort_order and `date` cols): required NOT-NULL fields
enforced (name/title/question+answer/section/kind); **sort_order** = whole number 0–100000
(blocks the decimal/oversized value that would raise a raw Postgres integer error — the key
"no silent DB constraint errors" fix); **project_value** optional, non-negative number; **dates**
(completion_date/issued_on/expires_on) valid-or-empty; sane **max-lengths** on text (200 short /
100 icon+kind / 500 question / 5000 long). Inline error slots: projects 9, clients 3, services 4,
faq 4, hse 4, credentials 6.
Verification: static — git diff = the 6 admin managers only (+191/−16); no leftover old
`toast.error("X is required")` checks (grep 0); braces balanced per file; every added line ≤100
cols (prettier printWidth ok); zod already a dep (^3.24.2); `flatten().fieldErrors` keys ⊆
keyof FormState → assignable to FieldErrors; vite build has no tsc + lint is non-type-checked, so
no type-gate risk. Local eslint/build unavailable (Defender EPERM, lesson 02) → CI verify.yml is
the gate. Admin needs the user's auth session, so live "invalid save blocked with inline message /
valid save succeeds" is pending — consistent with the other admin tasks. DB: none. CMS: none.
Docs: no WEBSITE_CONTENT_GUIDE change (admin-only UI). No new lesson (additive validation following
the established admin.login zod pattern; nothing non-obvious).
Files: the six admin managers under src/routes/\_authenticated/admin/; PROGRESS.md.
Commit: (below) "T7.2: add zod field-level validation to the six admin managers".

### T6.1 — Build/lint gate [✅ CI-verified, 2026-07-14]

Local `bun install`/`build`/`lint` stay blocked (Defender EPERM, lesson 02) — attempted
repeatedly incl. `--backend=copyfile`, same NtSetInformationFile EPERM on cache-move. Runtime
verification moved to CI: `.github/workflows/verify.yml` (workflow_dispatch + push to main;
ubuntu-latest; oven-sh/setup-bun@v2) runs `bun install` → `bun run format` → `bun run lint` →
`bun run build` using the repo's exact scripts. User confirmed the CI run is green → both scripts
exit 0. Prior local static work: dashboard.tsx reformatted for prettier printWidth:100 (commit
e584360). No app code changed for the gate. Rerun-after-every-task = the push-to-main CI trigger.

### T7.1 — Complete CRUD audit [✅ done (local commit), 2026-07-14]

No ⛔ (P1, deps none — T0.6 findings fed in). Chosen as the next unblocked task: T6.2/T6.3 are
runtime/browser-gated for their DoD (suite-passes-locally / axe-on-running-pages) and T6.2 also
needs a bun.lock update via the blocked `bun install`; the Blueprint recommends Phase-7 P1 tasks
before T6.4, and T7.1 needs no runtime.
Method: static end-to-end audit — read all seven admin managers in full for how each operation
wires to Supabase (table/columns/bucket) and whether every field round-trips (rowToForm →
formToPayload → insert/update → reload). RLS staff-write confirmed in T0.2.
Result (docs/cms-audit.md — the DoD matrix, manager × operation): all seven managers
(projects, clients, services, faq, hse, credentials, contact-management) correctly wired for
their applicable CRUD ops with full field round-trip; create/edit share one formToPayload path;
delete uses .delete().eq(id) behind an AlertDialog; the 3 uploading managers remove the storage
object on delete; publish via edit-dialog Switch; sort_order numeric. **No trivial defects → no
inline code fix needed.** contact-management correctly has no create/publish/sort (public form
owns create; status+delete+history instead).
Follow-ups logged (larger, owned by later tasks — NOT fixed here): (1) ➡️T7.5 upload
replace-then-cancel orphans the DB reference (handleUpload removes the previous object at upload
time, before save) in projects/clients/credentials; (2) ➡️T7.5 no client-side file type/size
validation pre-upload; (3) ➡️T7.2 no numeric bounds on sort_order/project_value.
Live limitation: "reflects on public page" cells are ⏳ (admin needs the user's auth session +
the local runtime is blocked) — verified by wiring, to confirm on a deployed/authenticated run.
Build green: no code change → no build risk; CI verify.yml is the gate.
Docs: new docs/cms-audit.md. No WEBSITE_CONTENT_GUIDE change (admin-only). No new lesson (audit
is a doc artifact; nothing reusable beyond the matrix itself).
Files: docs/cms-audit.md; PROGRESS.md.
Commit: (below) "T7.1: complete admin CRUD audit (matrix + follow-ups, no defects)".

### T5.1 — Real dashboard [▶ code done (local commit), live test pending, 2026-07-13]

No ⛔ (P1, no deps, self-contained admin UI, no business facts, no DB/schema change). Picked
after T5.2 per user direction; the remaining P0s (T5.4, T5.5) are ⛔-blocked on the logo asset.
Done (code, `src/routes/_authenticated/admin/dashboard.tsx`): replaced the eight static
"Coming soon" cards with a live data view.

- **Six content-table stat cards** (projects, clients, services, faq, hse_content,
  company_credentials — the tables with a `published` boolean, verified vs types.ts) each show
  `published / total`. Whole card is a `Link` to its manager route.
- **Recent Enquiries card**: 5 most recent `contact_submissions` (name + timestamp + reused
  `statusLabel`/`statusStyle` badge from contact-status.ts), with a "View all →" `Link` to
  /admin/contact-management. Empty state "No enquiries yet."
- **Loading skeletons** (`@/components/ui/skeleton`) while counts/recent load; single
  `toast.error` on load failure (matches the existing manager pattern), degrading to 0/0 + empty
  list rather than an infinite skeleton.
- **Dropped the Settings card** — /admin/settings is a dangling route with no page/table (owned
  by T5.3); linking would 404.
  Perf: all reads run in ONE `Promise.all` — the six tables' total+published counts AND the recent
  query fire in parallel (not sequential). Count queries use `head:true, count:'exact'` (no rows
  fetched). DoD "count queries use head:true, count:'exact'" ✅.
  Verification: static — git diff = dashboard.tsx only; old markup fully removed (no "Coming soon"/
  `const sections`); all 7 Link targets exist as route files; no unused imports; reused Card/Skeleton
  primitives + contact-status helpers; local `formatDate` mirrors contact-management (kept local to
  avoid a cross-file refactor); `CardHeader` `flex-row` override is tailwind-merge-safe. Local eslint/
  build unavailable (Defender EPERM, lesson 02). Residual static risk: `supabase.from(table)` uses a
  `ContentTable` union with `.eq("published", true)` — valid since all six tables have `published`,
  but unconfirmed by local tsc; confirm via Lovable/CI build. DB: none (read-only counts/select).
  CMS: none. Admin route needs the user's authenticated session to exercise → live DoD pending.
  Docs: no WEBSITE_CONTENT_GUIDE change (admin-only UI, no public copy/business facts). No new
  lesson (additive UI reusing established patterns; nothing non-obvious).
  Files: src/routes/\_authenticated/admin/dashboard.tsx; PROGRESS.md.
  Commit: (below) "T5.1: replace admin dashboard placeholders with live counts + recent enquiries".

### T5.2 — Role-gate the admin UI [▶ code done (local commit), live test pending, 2026-07-13]

No ⛔ (P0, additive frontend guard, no business facts, no DB/schema change). Dep T0.2 ✅
(confirmed the `user_roles` self-read RLS policy). Next unblocked P0 after T3.12 — everything
between (T3.10-seed, T3.11, T4.1, T5.4) is ⛔-blocked on user assets, and T4.4/T5.1 are P1.
Done (code, `src/routes/_authenticated/route.tsx`): `beforeLoad` now, after `getUser`, self-
queries `user_roles` (`.select("role").eq("user_id", user.id).limit(1)`) and denies any user
with 0 rows (or an unreadable read — fail-closed). `is_staff()` == "has ANY user_roles row"
(director/coo/admin), and the "user_roles self or staff select" policy lets every authenticated
user read their own rows, so the self-scoped query returns an empty set (no error) for a
role-less user. Deny path: `toast.error("Not authorized", …)` then `throw redirect({to:"/admin/
login"})`. Return shape `{ user }` unchanged; staff (≥1 role row) pass through untouched.
**Redirect-loop fix (non-obvious):** `admin.login.tsx` bounces any logged-in user to
`/admin/dashboard`, so a non-staff authenticated user would loop login→dashboard→guard→login.
The guard calls `await supabase.auth.signOut()` before the deny-redirect so the login page's
`getUser` sees no user — breaks the loop and correctly denies a non-staff account any admin
session. (Alternative — gate the login page's dashboard-bounce on staff status — rejected to
keep role logic in one file.) RLS stays the real boundary; this guard is defense-in-depth/UX.
Verification: static — git diff = `_authenticated/route.tsx` only (+26); `toast` import added
(used), `redirect`/`supabase` already imported; column names checked vs types.ts (`user_id`,
`role`); RLS self-read checked vs baseline SQL L302-303; loop reasoning checked vs
admin.login.tsx:23-28. Local eslint/build unavailable (Defender EPERM, lesson 02). Admin routes
need the user's authenticated session to exercise, so the live DoD (role-less user redirected
w/ toast; staff unaffected; failure = redirect not blank) is pending — consistent with the
other admin tasks. DB: none. CMS: none.
⛔ Companion (user-confirmed, NOT code): Blueprint T5.2 note — confirm **Supabase public signups
are disabled** in the Auth dashboard (can't be read from here). Guard still denies + RLS still
hides data if open; disabling removes session creation entirely. Record outcome in lesson 17.
Docs: new **lesson 17** (defense-in-depth-only guard; RLS is the boundary; sign-out loop fix).
No WEBSITE_CONTENT_GUIDE change (admin-only, no public copy/business facts).
Files: src/routes/\_authenticated/route.tsx; PROGRESS.md; lessons/17-admin-role-gate-defense-in-depth.md.
Commit: (below) "T5.2: role-gate the admin shell (staff-only beforeLoad; RLS remains the boundary)".

### T4.2 — Structured data expansion [▶ code done (local commit), live test pending, 2026-07-09]

No ⛔ (T4.3 is the checkpoint, not T4.2). Deps: T3.9 (done), T2.2 (FAQPage part optional if
T2.2 skipped). Uses ONLY the T3.9-approved public roster + already-approved facts — no new
business facts or decisions, so no stop needed.
Scope decision: **T2.2 (/faq) is deferred (not built)** — only a homepage FAQ.tsx section and
an admin manager exist, no /faq route. Per the DoD, the **FAQPage JSON-LD is optional when
T2.2 is skipped → skipped**. Adding it to the homepage would place structured data on a surface
the Blueprint didn't specify (and FAQ content is CMS-dynamic) → out of scope; available as a
follow-up once /faq ships.
Done (code, 4184914) in src/routes/\_\_root.tsx:

- Added a **LocalBusiness** JSON-LD (second ld+json script) alongside the existing
  **Organization** schema. Both now share `POSTAL_ADDRESS` + `CONTACT_POINTS` constants so they
  emit the identical approved roster: Delhi corporate office (§7.10 canonical "212, 2nd Floor,
  Ansal Chamber-2, 6 Bhikaji Cama Place, New Delhi 110066"), both leadership numbers
  (+919810731116, +919071970000), info@ + surender@.
- Fixed the Organization schema's **stale address** (was "Ansal Chambers - II, Bhikaji Cama
  Place", one phone) → canonical wording + full roster. Gave both schemas `@id` and linked
  LocalBusiness via `parentOrganization` so they read as one entity, not duplicates.
- LocalBusiness carries the Google-recommended `image` + `telephone`; omitted `geo`/openingHours
  (no approved coordinates/hours — would be invented facts).
  Deliberately NOT changed: the Organization `description` still carries the pre-T3.8 marketing
  line ("leading … providing integrated engineering, supply, installation, testing,
  commissioning …"). It's out of T4.2's structured-data/roster scope (About-copy territory); minor
  consistency nit flagged for a future copy pass, not touched here to avoid scope creep.
  Verification: static — git diff = **root.tsx only; grep for banned/unapproved data (93156, dvt@,
  nitesh@, Ghaziabad, Govind, 76785, 79066, "Ansal Chambers") → NONE; both objects round-trip
  through JSON (validated via Python — Organization + LocalBusiness parse, required name/address/
  @id present, LocalBusiness has image+telephone); no new imports; passed to the existing
  JSON.stringify head-script path. Local eslint/build unavailable (Defender EPERM, lesson 02).
  DoD live check — "validate in Google Rich Results test" — pending deployment (manual).
  DB: none. CMS: none.
  Docs: WEBSITE_CONTENT_GUIDE gains a short structured-data note under the Public Contact Roster
  (the roster is now also emitted as JSON-LD). No new lesson (schema is small, uses the roster
  already recorded; the DRY-shared-constant approach is ordinary, not a reusable pattern worth a
  lesson).
  Files: src/routes/**root.tsx; PROGRESS.md; docs/WEBSITE_CONTENT_GUIDE.md.
  Commit: 4184914 "T4.2: add LocalBusiness JSON-LD; align schemas to T3.9 roster"; docs follow-up.

### T3.9 — Contact surfaces to approved roster ⛔ [▶ code done (local commit), live test pending, 2026-07-09]

⛔ CHECKPOINT CLEARED — user provided the four required publication decisions (personal data
going public). Approved PUBLIC roster:

- Phones (leadership only, name + title, exact format): **Digvijay Tanwar, Director — +91 98107
  31116**; **Surender Chahal, Chief Operating Officer — +91 90719 70000**.
- Emails: **info@epsprojects.in**, **surender@epsprojects.in**.
- Office: **Delhi Corporate (Ansal Chamber-2)** only.
- Attribution: named contacts with titles.
  NOT published (internal): Nitesh / Purnima / Nitin (technical), dvt@ and nitesh@ emails, the
  Ghaziabad (UP) office. Bank details excluded unconditionally.
  Done (code, d38b3d4) — ContactInfo.tsx + Footer.tsx (blueprint scope) brought to the roster:
- Phone blocks rebuilt to show the two leadership contacts each as name+title + tel: link,
  keeping the card/icon/hover idiom. tel: links use clean digits (+919810731116, +919071970000).
- **Removed the unapproved +91 93156 17532 number** (was live in BOTH files, not in §7.10 at
  all) and **dropped dvt@**; emails now info@ + surender@ (info first).
- Delhi address aligned to §7.10 canonical ("212, 2nd Floor, Ansal Chamber-2, 6 Bhikaji Cama
  Place, New Delhi – 110 066"); brand token in ContactInfo normalized to "Pvt. Ltd." (§7.9 #3).
  Out of scope / deliberately untouched: contact.tsx meta, privacy.tsx, terms.tsx, and the
  \_\_root.tsx Organization JSON-LD all use only info@ + the Director number (within the approved
  public set — no violation); JSON-LD phone/address expansion belongs to **T4.2** (LocalBusiness,
  depends on this T3.9 set). Footer legal copyright line ("EPS Projects Private Limited") left as
  the full legal entity name — not contact-roster data.
  Verification: static — grep of both files for 93156/9315617532/dvt@/nitesh@/76785/79066/
  "Ansal Chambers"/Ghaziabad/"Govind Puram" → NONE; approved roster + attribution present; git
  diff = contact blocks only; imports (MapPin/Phone/Mail) unchanged; JSX balanced. Local eslint/
  build unavailable (Defender EPERM, lesson 02). DB: none. CMS: none (footer credentials line is
  separate, T3.2/lesson 13).
  Docs: WEBSITE_CONTENT_GUIDE gains a canonical **Public Contact Roster** section (approved
  subset + what stays internal); PROGRESS updated. No new lesson (publication-decision + roster
  swap; no reusable code/workflow pattern beyond what's already recorded).
  Files: src/components/site/ContactInfo.tsx, src/components/site/Footer.tsx; PROGRESS.md;
  docs/WEBSITE_CONTENT_GUIDE.md.
  Commit: d38b3d4 "T3.9: contact surfaces to approved public roster (§7.10)"; docs in follow-up.

### T3.8 — About page to approved copy [▶ code done (local commit), live test pending, 2026-07-09]

Pre-approved (Phase-3 pure code, no ⛔); all copy from §7.3 Approved Content Pack — no new
business facts, so no Review Gate. Confirmed the intro's "Established 2021 / Mr. Digvijay
Tanwar" facts are separately approved (WEBSITE_CONTENT_GUIDE "About page messaging").
Done (code, cb375e9), four scoped text-only regions of About.tsx → §7.3 verbatim:

- **Who We Are** (lead paragraph): "…offers comprehensive Electrical & Instrumentation
  Project solutions — integrating design, supply, installation, automation, and commissioning
  under one expert roof." Kept the two following intro paragraphs (separately-approved facts;
  §7.3 provides no replacement and removing them would drop approved content + be structural).
- **Expertise list** (the "Our Wide Scope of Services" grid): 6 → 7 items, §7.3 verbatim,
  incl. the owner-note-#2 delivery chain as item 7 (Engineering, Procurement, Supply,
  Installation, Automation, Testing, Commissioning). Same `.map()`, dot-bullet idiom.
- **Clean-energy specialisation** (the "Our Expertise" block): rewritten to §7.3 —
  "EPS leads integration of E&I solutions for India's clean energy plants: …". Kept as a
  single `<p>` with the cyan `<strong>` highlight (honoring "no structural JSX changes";
  §7.3 lists 5 items but a bullet-list conversion would be a structural change → deferred).
- **Vision / Mission cards**: §7.3 verbatim. **Quality & Safety card**: added the §7.3 QHSE
  policy line as a static `<p>`, with the CMS `hse_content` block rendered BENEATH it (DoD);
  CMS fetch/conditional logic byte-identical.
  Judgment calls (flagged): (1) brand token normalized to "EPS Projects Pvt. Ltd." not §7.3's
  "Private Limited" — §7.9 hard-constraint #3 governs the formal name and the rest of the site
  uses "Pvt. Ltd." (2) clean-energy kept as paragraph not bullet list, per no-structural-change.
  (3) section headings ("Our Wide Scope of Services", "Quality & Safety") left as-is to preserve
  structure and avoid clashing with the "Our Expertise" heading. All easily revisited.
  Out of scope (untouched): the "Established 2021 / Digvijay Tanwar" paragraphs, the image, the
  registration-details block (footer owns it, T3.2), card order/icons/colors.
  Verification: static — git diff = only the four regions + the one DoD-required QHSE `<p>`
  (13 ins / 9 del, 1 file); no new/removed imports (Target/Eye/Shield/Loader2 still used); array
  valid at 7 entries; CMS conditional intact; JSX entities (&amp;/&apos;) match file convention.
  Local eslint/build unavailable (Defender EPERM, lesson 02). DB: none. CMS: none.
  Docs: WEBSITE_CONTENT_GUIDE "About page messaging" gains the now-shipped §7.3 About copy +
  changelog. No new lesson (straightforward approved-copy swap; shared-component reuse already
  covered by lesson 15).
  Files: src/components/site/About.tsx; PROGRESS.md; docs/WEBSITE_CONTENT_GUIDE.md.
  Commit: cb375e9 "T3.8: update About page to approved §7.3 copy (text-only)"; docs in follow-up.

### T3.7 revision — remove quantified public claims + content policy [▶ code done (local commit), 2026-07-08]

Canonical website content policy adopted (user): NO numerical commercial/performance claims
in public copy (cost savings, efficiency/productivity gains, ROI, execution-speed, PLF, etc.)
— those belong only in proposals/presentations/client meetings; only explicitly-approved
factual company metrics may be published. Deck (`EPS Projects Profile 2026 For Web.pptx`) is
now the primary reference for business messaging/value proposition (precedence for messaging).
Read the deck (extract-text via stdlib): slide 11 = the six advantages (source of §7.6, incl.
the 20–35% + PLF); slide 12 "Innovation" = the deck's own non-numerical positioning
("Smarter Design → Lower Capex", "superior performance", "Faster Build → Less Rework").
Done (code, ee751a3): rewrote the only two WhyChooseUs descriptions carrying quantified/
performance claims, aligned to deck slide 12:

- #3 Lower Project Costs: dropped "cost savings of 20–35%" → "A single, integrated partner
  for procurement and execution removes the overheads and coordination gaps of fragmented
  multi-vendor approaches."
- #4 Higher Plant Efficiency: dropped "High Plant Load Factor (PLF)" → "Superior electrical
  design, precise instrumentation, and quality commissioning that deliver dependable,
  efficient plant performance."
  #1/#2/#5/#6 unchanged (already qualitative, deck-verbatim). Titles, icons, colors, structure,
  spacing, animations untouched.
  Verification: static — grep of WhyChooseUs.tsx for %/PLF/ROI/cost-savings/efficiency-gain/OEE
  → no matches; git diff = 2 lines (the two descriptions only). Local build unavailable
  (Defender, lesson 02). DB: none. CMS: none.
  Docs: WEBSITE_CONTENT_GUIDE gains the no-quantified-claims policy + deck-primary-reference
  rule under Copy Rules, and the Why Choose Us record's points 3/4 updated. No new lesson (the
  policy is captured canonically in the content guide, which is its proper home).
  Files: src/components/site/WhyChooseUs.tsx; docs/WEBSITE_CONTENT_GUIDE.md.
  Commits: ee751a3 (code); docs in the follow-up docs commit.

### T3.7 — Why Choose Us replacement [▶ code done (local commit), live test pending, 2026-07-08]

Pre-approved (owner note #4, no ⛔); user instruction "implement exactly as specified".
Done (code): replaced the six generic reason cards in WhyChooseUs.tsx with the six §7.6
competitive advantages (titles + descriptions VERBATIM): Modern Industrial Units · Automation-
First Approach · Lower Project Costs · Higher Plant Efficiency · Fast-Track Execution ·
Customer-First Delivery. Chose fitting lucide icons (Factory, Cpu, TrendingDown, Gauge, Zap,
Handshake), all in the existing icon-circle idiom. Kept card grid, colorMap (6 colors),
hover behavior, and CardContent structure byte-identical. Intro paragraph → §7.6 sentence
("What makes EPS outstanding — …").
Judgment call (flagged): the section h2 was "Comprehensive Electrical & Instrumentation
Solutions" — a copy-paste duplicate of the Services heading (no PageHeader wraps this
component on /why-choose-us, and it renders on the homepage too). Corrected it to "Why Choose
EPS Projects" as part of the section intro. Easy to revert if unwanted.
Side effect (per §7.6/owner note): eliminated the prior "Excelence" and "Long Term" typos by
replacement (grep confirms both gone from src/).
Business-data note: §7.6 point 3 ships a quantified claim "cost savings of 20–35%" and point
4 references "PLF" — both pre-approved via owner note #4; recorded in WEBSITE_CONTENT_GUIDE.
Verification: static — only WhyChooseUs.tsx changed (git diff 23/23); all imports used
(removed Award/Users/Leaf/DollarSign/Clock/Shield); colors are valid colorMap keys; icons
valid lucide ^0.575; duplicate-heading resolved (grep: the phrase now lives only in
Services.tsx). Local build unavailable (Defender, lesson 02). DB: none. CMS: none.
Manual check (DoD): /why-choose-us + homepage show the six §7.6 cards with the new intro/
heading; hover + icon circles unchanged. No new lesson (straightforward content swap;
shared-component pattern already covered by lesson 15).
Files: src/components/site/WhyChooseUs.tsx; docs/WEBSITE_CONTENT_GUIDE.md.
Commit: a8a99e5 "T3.7: replace Why Choose Us cards with approved §7.6 advantages".

### T3.6 — Services page de-generification [▶ code done (local commit); ⛔ CMS seed pending, 2026-07-08]

⛔ Business Copy/Data Gate: user approved the §7.5 content + 7 decisions (variant approach;
homepage = title + first line; keep homepage image block, strip on /services only; admin CMS
= data-entry mechanism; snapshot then safest replace; publish live; keep icon mapping) and
asked for clean bullet spacing/typography (no redesign).
Read-only snapshot (query_database MCP, project da3f9ef6-...): `services` table was EMPTY
(0 rows, 0 published) → safest strategy is a clean INSERT of 6 rows, no replace/rollback.
Homepage currently shows "No services available" until the seed lands (expected).
Done (code, committed de678c4): `Services.tsx` gains a `variant` prop ("home" default vs
"detail"). home = title + first description line + existing Industries image block kept.
detail (/services) = descriptions split on `\n` into checked bullet lists (single-line →
`<p>`, backward-compatible via `ServiceDescription`), + hardcoded Material Supply (§7.5-B,
3 blocks), + industries pill strip (§7.4 sectors, already approved T2.1) linking to
/industries (replaces the image block on /services only). `routes/services.tsx` passes
variant="detail"; homepage `<Services />` untouched (default). icon_name mapping reused;
new pills match the /industries "Sectors We Serve" style. §7.5-C capability facts NOT used.
✅ Seed executed (2026-07-08, user changed decision #4 → seed directly via query_database
after reviewing the exact INSERT). Six `services` rows inserted, all published=true,
sort_order 1-6, descriptions as E'..\n..' (5 bullet lines each). Verified via SELECT:
published/sort/icon_name/first_line/bullet_count all correct. Row IDs (for rollback):
Engineering f5298e40 · Procurement bd4bcda2 · Electrical 466bf09f · Instrumentation
3e5ae0f0 · Process Control 1997fab3 · Testing & Commissioning 17867264. Rollback: DELETE
those ids (or unpublish) via admin or query_database.
⚠️ Deploy dependency: the DB is seeded now, but the T3.6 component (commit de678c4) is a
LOCAL commit not yet synced to Lovable, so the LIVE site still runs the OLD single-<p>
renderer — until the code syncs, the 6 services show as run-on paragraphs (newlines
collapsed). Bulleted lists + Material Supply + strip render correctly once de678c4 deploys.
Verification: static — only Services.tsx + routes/services.tsx changed (index.tsx untouched);
both call sites checked; all imports used; resolveIcon reused; newline-split logic + variant
branching read-through; JSX balanced. Local build unavailable (Defender, lesson 02); manual
checklist below. DoD partially met (component ready; DoD "shows six detailed categories +
Material Supply + strip" verifies once the CMS rows exist).
Manual check (post-seed): /services shows 6 bulleted categories + Material Supply (3 blocks)

- sectors strip → /industries; homepage Services shows title + first line + image block;
  light/dark rhythm preserved.
  Docs: filled WEBSITE_CONTENT_GUIDE Services section with the approved §7.5 copy; lesson 15
  records the newline-per-bullet convention (genuinely reusable).
  Files: src/components/site/Services.tsx, src/routes/services.tsx; docs/WEBSITE_CONTENT_GUIDE.md;
  lessons/15-services-newline-list-convention.md.
  Commit: de678c4 (code); docs/PROGRESS/lesson in the follow-up docs commit.

### T3.5 — Hero messaging to approved positioning [▶ code done (local commit), live test pending, 2026-07-08]

Business Copy Review Gate: presented proposed Hero copy (§7.1); user approved a NARROWED
scope. Final approved change is text-only, one node.
Approved & applied:

- Hero subhead → "Delivering End-to-End Electrical, Instrumentation & Automation Solutions
  for Efficient & Sustainable Industrial Energy Systems." (user-supplied wording, in place
  of the Blueprint's raw positioning line and the prior descriptive subhead).
  Explicitly kept unchanged per user: H1 ("Engineering Excellence in Electrical &
  Instrumentation Solutions"); the four value-prop bullets (ISO Certified Quality Standards ·
  25+ Years of Team Experience · Clean Energy Focus · Turnkey Project Solutions); both
  buttons; all structure, styling, animations, layout. Pillars-as-hero-bullets (§7.1 option)
  DEFERRED by user to the UI refinement phase — do not surface pillars in the Hero until then.
  Verification: `git diff` = 1 line changed (subhead text node only); `<p>` tag/classes and
  every other node byte-identical → DoD "composition byte-identical apart from text nodes" met.
  Bare `&` matches this node's existing convention (no JSX/build concern). Local build
  unavailable (Defender, lesson 02); static verification only, risk nil (single string).
  DB: none. CMS: none.
  Manual check (DoD): homepage hero renders the new subhead; H1/bullets/buttons/animations
  unchanged.
  Docs: appended the approved subhead to docs/WEBSITE_CONTENT_GUIDE.md → SEO/Messaging →
  Homepage messaging (+ change-log entry). No new lesson (nothing new reusable; §7.1's
  "keep H1, positioning as subhead" judgment is now a settled, user-directed decision).
  Files: src/components/site/Hero.tsx; docs/WEBSITE_CONTENT_GUIDE.md.
  Commit: 7e4e72c "T3.5: update Hero subheadline to approved positioning (text-only)".

### T3.4 — Homepage projects teaser [▶ code done (local commit), live test pending, 2026-07-08]

No ⛔: renders live CMS project data (empty until T3.11) and auto-hides at 0 rows — no
business facts, no marketing copy, so no Review Gate (per user instruction, implemented
directly). WEBSITE_CONTENT_GUIDE.md not consulted (task needs no website copy; only the
Blueprint-prescribed "Featured Projects" heading + a "View All Projects" nav CTA).
Done (code): new `src/components/site/FeaturedProjects.tsx` — fetches top 3 published
projects (`.eq(published,true).order(sort_order).limit(3)`), renders the /projects card
markup byte-for-byte (bg-zinc-900 border-zinc-800, hover:-translate-y-2, aspect-video
image, cyan industry label), backed by the shared `useSignedUrl` hook (T0.3) via a local
`SignedProjectImage` wrapper identical to routes/projects.tsx. Section is `py-20 bg-black`
with the standard centered heading + cyan underline; "View All Projects" button → /projects.
Wired into `routes/index.tsx` between <WhyChooseUs/> and <ClientsBanner/>.
Auto-hide: component returns null while not-loaded / on error / at 0 published rows, so the
section is fully absent pre-seeding (current state) — matches DoD "hides gracefully at 0 rows".
Scope note: Blueprint said "shared SignedImage", but the admin `SignedImage` component
(alt="", no hover-scale) would not match the /projects card styling the DoD requires; the
real shared primitive is `useSignedUrl` (T0.3), so I reused that and replicated the tiny
presentational wrapper exactly as projects.tsx does locally — no refactor of projects.tsx
(kept within the Blueprint's stated Files: index.tsx + small component).
Verification: static (columns verified vs types.ts projects.Row; RLS published-read confirmed
T0.2; imports all used; card markup diffed against /projects). Local build unavailable
(Defender, lesson 02). DB: none (read-only SELECT). CMS: none.
Remaining (DoD): live check once ≥1 project is published (T3.11) — section appears after
Why Choose Us with up to 3 cards matching /projects; "View All Projects" navigates; 0 rows →
section absent. No new lesson (nothing new reusable; shared-hook vs admin-component covered
by lesson 05).
Files: +src/components/site/FeaturedProjects.tsx, src/routes/index.tsx.
Commit: b26bb12 "T3.4: add homepage Featured Projects teaser (top 3 published, auto-hide)".

### T3.3 — Sitewide copy-rule pass (experience framing) [✅ done (local commit), 2026-07-08]

User-approved both wording changes at the Review Gate (Business Copy Approval, Group A).
Applied the §7.9 rule 1 fix in the two — and only two — non-conforming spots found by a
full `src/` sweep:

- Hero.tsx:33 bullet "25+ Years of Industry Experience" → "25+ Years of Team Experience"
  (verbatim match to the canonical CompanyStats label; resolves the T3.1 follow-up flag —
  the blueprint's "Hero bullet already team-framed" claim was wrong).
- Footer.tsx:53 tagline → "...backed by a leadership team with over 25 years of industry
  experience." (was company-framed "with over 25 years...", which implied Est.-2021
  company is 25 yrs old).
  Both apply the already-CANONICAL team-experience framing (lesson 14 registry) — no new
  business fact introduced; wording signed off by user.
  Not changed (audited, conforming): CompanyStats (canonical), About.tsx:60/63 ("Established
  in 2021"; "more than two decades" is leadership-attributed to Mr. Tanwar), about.tsx:10,
  \_\_root.tsx JSON-LD (foundingDate "2021", no 25-yr claim — already compliant, left untouched
  per DoD). No "A Decade of Expertise" anywhere.
  Verification: full-tree grep for `25`/`decade`/experience/established/years post-edit — all
  remaining hits conform; residual `25` matches are non-copy (error-page 1.25rem, zod max(255),
  a Services image URL query string). Copy-only diff: no layout/structure/testid/routing/DB
  change. Local build unavailable (Defender, lesson 02); static verification only, risk nil
  (two string literals). Manual check: homepage hero bullet + footer tagline read as above.
  No new lesson (nothing new reusable — straightforward application of §7.9 + the approved
  registry). DoD met.
  Files: src/components/site/Hero.tsx, src/components/site/Footer.tsx.
  Commit: ee0a7f7 "T3.3: enforce §7.9 experience-framing copy rule (Hero + Footer)".

### T3.2 — Corporate credentials in footer [▶ render done (local commit); ⛔ seed pending, 2026-07-07]

Done (code, read-only): `Footer.tsx` fetches published company_credentials (kind IN
CIN/PAN/GSTIN, order sort_order, null values filtered) and renders a muted fine-print line
(text-slate-500 text-xs, above the copyright row) on all public pages. Empty-safe (hidden
when no rows); bank details excluded by construction; RLS public-read (lesson 04). Bottom
bar restructured (border-t wrapper + inner flex row) with indentation normalized.
NO DB WRITE performed. USER APPROVED render code only.
⛔ Deferred (business-data write, needs explicit approval per lesson 14): seed the four
§7.2 rows. Must read-only verify current rows first, present, then wait. Footer line stays
hidden until seeded (expected).
Verification: static (query methods, CredentialRow vs types.ts, JSX balance, imports all used);
local build unavailable (Defender, lesson 02). Manual checklist in lesson 13.
Files: src/components/site/Footer.tsx; lessons/13-footer-credentials-render.md,
lessons/14-ownership-and-business-data-directive.md.
Commit: 1f4e8c1 "T3.2: render published CIN/PAN/GSTIN credentials in the footer (read-only)".

### T3.1 — Company stats band [▶ code done (local commit), live test pending, 2026-07-07]

Done (code): new `src/components/site/CompanyStats.tsx` — six §7.1 metrics as a responsive
dark band (grid 2/3/6, cyan numerals text-3xl md:text-4xl, slate labels, bg-zinc-900
border-y py-16, data-testid company-stats); wired into routes/index.tsx between Hero and
Services. Content verbatim §7.1 EXCEPT first label = "Years of Team Experience" (§7.9
attribution rule; USER APPROVED at review). Kept all six (not deck's four) — judgment.
Consistency pass done pre-commit (py-16/border-y match ClientsBanner band idiom; numeral
size matches dominant heading). Follow-up flagged: Hero.tsx:33 "25+ Years of Industry
Experience" bullet still needs team-framing in T3.3/T3.5 (blueprint's "already team-framed"
claim is wrong).
Build: NOT run locally (lesson 02); trivial static component, verified by inspection.
DB: none. CMS: none.
Remaining (DoD): live Lovable check — band renders under hero, responsive 2→3→6, long
values wrap cleanly.
Files: +src/components/site/CompanyStats.tsx, src/routes/index.tsx; lessons/12-company-stats-band.md.
Commit: f05e0d0 "T3.1: add company stats band to homepage between Hero and Services".

### T2.4 — Navigation + sitemap sync [▶ code done (local commit), live test pending, 2026-07-07]

Done (code): added `{ name: "Industries", to: "/industries" }` to Navbar `navLinks`
(drives desktop + mobile menu) and Footer `quickLinks`, between Services and Why Choose
Us per the IA decision; added /industries to public/sitemap.xml (monthly, priority 0.8,
between /services and /why-choose-us). Final cross-surface check: path/label/order
identical in navbar, mobile menu, footer, sitemap. No prefix collision for startsWith
active-matching. Pre-existing "About" vs "About Us" label diff left as-is (out of scope).
Build: NOT run locally (lesson 02); vite build (esbuild, no typecheck) + eslint lint
can't fail on the typed Link; route-type resolves when routeTree.gen.ts regenerates on CI.
DB: none. CMS: none.
Remaining (DoD): live Lovable check — Industries in navbar+mobile+footer, navigates,
highlights active. **Phase 2 complete after this verifies** (T2.2/T2.3 deferred by IA).
Files: Navbar.tsx, Footer.tsx, public/sitemap.xml; lessons/11-nav-sitemap-sync.md.
Commit: f118979 "T2.4: link /industries in navbar, mobile menu, footer, and sitemap".

### Phase-2 IA decision [✅ resolved by user, 2026-07-07]

Build ONLY /industries now. /faq (T2.2) and /hse (T2.3) standalone pages NOT built →
deferred (not blocked); /contact FAQ embed + About HSE injection remain their homes.
Nav IA = "Recommended split": Industries in navbar between Services and Why Choose Us;
FAQ/HSE would be footer-only if ever built. Drives T2.4. See lesson 10.
**Coupled follow-up (note added 2026-07-09):** the **FAQPage JSON-LD from T4.2 remains
deferred with /faq** — it was intentionally NOT shipped because T2.2 is not built (optional
per the T4.2 DoD). Do NOT add FAQPage structured data to the homepage FAQ section as a
substitute; add it only when the dedicated `/faq` route (T2.2) is implemented, scoped to that
page's published FAQ content.

### T2.1 — /industries page [▶ code done (local commit), live test pending, 2026-07-07]

Done (code): new `src/routes/industries.tsx`, isolated (no existing file edited).
Shell mirrors /projects; 8 industry cards reuse Services card language verbatim
(md:2/lg:3 grid, cyan icon circle, hover:-translate-y-2); "Sectors We Serve" strip = 6
verbatim pills under cyan underline. Content VERBATIM §7.4 (titles/descriptions, intro
subtitle, sectors). Route head description authored fresh (meta not governed by §7).
Image-free icon cards (Factory/FlaskConical/Flame/TowerControl/Cog/Beaker/Waves/Zap) —
no new stock sourced; site-pics can replace later (non-blocking). Did NOT touch
Services.tsx (T3.6 owns the Services rework + strip link). User-requested final
consistency pass fixed 2 spacing drifts pre-commit (desc mb-4; underline mb-6).
Build: NOT run locally (lesson 02); routeTree.gen.ts regenerates in Lovable/CI (route
won't resolve until then); icons valid for lucide ^0.575 but not compiled (node_modules absent).
DB: none. CMS: none. Not yet linked (nav/sitemap = T2.4).
Remaining (DoD): live Lovable check that /industries renders, grid responsive, pills wrap.
Files: src/routes/industries.tsx; lessons/10-phase2-ia-and-industries.md.
Commit: 216187b "T2.1: add /industries page (8 industries + sectors strip, verbatim §7.4)".

### T1.4 — Email notification [⏸ deferred pending infra, 2026-07-07]

Deferred by user (not blocked): needs infrastructure decisions/credentials — email
provider (Resend?), recipient list (§7.10), verified sender domain — plus Supabase
Edge Function deployment + DB webhook config, which likely routes through the
Lovable/Supabase dashboard (backend is Lovable-managed, lesson 02/04). Revisit before
production deployment (T6.4). No code written.

### T1.5 — Realtime admin inbox [⏸ deferred pending infra, 2026-07-07]

Deferred by user (not blocked): optional; requires Realtime enabled on
contact_submissions (dashboard setting). Revisit before production deployment. No code written.

### T1.3 — Status history timeline [▶ code done (local commit), live test pending, 2026-07-07]

No ⛔: T0.2 confirmed the status-change trigger fires; RLS allows staff SELECT on
contact_status_history and staff-read-all on profiles (baseline SQL ~L292/L296).
Done (code): additive to `admin/contact-management.tsx` — HistoryRow type,
history/historyLoading state, `loadHistory(submissionId)` reading contact_status_history
(filtered by submission_id, `created_at` DESC = newest-first per user review) with an
embedded `profiles(full_name,email)` join for the changed-by name. useEffect on
viewing?.id loads on dialog open / clears on close; successful in-dialog status change
re-loads history. Renders a "Status History" block: from→to badges (T1.2 statusLabel/
statusStyle), timestamp + changed-by (full_name||email||"System"), optional note,
loading + empty states. Embedded-select result cast `as unknown as HistoryRow[]`
(supabase-js embed typing unreliable + no local tsc, lesson 02/09).
Build: NOT run locally (lesson 02); verified by read-through + type reasoning + RLS check.
DB: none (read-only SELECT; trigger already writes history). CMS: none.
Remaining (DoD): user runs live Lovable check — open an enquiry with a changed status,
confirm transitions show newest-first w/ name+timestamp; untouched enquiry shows
"No status changes yet." Bundled with T1.1's pending runtime verification.
Files: src/routes/\_authenticated/admin/contact-management.tsx; lessons/09-status-history-timeline.md.
Commit: 115b196 "T1.3: show status-history timeline in the enquiry detail dialog".

### T1.2 — Lead-status vocabulary [✅ done (local commit), 2026-07-07]

⛔ Decision (user): KEEP the generic statuses (new/in_progress/resolved/spam/archived);
do NOT adopt the sales pipeline; NO schema change. Five values unchanged → all existing
rows valid, no migration (T0.6 confirmed no CHECK constraint on `status`).
Done: new `src/lib/contact-status.ts` as single source of truth — exports STATUS_OPTIONS
(as-const), ContactStatus type, STATUS_STYLES, statusLabel(), and new statusStyle() helper
centralizing the `?? "text-slate-200"` fallback. Refactored `admin/contact-management.tsx`
to import them and use statusStyle() at both Select triggers; removed the three local decls.
Rendered UI byte-identical. Ready for T1.3/T5.1 to import directly with no changes;
speculative helpers (DEFAULT_STATUS, isContactStatus, open/terminal grouping) deliberately
deferred as additive-only future exports (see lesson 08).
Build: NOT run locally (Defender, lesson 02); verified by grep (single decl site, no dangling
refs) + type reasoning. Defer to Lovable/CI.
DB: none. CMS: none.
Files: +src/lib/contact-status.ts, src/routes/\_authenticated/admin/contact-management.tsx;
lessons/08-contact-status-module.md.
Commit: 51475a2 "T1.2: centralize contact lead-status vocabulary into a shared module".

### T1.1 — Harden the public form [▶ code done (local commit), live test pending, 2026-07-07]

Done (code): hardened `src/components/site/ContactForm.tsx` — zod `contactSchema`
(name/email required + max lengths, message 10-5000, optional phone/subject/company),
new `company` input mapped to the existing column, field-level error messages,
hidden honeypot (`website`) that silently drops bot submissions, required-_ labels
reconciled to actual validation (only name/email/message required), and `source:
"website"` on the insert. Field order preserved per user review: Name, Email, Phone,
Subject, Company (company appended last). Insert path, layout, theme, and all existing
data-testids unchanged; only additive testids (`contact-input-company`, `contact-error-_`).
Review gate: user confirmed no testid renames, layout/order preserved, insert payload
additive-only (company + source). Field-order correction applied during review (see lesson 07).
Build: NOT run locally (Defender, lesson 02); type-checked by hand against tsconfig +
types.ts Insert shape; defer to Lovable/CI.
DB: no schema change (company/source columns already existed; anon INSERT confirmed in T0.2).
Remaining (DoD): user runs the live Lovable submission test — enquiry appears in
/admin/contact-management with source=website + company populated, then delete. Flip to ✅
after that passes; any issue → follow-up patch.
Files: src/components/site/ContactForm.tsx; lessons/07-contact-form-hardening.md.
Commit: 09a2655 "T1.1: harden public contact form (zod, company field, honeypot, source)".

### T0.6 — Database architecture review [✅ done (local commit), 2026-07-07]

Done: wrote `docs/db-review.md` — verdict matrix for checks (a)–(g), all ✅; unused-column dispositions (all keep/use, no drops); change-proposal list. **Verdict: no schema change required for launch; DB supports Phases 1–7.** Read-only review (used T0.2 introspection + one index check).
Key: triggers (status-change + handle_new_user) exist/fire; buckets↔constants match + storage policies cover all 3; contact_submissions anon-insert/staff-rest confirmed; user_roles self-read confirmed (T5.2 ok); enum adequate; no CMS table missing. Notes (non-blocking): status has no CHECK constraint (T1.2 needs no DB change unless user wants DB-level enforcement — ⛔); no non-PK indexes (fine at current volume, P2).
Build: n/a (read-only review + markdown).
Files: docs/db-review.md.
Commit: (pending) "T0.6: database architecture review — verdict, no schema change required".
