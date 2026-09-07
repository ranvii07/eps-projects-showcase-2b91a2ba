**T3.1 added a homepage company-stats band (§7.1, six metrics) between Hero and Services — all six kept, and the "25+ years" label rendered as "Years of Team Experience" to satisfy the §7.9 hard rule against implying the company's age (user-approved).**

What was done:

- New `src/components/site/CompanyStats.tsx`: static band mapping a local STATS array
  to a responsive grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-6`), cyan numerals
  (`text-3xl md:text-4xl font-bold text-cyan-400`) + slate labels, dark band
  (`bg-zinc-900 border-y border-zinc-800 py-16`), `data-testid="company-stats"`.
- Wired into `routes/index.tsx` between `<Hero />` and `<Services />` (rollback = remove
  the import + render line + file).

Content (§7.1, verbatim except the approved §7.9 reconciliation):
25+ Years of Team Experience · 1000+ Projects Delivered · ₹100 Cr+ Revenue in Last 5
Years · 150+ Technical Workforce (incl. 25+ Core Engineers) · PAN India Execution Reach ·
100% Turnkey Capability.

Decisions:

- **Kept all six stats** (not the deck's four). A 6-col band at `lg` isn't crowded and
  wraps 3+3 / 2+2+2 on smaller screens — blueprint allowed this as implementation judgment.
- **§7.9 label:** §7.1 lists "Years Experience" but annotates "(team/leadership framing,
  see §7.9)"; §7.9 forbids implying the company itself is 25 years old (Est. 2021). So the
  label reads **"Years of Team Experience"**. User explicitly approved this at the review
  gate. (Related: Hero.tsx:33 bullet "25+ Years of Industry Experience" is NOT yet team-framed
  — T3.3/T3.5 copy-rule pass should reconcile it; the blueprint's claim that the Hero bullet
  "already says team-experience wording" is inaccurate — flag for T3.3.)

Consistency pass (user-requested, pre-commit): container/typography/rhythm all match —
`py-16` matches the ClientsBanner band idiom (content sections use `py-20`), `border-y`
mirrors ClientsBanner's `border-t border-b`, numeral size matches the dominant
`text-3xl md:text-4xl font-bold`. No changes needed.

Verification: local build NOT run (lesson 02); trivial static component verified by
inspection. Runtime check (band under hero, long values ₹100 Cr+/PAN India wrap cleanly,
responsive 2→3→6) bundled with the pending Lovable batch.

Commit: f05e0d0 "T3.1: add company stats band to homepage between Hero and Services".
