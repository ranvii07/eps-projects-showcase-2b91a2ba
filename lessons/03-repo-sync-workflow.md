**Commits are made locally on `main` and reach the connected repo through the user's existing GitHub/Lovable integration — do NOT request or set up a GitHub PAT, and do not assume direct push works.**

Decision (user, 2026-07-07): "Do not request a GitHub PAT — we'll use the
existing GitHub/Lovable integration."

Working model:

- The maintenance clone is at `C:\Users\Dell\eps-web` (branch `main`, remote
  `origin` = https://github.com/ranvii07/claude_website.git, Lovable-connected).
- Do the work, commit locally with clear per-task messages (Blueprint Shutdown
  Sequence). Keep every commit in a building state.
- Propagation to GitHub/Lovable is handled by the user's existing integration —
  not by us minting credentials. A direct `git push` may or may not succeed via
  cached credentials; do not depend on it and do not ask the user for a token.
- Never force-push, rebase, amend, or squash already-pushed commits (AGENTS.md /
  Blueprint §0 rule 2). Local-only amends before propagation are fine.

How to apply: finish a task → commit locally → report. If the user asks to sync,
attempt `git push`; if it fails on auth, hand the user the commit(s) and let the
integration carry them. Do not raise the credential question again.
