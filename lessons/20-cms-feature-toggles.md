**A "build it now, publish it later" feature needs a DB-backed toggle, not commented-out code — and the toggle read must fail closed on _every_ path, including the supabase client throwing on construction. A guard that turns a read failure into an error page advertises the very route it was meant to hide.**

## Context (T8.2, 2026-08-03)

T8.1 shipped the Project Gallery. The business then wanted it **built but
hidden** until they decide to publish it, with the decision made from the CMS
rather than by a deploy. Same session also moved the Projects sub-nav strip into
a navbar dropdown.

## The toggle table

`public.site_settings` (migration `20260803010000`), one row per boolean toggle:

```
key text primary key, enabled boolean, label text, description text, sort_order int
```

Three calls worth recording:

1. **Not a jsonb key/value store.** Every content table in this schema uses plain
   typed columns, and every setting this site actually needs is a yes/no switch.
   A `boolean` column keeps the CMS a `<Switch>` and keeps the migration
   reversible.
2. **`label` + `description` live in the row.** That is what lets
   `/admin/settings` render the whole table generically — adding a future toggle
   is one `INSERT`, with no CMS code change. The page deliberately offers no
   create/delete: a toggle only means something if code reads its key.
3. **SELECT is open to `anon`.** It has to be — the navbar decides whether to
   list Project Gallery before anyone signs in. Consequence, and it is written
   into the migration: **this table is for publicly-observable feature flags
   only.** Never a secret, key, or internal-only value.

Seed is `enabled = false` with `on conflict (key) do nothing`, so the migration
is re-runnable and never clobbers a value staff has already set.

## Fail closed — all four ways it can fail

`fetchSiteSetting()` returns `false` for a missing row, an RLS denial, a network
error, **and a thrown client**. The fourth one was found by testing, not by
reading:

```ts
try {
  const { data, error } = await supabase.from("site_settings")...
  if (error || !data) return false;
  return data.enabled === true;
} catch {
  return false;
}
```

`src/integrations/supabase/client.ts` exports a `Proxy` that constructs the
client on first property access and **throws** if `SUPABASE_URL` /
`SUPABASE_PUBLISHABLE_KEY` are absent. A local dev server has no `.env`, so the
first run of the route guard threw instead of returning false — and because the
throw happened inside `beforeLoad`, TanStack rendered the root **errorComponent
("This page didn't load")** rather than the 404. A hidden page that returns a
distinct error instead of a 404 is not hidden: the error tells you the route
exists. Wrapping the read in `try/catch` is what makes "couldn't tell" mean
"off" in every case.

Same reasoning applies to the hook: `useSiteSetting` starts at
`{ enabled: false, loading: true }`, so a gated link can never flash into view
before the answer arrives.

## Guarding the route

The check belongs in `beforeLoad`, not the component: it runs before render and
on the SSR pass, so no gated markup is ever produced.

```ts
beforeLoad: async ({ search }) => {
  if (search.preview) return;
  if (!(await fetchSiteSetting(SITE_SETTING_KEYS.projectGallery))) throw notFound();
};
```

`?preview=<token>` is **exempt on purpose**. Those links are already gated by
T8.1's `preview_token` + `preview_enabled` pair inside the database, and showing
unpublished work to a client is precisely what that feature exists for —
including while the public gallery is still switched off. It is also the only
way to review the gallery before launch, so the exemption is what makes
"hidden but reviewable" possible without a staff-session bypass (which would not
work anyway: the session lives in `localStorage`, so SSR `beforeLoad` cannot see
it).

## Every surface that links the feature must read the same flag

Missing one leaves a live link to a 404. The full list for this feature was:
navbar (desktop dropdown + mobile group), footer quick links, and
`public/sitemap.xml`. The sitemap is a static file with no access to the flag,
so the entry was **removed and replaced with a comment holding the exact markup
to restore** — advertising a URL that 404s is worse than omitting it. Grep for
the route string before calling a gate done:

```
rg "projects/gallery" src public
```

## Typed keys

`SITE_SETTING_KEYS` is a `const` object and `SiteSettingKey` its value union, so
a mistyped key is a compile error. Typing the parameter as `string` would make a
typo resolve to "no such row" → `false` → the feature silently stays off, which
is the hardest possible bug to notice in a fail-closed design.

## Related

- Lesson 19 — the Project Gallery and its `preview_token` private-preview path.
- Lesson 11 — nav + sitemap must be kept in sync; this is the conditional case.
