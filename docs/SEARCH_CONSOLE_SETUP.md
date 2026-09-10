# Google Search Console — Setup & Verification (T4.4)

Step-by-step guide for registering **epsprojects.in** with Google Search Console
(GSC), submitting the sitemap, and confirming indexing. The console steps are
**performed by the site owner** — Claude cannot verify ownership or read GSC.

Canonical host: **`https://www.epsprojects.in`** (non-`www` should redirect here —
see step 6). This host is used consistently by `src/lib/site.ts` (`SITE_URL`),
`public/sitemap.xml`, and the `Sitemap:` line in `public/robots.txt`.

---

## 0. Prerequisites

- Access to the Google account that should own the property (use a shared/company
  account, not a personal one, so ownership survives staff changes).
- Access to **DNS records** for `epsprojects.in` (registrar or DNS host) — needed
  for the recommended Domain-property verification.
- The site deployed and reachable at `https://www.epsprojects.in`.

## 1. Add the property

1. Go to <https://search.google.com/search-console>.
2. Click **Add property**.
3. Choose **Domain** (recommended) and enter `epsprojects.in`.
   - A Domain property covers **all** subdomains and both `http`/`https` and
     `www`/non-`www` in one place — the cleanest option.
   - If DNS access is unavailable, fall back to a **URL-prefix** property for
     `https://www.epsprojects.in` (verify via HTML tag or HTML file upload).

## 2. Verify ownership

**Domain property (DNS TXT):**

1. GSC shows a `google-site-verification=…` **TXT record**.
2. Add it as a TXT record at the apex (`@`) of `epsprojects.in` in your DNS host.
3. Wait for DNS propagation (minutes–hours), then click **Verify**.

**URL-prefix fallback (if used):**

- **HTML tag:** add the provided `<meta name="google-site-verification" …>` to the
  site `<head>`. Note: the app renders `<head>` per-route via TanStack Router
  `head()` (see `src/routes/__root.tsx`), so this tag would be added there — treat
  as a **follow-up code change**, not part of T4.4. Prefer the DNS method to avoid
  a code change.
- **HTML file:** upload the provided `googleXXXX.html` to `public/` so it serves at
  the site root. Also a code/repo change — prefer DNS.

## 3. Submit the sitemap

1. In GSC → **Sitemaps** (left nav).
2. Under _Add a new sitemap_, enter **`sitemap.xml`** and **Submit**
   (full URL: `https://www.epsprojects.in/sitemap.xml`).
3. Status should read **Success**; _Discovered URLs_ should reach **10**
   (the count in `public/sitemap.xml` — see the list below).

## 4. Confirm the sitemap is reachable and correct

- Open `https://www.epsprojects.in/sitemap.xml` in a browser — it should return the
  XML (HTTP 200), not a 404 or the SPA shell.
- Open `https://www.epsprojects.in/robots.txt` — confirm it shows:

  ```
  User-agent: *
  Allow: /
  Disallow: /admin

  Sitemap: https://www.epsprojects.in/sitemap.xml
  ```

## 5. Request indexing (optional, speeds first crawl)

- Use **URL Inspection** (top search bar) on the homepage
  `https://www.epsprojects.in/` → **Request indexing**. Repeat for a few key pages
  (`/services`, `/industries`, `/contact`). Google crawls the rest from the sitemap.

## 6. Verify canonical host & redirects

- Confirm **non-`www` → `www`** redirect: `https://epsprojects.in/` should 301 to
  `https://www.epsprojects.in/`. If it does not, configure the redirect at the
  hosting/DNS layer so Google consolidates signals on the canonical host that the
  sitemap and `<link rel="canonical">` already use.
- Confirm **`http` → `https`** redirect similarly.

## 7. Ongoing checks (first weeks after launch)

- **Pages** report: watch _Indexed_ climb toward 10; investigate any
  _Not indexed_ reasons.
- **Sitemaps** report: status stays _Success_, no fetch errors.
- **Page indexing** should **not** list `/admin/*` — those are intentionally kept
  out via `robots.txt` `Disallow: /admin` **and** a `noindex,nofollow` meta on the
  admin surfaces (lesson 06 / T0.5). If admin URLs appear, re-check both.

---

## Routes in the sitemap (10 public URLs)

All live, indexable public routes are present with sensible priorities. Admin
routes (`/admin/*`) are deliberately excluded (private CMS; disallowed + noindex).

| Path          | changefreq | priority |
| ------------- | ---------- | -------- |
| `/`           | monthly    | 1.0      |
| `/services`   | monthly    | 0.9      |
| `/about`      | monthly    | 0.8      |
| `/industries` | monthly    | 0.8      |
| `/contact`    | monthly    | 0.8      |
| `/projects`   | monthly    | 0.7      |
| `/clients`    | monthly    | 0.7      |
| `/privacy`    | yearly     | 0.3      |
| `/terms`      | yearly     | 0.3      |

**Keep in sync:** when a new public route is added (or one removed), update
`public/sitemap.xml` and this table in the same change (the T2.4 cross-surface
sync rule — lesson 11).

**Deployment checklist:** whenever a public route is added or removed, treat
"update/audit `public/sitemap.xml`" and "re-submit (or refresh) `sitemap.xml` in
Search Console → Sitemaps" as required steps of that deployment, so Google
re-crawls the changed URL set.
