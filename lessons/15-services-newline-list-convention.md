**Service `description` fields use a newline-per-bullet convention: on `/services` (the `Services` component's `variant="detail"`) a multi-line description renders as a bulleted capability list; single-line descriptions still render as a `<p>` (backward-compatible). The homepage (`variant="home"`) shows only the first line as a summary.**

## Context (T3.6, 2026-07-08)

`Services.tsx` is shared by the homepage (`routes/index.tsx`, `<Services />`) and the
`/services` page (`routes/services.tsx`, `<Services variant="detail" />`). A `variant`
prop drives two presentations from one CMS dataset:

- `home` (default): title + **first** description line only (keeps the homepage light);
  the existing "Industries We Serve" stock-image block is retained.
- `detail`: description split on `\n` → each non-empty trimmed line becomes a checked
  bullet (`<ul>`); plus a hardcoded Material Supply section and an industries pill strip
  linking to `/industries` (which replaces the image block on this page only).

## How to apply

- **Authoring service rows (admin CMS):** put **one capability per line** in the
  Description textarea — real line breaks, NOT "· " separators (the split key is `\n`).
  The `Textarea` preserves newlines on save.
- **Backward compatibility:** any single-line description renders as a paragraph in both
  variants, so pre-existing/other rows are unaffected.
- **icon_name:** must be a key in `resolveIcon`'s `iconMap` (settings, cog, hardhat,
  wrench, gauge, checkcircle, zap, cpu, activity, shield); unknown/empty → `Settings`.
- Don't render multi-line descriptions as a raw `<p>` — HTML collapses the newlines into
  one run-on line. Always route through `ServiceDescription`.

## Data state note

At T3.6 the `services` table was **empty** (verified read-only via `query_database`), so
the seed was a clean insert of the six approved rows (no replace/rollback needed) — entered
by the user through the admin CMS per the business-data ownership directive (lesson 14).
