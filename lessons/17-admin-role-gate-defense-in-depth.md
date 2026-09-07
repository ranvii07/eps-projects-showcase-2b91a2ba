**The `_authenticated` route guard that role-gates the admin CMS is DEFENSE-IN-DEPTH ONLY — a UX/redirect convenience. RLS (`is_staff(auth.uid())` on every table + storage bucket) remains the ACTUAL authorization boundary. Never move real enforcement into the frontend guard; a determined caller can bypass the SPA entirely and hit PostgREST directly, where RLS is what stops them.**

## Context (T5.2, 2026-07-13)

Before T5.2 the admin shell was **auth-gated, not role-gated**: `_authenticated/route.tsx` `beforeLoad` only checked `supabase.auth.getUser()`. Any authenticated Supabase user reached the CMS UI; RLS was the sole real barrier (Blueprint §"Admin shell is auth-gated" finding). T5.2 adds a frontend role check so a role-less user is redirected instead of seeing a shell whose data-fetches all fail under RLS (blank/broken screen).

## What the guard does

After `getUser`, it self-queries `user_roles`:

```ts
const { data: roles, error: rolesError } = await supabase
  .from("user_roles")
  .select("role")
  .eq("user_id", data.user.id)
  .limit(1);
if (rolesError || !roles || roles.length === 0) {
  /* deny */
}
```

- `is_staff(uid)` in the DB == "has ANY row in `user_roles`" (roles: `director`/`coo`/`admin`). So _presence of any row_ = staff. The guard mirrors that: 0 rows → not staff.
- The `"user_roles self or staff select"` RLS policy (`user_id = auth.uid() OR is_staff(auth.uid())`) lets **every** authenticated user read their **own** rows, so this self-scoped query succeeds for anyone and returns an empty set (not an error) for a role-less user. This is why T5.2 depends on T0.2 confirming that self-read policy.
- **Fail closed:** empty OR unreadable (`rolesError`) is treated as not-staff. A transient read error logs a real staff user out; they simply sign back in. Acceptable because this is not the security boundary — RLS is.

## Sign-out prevents a redirect loop (the non-obvious part)

`admin.login.tsx` `beforeLoad` bounces **any** logged-in user to `/admin/dashboard`. So naively redirecting a non-staff (but authenticated) user to `/admin/login` loops forever:
`login → dashboard → _authenticated guard → login → …`.
Fix: **`await supabase.auth.signOut()` before the deny-redirect.** After sign-out the login page's `getUser` sees no user and stays put. It is also semantically correct — a non-staff account should not hold an admin session. (Alternative considered: gate `admin.login.tsx`'s dashboard-bounce on staff status instead of forcing sign-out — rejected to keep the role logic in one file.)

## Companion setting (user-confirmed, not code)

Blueprint T5.2 note: confirm **Supabase public signups are disabled** in the Auth dashboard. If open, anyone can self-register a session; the guard still denies them the CMS and RLS still hides all data, but disabling open signups removes the ability to create sessions at all. Dashboard-only setting — record the outcome here when confirmed.

## Verification (no local runtime — lesson 02)

Static only: diff scoped to `_authenticated/route.tsx` (+26); column names checked vs `types.ts`; RLS self-read policy checked vs baseline SQL L302-303; loop reasoning checked vs `admin.login.tsx:23-28`. Live DoD (role-less user redirected with toast; staff unaffected) needs an authenticated session to exercise — pending, consistent with the other admin tasks.
