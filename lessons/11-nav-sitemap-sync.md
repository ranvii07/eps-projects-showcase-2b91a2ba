**T2.4 linked /industries into the navbar, mobile menu, footer quick links, and sitemap.xml — one entry per link-array (Navbar/Footer) drives everything, placed between Services and Why Choose Us per the Phase-2 IA decision.**

What was done:

- `Navbar.tsx`: added `{ name: "Industries", to: "/industries" }` to `navLinks`
  (index between Services and Why Choose Us). One array feeds both `.map`s (desktop
  strip + mobile menu), so the mobile entry, active-highlight, and testids
  (`nav-link-industries`, `mobile-nav-link-industries`) are generated automatically.
- `Footer.tsx`: same entry added to `quickLinks` in the same position →
  `footer-link-industries`.
- `public/sitemap.xml`: `/industries` URL added between /services and /why-choose-us,
  `changefreq monthly`, `priority 0.8` (P0 content page: above the 0.7 pages, below
  Services' 0.9).

Consistency (final cross-surface check before commit):

- Path `"/industries"` identical in all three files; IA order Services → Industries →
  Why Choose Us holds in navbar, footer, and sitemap.

Gotchas / verification:

- **Active-link matching** uses `pathname.startsWith(to)`. `/industries` has no prefix
  collision with any route (it's the only `/i*` route), so highlighting is unambiguous.
- **Typed `<Link to="/industries">`**: valid only once `routeTree.gen.ts` regenerates
  (Lovable/CI). BUT `build` = `vite build` (esbuild, no typecheck) and `lint` = `eslint .`,
  so a stale routeTree cannot fail the production build; the route-type resolves on CI.
- Local build NOT run (lesson 02). Runtime check bundled with the pending Lovable batch:
  Industries shows in navbar + mobile menu + footer, navigates to /industries, highlights
  when active.

Note: pre-existing label inconsistency (navbar "About" vs footer "About Us") left as-is —
out of T2.4 scope.

Commit: f118979 "T2.4: link /industries in navbar, mobile menu, footer, and sitemap".
