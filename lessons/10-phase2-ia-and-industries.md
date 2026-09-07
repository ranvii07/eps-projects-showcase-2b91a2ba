**Phase-2 IA decision (user, 2026-07-07): build ONLY /industries now; add it to the navbar between Services and Why Choose Us. /faq and /hse standalone pages are NOT built (deferred). T2.1 shipped /industries as an isolated, image-free icon-card page.**

Phase-2 checkpoint outcome (⛔ resolved):

- Pages to build: **/industries only.** T2.2 (searchable /faq) and T2.3 (/hse page)
  were declined for now → marked deferred (not blocked); the /contact FAQ embed and
  the About-page HSE injection remain the only homes for that content.
- Navigation IA: **"Recommended split"** — Industries in the navbar between Services
  and Why Choose Us; FAQ/HSE would be footer-only if ever built. Drives T2.4.

T2.1 — /industries implementation:

- New `src/routes/industries.tsx`, fully isolated (no existing file edited). Shell
  mirrors /projects (`bg-zinc-950 min-h-screen` → PageHeader → `py-20` section →
  `max-w-7xl` container). 8 industry cards reuse the Services card language verbatim
  (`border-t-4 border-cyan-400 hover:-translate-y-2 bg-zinc-900`, cyan icon circle,
  `md:grid-cols-2 lg:grid-cols-3 gap-8`, description `text-slate-300 mb-4 leading-relaxed`).
  Sectors strip = 6 verbatim pills under a standard cyan-underline (`mb-6`) sub-heading.
- Content is VERBATIM §7.4 (8 titles+descriptions, intro subtitle, sectors strip).
  The route `head` description is NOT §7 copy (meta descriptions aren't governed by §7),
  so it was authored fresh.

Decisions / judgment calls:

- **Imagery: image-free icon cards.** Only 4 mismatched Unsplash tiles exist for 8
  named industries and sourcing new stock needs a ⛔, so icon cards (Design-Lock
  allowed) were the safe default. User was told site-pics can replace them later; not
  blocking. Lucide icons chosen: Factory, FlaskConical, Flame, TowerControl, Cog,
  Beaker, Waves, Zap — standard exports in lucide-react ^0.575.0 (Cog/Zap already used
  in-repo; rest validated by API knowledge since node_modules is absent).
- **Did NOT touch Services.tsx** — its 4-tile "Industries We Serve" section stays; the
  Services rework + strip-link to /industries is T3.6's job. Keeps T2.1 revertible.
- **Final visual-consistency pass** (user-requested) caught two spacing drifts vs the
  pattern and fixed them pre-commit: description missing `mb-4`; sectors underline was
  `mb-8` (canonical is `mb-6`).

Verification:

- Local build NOT run (lesson 02). `routeTree.gen.ts` regenerates only in Lovable/CI —
  the route won't resolve until a build runs there. Icon imports unconfirmed against a
  compiled package (node_modules absent) but valid for v0.575. Runtime check of
  /industries bundled with the other pending Lovable verifications.

Commit: 216187b "T2.1: add /industries page (8 industries + sectors strip, verbatim §7.4)".
