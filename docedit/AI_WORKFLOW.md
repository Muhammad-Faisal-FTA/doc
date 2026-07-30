# AI Workflow Note

## What AI was used for

The entire initial scaffold (project config, models, API routes, lib
utilities, components, pages, and the unit test) was generated with an
AI assistant (Claude) from the locked TRD, in a single working session
with an actual dev container available — not generated blind.

## What was verified, not just accepted

Every claim below was checked by actually running the tooling, not by
trusting the model's first output:

- **Package versions.** Rather than letting the model guess "current
  stable" from memory (which is always somewhat stale), I had it query
  the npm registry directly for the current version of every dependency
  before writing `package.json`.
- **Install.** `npm install` was run for real. It caught one bad pin
  immediately: `@types/react-dom@19.2.8` doesn't exist on the registry
  (the `19.x` line tops out lower than `@types/react`'s). Fixed to the
  actual latest published version.
- **Build.** `next build` was run against the real codebase, twice
  (before and after lint fixes). Both times it compiled and typechecked
  cleanly with zero errors.
- **Lint.** `next lint`'s new flat-config setup (ESLint 9 +
  `eslint-config-next`) initially failed outright because the generated
  config assumed the package's default export was a config *function*;
  it's actually already a flat-config *array*. Fixed the config file
  after inspecting the installed package's actual output. Lint then
  surfaced 3 real findings from the newer, stricter
  `react-hooks/set-state-in-effect` rule (flagging `setState` calls made
  directly in `useEffect` bodies) in the user-provider and two data-
  fetching effects.
- **Tests.** `jest` was run against the real suite (9 cases covering
  `canView`/`canEdit` for owner, shared-viewer, unrelated-user, and
  empty-id cases) — all passing, not just written and assumed correct.

## What was changed or rejected from the first pass

- **TypeScript version.** The registry's "latest" `typescript` is `7.0.2`
  — a from-scratch rewrite of the compiler. `ts-jest`'s published peer
  range explicitly excludes it (`>=4.3 <7`). Rather than force it and
  risk the test runner breaking, I pinned to `5.9.3`, the latest version
  on the well-supported `5.x` line. This is the one place "use the
  latest" was deliberately overridden in favor of "use the latest
  version that the rest of the toolchain actually supports."
- **The three `react-hooks/set-state-in-effect` lint errors** were not
  silently suppressed wholesale. Each was inspected individually: all
  three are the standard "reset to a loading state, then refetch when an
  id/user dependency changes" pattern, and one is the standard
  "localStorage isn't available during SSR, read it after mount" pattern
  — both legitimate uses the newer rule is (correctly, per its own docs)
  cautious about, but doesn't special-case. Suppressed narrowly with an
  inline `eslint-disable-next-line` and a comment explaining why, rather
  than disabling the rule project-wide.
- **ESLint config shape** — see "Build" above; the first attempt
  (`nextPlugin({ rules: "core-web-vitals" })`) was wrong for this
  package version and was corrected against the actual installed
  package source, not a guess.

## What was not independently re-verified

No deployment to a live Vercel instance or connection to a real MongoDB
Atlas cluster was part of this exercise — the build was validated with a
placeholder `MONGODB_URI` (connection errors would only surface at
request time, not build time, since Next.js doesn't hit the DB during
static analysis/build). Anyone running this for real should follow
`README.md` and confirm the live create -> save -> refresh -> share ->
switch-user flow against an actual Atlas cluster before considering it
submission-ready.
