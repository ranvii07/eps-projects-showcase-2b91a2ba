**The public contact form already inserts into `contact_submissions` — the old status docx claiming it was "not yet wired" is wrong.**

`src/components/site/ContactForm.tsx:41` performs
`supabase.from("contact_submissions").insert({ ... })` directly from the browser
on submit. The submission path is complete and working today.

Consequences for planning:

- The remaining contact-pipeline work (Blueprint Phase 1) is **hardening and
  notifications**, not wiring: add zod validation, the missing `company` field
  (the DB column exists), a honeypot, `source: "website"`, reconcile the
  `required`-marked labels with the actual JS validation (currently only
  name/email/message are validated while phone/subject are labelled `*` and
  HTML-`required`), and staff email notification.
- Treat the **codebase** as the source of truth over any older status document
  (docx, ChatGPT master-prompt PDF). Those were audited and found partially
  wrong; the Blueprint §2 already synthesizes the corrected picture.

Verified 2026-07-07 by direct inspection of the connected repo
`ranvii07/claude_website` @ main.
