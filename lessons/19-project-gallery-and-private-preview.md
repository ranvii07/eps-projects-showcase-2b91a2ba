**Splitting Projects into a Directory + a Gallery needed one new table, three columns, and one SECURITY DEFINER function — because RLS cannot read a URL query parameter, token-scoped "private preview" access has to go through a function, not a policy.**

## What was built (2026-08-03)

Projects is now two subpages:

- **Project Directory** — `/projects`, the pre-existing page. Untouched apart from
  one added `<ProjectsSubNav />` line; the query, cards, copy and testids are unchanged.
- **Project Gallery** — `/projects/gallery`, new gallery of site photographs grouped
  by project, each project fronted by its cover image.

CMS: new **Project Gallery** manager at `/admin/project-gallery`, cloned from the
Projects manager (same zod validation, same upload/orphan-prevention flow, same
Live/Draft badge, same delete-with-storage-cleanup).

Naming: the section is "Project Gallery", but the rows are individual images of a
project, so the table stays `project_images`. One gallery per project is implied by
`project_id` — no separate galleries table is needed.

## Routing: `projects_.gallery.tsx`, not `projects/gallery.tsx`

With TanStack flat file routing, adding `projects.gallery.tsx` next to the existing
`projects.tsx` would silently promote `projects.tsx` into a **layout** route — it would
then need an `<Outlet/>` and the directory page would stop rendering its own content.

The trailing-underscore form `projects_.gallery.tsx` is the documented **non-nested**
escape hatch: it produces path `/projects/gallery` parented to the root, so
`projects.tsx` keeps working exactly as before and did not have to move. Generated ids
differ from the URL: id `/projects_/gallery`, fullPath `/projects/gallery`.

## Private preview: why a function and not a policy

Requirement: an image can be **Public** (on the site) or **Private Preview** (hidden from
visitors, shown only through a link we deliberately enable and share).

RLS decides per-row from the caller's _role_, and it cannot see `?preview=<token>`. So:

- `public.project_images` RLS covers the **public** path only: staff see everything;
  everyone else sees `published = true AND visibility = 'public'` AND only when the parent
  project is itself published (an EXISTS subquery, which is in turn filtered by the
  existing "projects public read" policy — so a draft project cannot leak photographs).
- The **token** path goes through `public.get_preview_gallery_images(uuid)`, SECURITY
  DEFINER with `set search_path = public`, granted to `anon, authenticated` — same shape as
  the existing `is_staff()`. It returns a project's published images (public _and_ private)
  only when `preview_enabled = true` and the token matches.

Two columns on `public.projects` drive it: `preview_token uuid` (unique, defaulted) and
`preview_enabled boolean default false` — off until staff turns it on. "Regenerate" in
the CMS writes a fresh token, which revokes every previously shared link.

Deliberate asymmetry: the preview does **not** require the parent project to be published.
Showing a client work that is not yet live is the entire point.

## Cover image: a partial unique index, and clear-before-set

`project_images.is_cover boolean` marks the one image that fronts a project's gallery.
"At most one per project" is enforced in the database, not trusted to the CMS:

```sql
create unique index project_images_one_cover_per_project
  on public.project_images (project_id) where is_cover;
```

A **partial** index is what makes this work — it constrains only the rows where the flag
is true and leaves the many false rows unconstrained (a plain unique index on
`project_id` would allow just one image per project at all).

The consequence for the client: the index makes "set cover" a two-step write —
**clear the project's existing cover first, then set the new one**. Doing it in the other
order hits the unique violation. Both entry points (the dialog's Cover switch and the
one-click star in the list) route through the same `clearCover()` helper.

The cover never removes an image from the gallery — it still renders in the grid; it is
additionally used as the group thumbnail, and the page falls back to the first image when
a project has no explicit cover.

## Storage: reuse `project-images`, no new bucket

Gallery photographs go to the existing private `project-images` bucket under a
`gallery/` path prefix, so the anon-read policy from lesson 16 / migration
`20260720000000` already covers them and no storage migration was needed.

**Known limitation, accepted:** that anon-read policy is bucket-scoped, not row-joined.
A _private_ photograph's bytes are therefore reachable by anyone who knows its exact
object path — which is a random UUID, never emitted to non-preview visitors. The
**metadata** (which project, caption, existence) is properly gated by RLS. This is the
same posture the whole site already has for client logos and project covers; tightening
it would mean a second bucket, and a second bucket without anon read would also break
the preview link for signed-out stakeholders.

## Reordering

`sort_order` stays the ordering convention, plus ↑/↓ buttons in the manager. The move
handler swaps the two positions and then **renumbers the project's images 0..n-1** rather
than trading two `sort_order` values — a plain swap is a no-op when several images still
sit at the default `0`, which is the common case right after bulk upload. Buttons are
bounded by position within the image's _own_ project, which differs from its position in
the rendered list under the "All projects" filter.

## Local verification is possible again — lesson 02 is now partly obsolete

**All four CI steps ran locally and passed** (`format:check`, `lint`, `typecheck`,
`build`). Two things changed since lesson 02 was written:

1. **Node is installed** — `node --version` → v26.4.0. Lesson 02 recorded node/npm as
   absent; that is no longer true.
2. **`bun install` still fails** with the Defender `EPERM` on the cache move (retried this
   session), so `node_modules` stays partial — `typescript` was missing entirely, which is
   why `lint` and `typecheck` had been unrunnable.

The workaround: **fetch the package tarball directly and extract it**, bypassing bun's
cache-move step, which is the part Defender blocks:

```bash
curl -sL https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz -o /tmp/ts.tgz
mkdir -p node_modules/typescript && tar -xzf /tmp/ts.tgz -C node_modules/typescript --strip-components=1
```

Then run the tools directly (`bun run <script>` is not needed):

```bash
node node_modules/typescript/lib/tsc.js --noEmit   # typecheck
./node_modules/.bin/eslint.exe .                   # lint
./node_modules/.bin/prettier.exe --check .         # format:check
./node_modules/.bin/vite.exe build                 # build
```

Pin the version to `bun.lock` so local results match CI — prettier in particular, since
`eslint` runs `prettier/prettier` as an error-level rule and versions disagree on JSX
wrapping. Use the same tarball trick for any other package the partial install dropped.

Also note **`vite build` regenerates `src/routeTree.gen.ts`**, so a hand-synced route tree
gets corrected automatically by a local build — a fast way to confirm hand edits were right.

## Fixed in passing: format:check was already red on main

`format:check` was failing on five untouched files (`About.tsx`, `ContactInfo.tsx`,
`Services.tsx`, `WhyChooseUs.tsx`, `routes/industries.tsx`) — prettier 3.8.3 wraps long
JSX text onto its own line where the committed versions had it inline. Fixed as part of
this task at the user's request; the diffs are pure JSX line-wrapping, which is
semantically identical because JSX collapses whitespace around newlines.

## Applies next

Any future "share this privately with a client" surface (a document set, a draft case
study) should reuse `preview_token`/`preview_enabled` on the owning row plus one
SECURITY DEFINER accessor — do not try to express it as an RLS policy. Any future
"exactly one flagged row per parent" should reuse the partial-unique-index +
clear-before-set pattern.
