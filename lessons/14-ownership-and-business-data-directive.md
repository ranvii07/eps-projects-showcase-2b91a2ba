**Project directive (user, 2026-07-07, effective immediately): Claude is now the SOLE engineer/architect/reviewer/QA owner. Lovable is OUT of the active dev workflow — never defer validation to it. AND: never implement/display/seed/publish/modify any factual business data without explicit per-item approval in THIS project, even if it appears in the blueprint.**

## Ownership posture

- Treat this as OUR codebase. Own architecture, implementation, quality, consistency,
  and technical direction. No parallel developer, no second AI, and NO Lovable will
  validate, repair, regenerate, review, or complete anything. Deliver as if this exact
  implementation ships to production.
- Lovable returns only AFTER functional completion, for optional visual refinement.

## Verification rule (supersedes earlier "defer to Lovable/CI" wording)

- Local build/tests remain unavailable (Defender blocks `bun install`, lesson 02).
- Where execution is impossible, perform the STRONGEST static verification: trace
  imports, routes, types, interfaces, deps, state flow, and logic. Then **explicitly
  document the residual risk and give a concise manual verification checklist.**
- NEVER phrase verification as "Lovable/CI will confirm." Do NOT write that in reports,
  PROGRESS.md, or lessons. (Earlier lessons 02/03/05/06/09-13 used "defer to Lovable/CI"
  — from now on, replace that framing with static-verification + documented-risk +
  manual-checklist.)

## Business-Data Verification (MANDATORY gate)

Before implementing, displaying, seeding, publishing, or modifying ANY factual business
information, pause at the Review Gate and get explicit confirmation for that exact item —
even if it's in the blueprint §7, planning docs, prior chats, placeholders, or drafts.
Covered (non-exhaustive): company stats (years/projects/revenue/workforce), corporate
registrations (CIN/PAN/GSTIN/IEC/MSME), certifications/compliance, client names & logos,
OEM/technology partners, awards, office locations & contact info, financial figures,
dates, technical capabilities & marketing claims, any factual company statement.

For DB writes involving business data: (1) read-only verify current state first;
(2) present the proposed additions/modifications; (3) wait for explicit approval before
any write. Accuracy > speed.

### Refinement (user, 2026-07-07): approved = canonical, don't re-ask

Once the user has explicitly approved a business fact during this project, it is the
canonical value and may be REUSED consistently anywhere in the codebase WITHOUT another
Review Gate for that fact. Only pause again when the info is:

1. **New** (not previously approved),
2. **Modified** (different from the approved value),
3. **Uncertain / inconsistent / conflicting** with another source,
4. **A DB write involving business data**, or
5. **Materially affecting legal, regulatory, compliance, marketing, or public-facing
   company claims.**
   Do not nag the user to reconfirm the same approved fact on reuse.

## Approved business-data registry (running — the canonical approved values)

Append here the moment the user approves a fact; reuse freely thereafter. Blueprint §
values are candidates ONLY until they appear here.

- **Stats band (§7.1)** — approved T3.1 (2026-07-07): 25+ Years of Team Experience ·
  1000+ Projects Delivered · ₹100 Cr+ Revenue in Last 5 Years · 150+ Technical Workforce
  (incl. 25+ Core Engineers) · PAN India Execution Reach · 100% Turnkey Capability.
- **"25+ Years of Team Experience" / team-experience framing** — CANONICAL, approved
  (reaffirmed by user 2026-07-07). Reuse this exact framing anywhere in the app (Hero
  bullet, About, footer, etc.) WITHOUT re-asking. The "25+ years" claim MUST always be
  team/leadership-framed (§7.9), never the company's age. DO NOT reopen this decision.
- **Industries page (§7.4)** — approved T2.1 (2026-07-07): the 8 industries + descriptions
  - sectors strip, verbatim as in industries.tsx.
- **NOT yet approved (do not reuse/write until user confirms the VALUES):** §7.2 credential
  values (CIN/PAN/GSTIN) — T3.2 shipped render code only; §7.10 contact roster/addresses;
  §7.7 client names; §7.8 project details; §7.6/§7.5/§7.3 copy pending its task's gate.

## Source-of-truth hierarchy (user, 2026-07-07)

When sources conflict, follow this order and, if still unclear, ASK:

1. User's explicit instructions & approvals during this project.
2. The approved project blueprint (Downloads\EPS_Website_Opus_Blueprint.md).
3. The repository itself — PROGRESS.md, lessons/, docs/, codebase, commits.
4. My own summaries/notes.
   Model memory / cross-session memory is a continuity aid ONLY — NEVER canonical. If memory
   ever conflicts with the documented project state or the user's instructions, follow the
   docs/instructions and ask for clarification.

## Unchanged process

Full workflow still applies per task: read files → understand architecture → plan →
implement approved scope only → thorough self-review → Review Gate → wait → commit →
update PROGRESS.md + lessons/. Small, isolated, reversible commits. Final consistency
pass (design system, spacing, typography, responsive, interaction, conventions) before
every commit. Surface material architecture/design/UX/a11y/content decisions at the gate.
