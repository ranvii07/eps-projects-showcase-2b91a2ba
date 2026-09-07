**T3.2 shipped the footer credentials RENDER only (read-only, empty-safe, CIN/PAN/GSTIN-restricted). The §7.2 data seed was NOT performed — it is a business-data write requiring explicit user approval (see lesson 14).**

What was done (code only):

- `Footer.tsx` converted from a static component to one that fetches published
  `company_credentials` where `kind IN ('CIN','PAN','GSTIN')`, ordered by sort_order,
  null values filtered. Renders `Label: Value` joined by `•` as a muted fine-print
  line (`text-slate-500 text-xs`, `text-center md:text-left`, `mb-4`) above the
  copyright row, inside the existing `border-t` bottom bar. `data-testid="footer-credentials"`.
- Bottom bar restructured: the single `border-t ... flex` div was split into an outer
  `border-t` wrapper + an inner flex row (so the credentials line can sit above the
  copyright/links row). One extra `</div>` added; indentation re-normalized to 2-space
  in the consistency pass.

Safety properties (why render-only is safe to ship before the seed):

- **Empty-safe:** the line is conditional on `credentials.length > 0`, so an empty table
  leaves the existing copyright/links bar untouched — no layout break.
- **Bank details can never render:** the query is restricted to CIN/PAN/GSTIN kinds, so
  even if a BANK row existed it is excluded (§0.5 hard prohibition upheld by construction).
- **RLS:** company_credentials is a content table → public read of published rows (lesson 04).

Deferred (⛔ business-data write): seeding the four §7.2 rows (CIN U31904UP2021PTC140260,
PAN AAGCE2792J, GSTIN Delhi 07AAGCE2792J1ZC, GSTIN UP 09AAGCE2792J1Z8). Per the new
Business-Data Verification directive (lesson 14), no write happens without explicit
approval AND a read-only verification of current rows first. Until seeded, the footer line
is invisible — that is expected, not a bug.

Verification (static; local build unavailable — Defender blocks bun install, lesson 02):

- Traced: query methods valid (.eq/.in/.order), CredentialRow type matches the
  company_credentials Insert/Row shape, JSX balance re-checked after the div split, all
  imports used. `vite build` = esbuild (no typecheck) so it won't fail on this.
- Residual risk: none functional beyond "line hidden until rows seeded".
- Manual checklist when the app runs: (1) with rows present, footer shows the 4 IDs on a
  public page; (2) muted styling reads as fine print below copyright; (3) mobile centers,
  md+ left-aligns; (4) admin-suppressed pages (/admin\*) unaffected.

Commit: 1f4e8c1 "T3.2: render published CIN/PAN/GSTIN credentials in the footer (read-only)".
