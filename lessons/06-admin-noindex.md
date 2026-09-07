**Both admin surfaces are `ssr: false`, so their `noindex` meta is injected client-side only — `robots.txt Disallow: /admin` is the real crawler gate; the meta is defense-in-depth (T0.5).**

`/admin/login` (admin.login.tsx) and the `_authenticated` tree both set
`ssr: false`, so route-level `head()` meta is not present in the initial server
HTML for those paths. A `<meta name="robots" content="noindex,nofollow">` there
only helps JS-executing crawlers. The authoritative exclusion is therefore the
`Disallow: /admin` line in `public/robots.txt`.

T0.5 implementation:

- `public/robots.txt` — added `Disallow: /admin` (kept `Allow: /` + the Sitemap line).
- `admin.login.tsx` — composed the robots meta onto the existing `buildPageHead`
  result: `return { ...head, meta: [...head.meta, { name: "robots", content:
"noindex,nofollow" }] }`. Did NOT modify the shared `buildPageHead`/`site.ts`
  (out of T0.5 scope; changing it would affect every public page).
- `_authenticated/admin/route.tsx` — added a `head()` emitting the same meta for
  the whole admin shell.

Implication for later SEO tasks (T4.1/T4.2): don't rely on route `head()` meta
being server-rendered for `ssr:false` routes. Public content routes are SSR'd, so
their SEO meta is fine; admin is intentionally excluded.
