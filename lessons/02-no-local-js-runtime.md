**Local builds don't work on this machine: bun is installed but `bun install` is blocked by Windows Defender (EPERM on rename-into-cache), and the user has ruled out security changes — so code tasks are verified via CI/Lovable builds, not locally.**

> **PARTLY SUPERSEDED (2026-08-03, T8.1 — see `19-project-gallery-and-private-preview.md`).**
> `bun install` still fails exactly as described below, but two facts here are now stale:
> **node IS installed** (v26.4.0), and packages missing from the partial `node_modules` can be
> fetched by extracting the npm tarball directly (`curl` + `tar`), which bypasses the
> cache-move step Defender blocks. With that, **all four CI steps run locally** —
> `format:check`, `lint`, `typecheck`, `build`. Lesson 19 has the exact commands.
> Prefer running them over deferring to CI.

Environment facts (2026-07-07):

- **bun 1.3.14** is installed at `C:\Users\Dell\.bun\bin\bun.exe` (not on the
  default shell PATH — call it by full path). `node`/`npm` are absent.
- The working clone lives at **`C:\Users\Dell\eps-web`** (branch `main`). It was
  moved out of the session scratchpad because the long scratchpad path blew past
  the Windows 260-char `MAX_PATH` limit and broke `node_modules` extraction.
  `git config core.longpaths true` is set on this clone.
- `bun install` fails repeatedly with `EPERM: Operation not permitted
(NtSetInformationFile())` while moving extracted packages into bun's cache —
  Windows Defender real-time scanning locking freshly-written files (fails on
  different packages each run; classic bun-on-Windows issue).

Decisions (user, 2026-07-07):

- **Do NOT make Windows security changes** and do NOT request Defender
  exclusions. So local `bun install` / `bun run build` / `tsc` stay unavailable.
- **Rely on CI / Lovable builds** as the verification signal for code tasks.

How to apply:

- For code tasks, verify by the strongest available means (type-level
  reasoning, reading every consumer of touched symbols, matching existing
  patterns) and **state in the report that the local build was not run** and
  that verification defers to the Lovable/CI build. Never claim a local build
  passed when it wasn't executed.
- If a future machine has a clean runtime, `bun install && bun run build` is the
  intended check (fallback `npm run build`).
