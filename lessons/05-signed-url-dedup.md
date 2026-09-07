**T0.3 collapsed the 5 signed-URL copies onto one `useSignedUrl`/`getSignedUrl` module without changing any rendered markup; the 4 image renderers had divergent markup, so only the 2 admin ones share a `SignedImage` component while the 2 public ones keep their own markup and just call the hook.**

Blueprint §1.5 correction: it listed "near-identical SignedImages" in projects,
clients, AND credentials. In reality `admin/credentials.tsx` has NO SignedImage —
it has an imperative `openSignedUrl()` that signs a URL and `window.open`s it.
So the five `createSignedUrl` call sites were: public `SignedProjectImage`
(projects.tsx) + `SignedLogo` (clients.tsx); admin `SignedImage` in projects
(object-cover) and clients (object-contain); and credentials' `openSignedUrl`.

Why not one shared component for all five (the literal Goal wording):

- The four image renderers do NOT share markup. Public projects uses a full-bleed
  `object-cover` image with hover-scale and an `h-5 w-5` spinner loader on a
  full-size box; public clients uses `max-h-12 w-auto object-contain`, an
  `ImageIcon` null-placeholder, and an `h-4 w-4` spinner; the two admin renderers
  are `className`-parameterised 3-state boxes differing only by object-fit.
- The task's hard acceptance criterion is "rendered markup byte-identical." A
  single component can't reproduce four different markups without changing some
  of them. The byte-identical rule wins over the "one component" suggestion.

Design chosen (satisfies both "1 createSignedUrl call site" and "no markup change"):

- `src/lib/use-signed-url.ts` — the ONLY `supabase.storage…createSignedUrl` call,
  wrapped as `getSignedUrl(bucket, path, ttl) -> { url, error }` (imperative) and
  `useSignedUrl(bucket, path, ttl) -> string | null` (reactive hook mirroring the
  old effect semantics: reset on change, active-flag guard, skip when path null).
- `src/components/site/SignedImage.tsx` — ONE shared component reproducing the
  admin renderer markup exactly, parameterised by `bucket` + `className` + `fit`
  ("object-cover" | "object-contain"). Reused by admin projects & clients.
- Public `SignedProjectImage` / `SignedLogo` keep their unique JSX verbatim and
  only swap their internal fetch for `useSignedUrl`.
- credentials `openSignedUrl` uses `getSignedUrl`; `{ url, error }` preserves the
  original error-toast description exactly.

Placement note: T0.3 explicitly allows `src/lib/` or `src/components/site/`. The
shared SignedImage is admin-used but lives in `components/site/` per that explicit
allowance — chosen over inventing a `components/admin/` folder (the user barred new
file layouts during Phase 0). Revisit only if a broader admin-component home is
introduced by a later task.

Verification: `grep createSignedUrl src -r` → 1 hit; every touched renderer's
img/className/placeholder/loader markup is byte-identical; type-compatibility
checked by hand. Local build NOT run (bun install blocked by Defender, lesson 02) —
verification defers to the CI/Lovable build.
