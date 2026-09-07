# Lessons

This directory is the project's running memory of corrections and confirmed
non-obvious approaches, per the Execution Blueprint (§0, rule 7).

## Convention

- **One lesson per file.** Never combine multiple lessons into one file.
- **File name:** `NN-short-slug.md` — a two-digit ordinal plus a short kebab-case
  slug (e.g. `01-contact-form-already-wired.md`). Ordinals are assigned in the
  order lessons are recorded and never reused.
- **First line of every lesson:** a one-line summary (bold), so the whole
  directory can be skimmed by reading only first lines.
- **Body:** the detailed lesson — what was corrected (and what the wrong
  assumption was), or what approach was confirmed and _why_ it was chosen.
  Cite files/lines where relevant.

## Protocol

- **Read every lesson file before starting any session** (alongside
  `PROGRESS.md`). Lessons override stale assumptions.
- **Write a new lesson whenever:**
  - the user corrects you, or
  - the user confirms a non-obvious approach, or
  - you make a non-obvious implementation judgment call that a future session
    would otherwise have to re-derive.
- Do **not** record routine, self-evident decisions here — only things that
  would save a future session from repeating a mistake or a deliberation.

## Index

- `01-contact-form-already-wired.md` — the public contact form already inserts
  into `contact_submissions`; the old status docx was wrong.
- `02-no-local-js-runtime.md` — bun is installed but `bun install` is blocked by
  Windows Defender (EPERM); no Defender changes allowed, so verify via CI/Lovable.
- `03-repo-sync-workflow.md` — commit locally on `main`; the user's GitHub/Lovable
  integration propagates; do not request a GitHub PAT.
- `04-db-schema-verified-via-lovable.md` — T0.2 verified the live schema via Lovable
  read-only introspection; matches types.ts; two minor plan.md discrepancies noted.
- `05-signed-url-dedup.md` — T0.3 hook+component extraction; credentials had no
  SignedImage (§1.5 correction); public renderers kept unique markup.
- `06-admin-noindex.md` — T0.5; admin routes are ssr:false so robots.txt is the real
  crawler gate; noindex meta is defense-in-depth.
