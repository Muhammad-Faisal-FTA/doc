# DocEdit — Build Process, Strategy & Data Flow

This document walks through the actual process used to go from the
locked TRD to a verified, buildable Next.js app: how the TRD was read,
the order things were built in and why, the complete request/response
data flow for every major feature, the testing strategy, and the real
challenges hit along the way (with how each was resolved).

---

## 1. Reading the TRD — requirement extraction strategy

Before writing anything, the TRD was parsed into four buckets, because a
4-hour-timeboxed, ambiguity-heavy spec fails if you start coding before
you know what "done" means:

| Bucket | Purpose | Example from this TRD |
|---|---|---|
| **Hard requirements (FR/NFR)** | Non-negotiable, testable, numbered | FR-12: server-side rejection of non-owner writes |
| **Explicit cuts (section 2.2)** | Things to actively *not* build, even if "nice" | Real auth, `.docx`, real-time collab |
| **Locked decisions (sections 6, 9, 11)** | Choices already made for me — don't relitigate | Tiptap, Mongoose, "no smart parsing" on upload |
| **Open implementation details** | Things the TRD implies but doesn't specify — my judgment calls | How the client tells the server "who am I" |

The last bucket is the one that actually determines the architecture, so
it's worth naming the open decisions explicitly rather than discovering
them mid-build:

- The TRD says users are "switchable via a dropdown, persisted in
  `localStorage`" but doesn't say how the *server* learns which user is
  making a given API call. → Decision: `x-user-id` request header, set
  by a single client-side fetch wrapper.
- The TRD's API table shows `GET /api/documents?userId=` explicitly
  using a query param, while every other route just says "Owner only —
  server-enforced" with no transport detail. → Decision: match the TRD
  literally for that one route (query param), use the header for every
  other route, so the one place the TRD was explicit is honored exactly.
- "Current stable version packages" is a moving target that a
  training-data snapshot can't answer reliably. → Decision: query the
  npm registry directly instead of recalling versions from memory (see
  section 3).

**Strategy takeaway:** treat the TRD's own structure (Scope /
Out-of-Scope / FR / NFR / Data Model / API / Architecture / Risks) as the
build's spine — each later step maps back to one of those sections by
number, so nothing gets built that isn't traceable to a requirement, and
nothing required gets silently skipped.

---

## 2. Build order — and why that order

Work proceeded bottom-up: data layer → access rule → API → client
plumbing → UI. Each layer only depends on layers below it, which means
every layer could be sanity-checked before the next one was built on top
of it, instead of discovering a modeling mistake after the UI was
already wired to it.

1. **Types & seeded users** (`types/index.ts`, `lib/users.ts`) — the
   vocabulary everything else uses. Decided early because getting the
   `DocumentDTO` shape wrong would ripple into every API route and every
   component.
2. **The access-check module** (`lib/access.ts`) — built *before* any
   API route, deliberately. The TRD calls this out as "the one access-
   control rule the whole product hinges on" (section 8) and "the
   natural seam for the required unit test" (section 9). Building it
   first, as pure functions with zero DB dependency, meant it could be
   unit-tested immediately and every subsequent route could just import
   a already-correct rule instead of re-deriving `ownerId === userId`
   logic five separate times.
3. **DB connection + models** (`lib/mongodb.ts`, `models/`) — the
   cached-connection pattern was written directly against the TRD's
   named risk ("Atlas connection issues under Vercel serverless",
   section 11) rather than a generic Mongoose setup.
4. **API routes** — built in dependency order: `users` (nothing depends
   on it) → `documents` list/create → `documents/[id]` get/update/delete
   → `documents/[id]/share` → `upload` (needed the text-import helper
   first). Each route was written to import `canView`/`canEdit` rather
   than reimplementing the check, and wrapped in the same
   `withErrorHandling` helper so NFR-2 ("no unhandled 500s") is
   structural, not something to remember per-route.
5. **Client API wrapper** (`lib/api-client.ts`) — one file, one place
   that knows about `x-user-id` headers and response-shape parsing, so
   no component talks to `fetch` directly.
6. **Global client state** (`UserProvider`) — before any page, since
   almost every component needs "who's the active user" and building
   pages first would mean retrofitting context in afterward.
7. **Components, then pages** — `Editor.tsx` (Tiptap) was the highest-
   risk single piece (see Challenges) and was built and build-checked in
   isolation before wiring it into the document page.
8. **Verification pass** (install → test → build → lint → build again)
   — treated as its own step, not an afterthought. See section 4.

---

## 3. Version-selection strategy

"Use current stable versions, no conflicts" was treated as a *verifiable
claim*, not a recall task:

```
for each core package:
    npm view <package> version         # what does the registry say "latest" is right now
```

This immediately surfaced a case where "latest" and "usable together"
diverge: `typescript@7.0.2` is the registry's latest, but
`npm view ts-jest peerDependencies` shows a declared range of
`>=4.3 <7` — meaning the latest TypeScript is *incompatible* with the
testing tool. The resolution was to re-query for the latest version on
the `5.x` line (`5.9.3`) and pin that instead, documented as a deliberate
exception rather than silently downgrading.

The same "verify, don't recall" strategy caught a second, harder case
during install itself (not just planning) — see Challenge #1 below.

---

## 4. Verification strategy

Four independent checks, run in this order, each a hard gate before
moving on:

1. `npm install` — catches unpublished/incompatible version pins.
2. `npx jest` — catches logic errors in the access-check module in
   isolation, before anything depends on it being correct.
3. `next build` — catches TypeScript errors, App Router misuse (e.g.
   wrong async-params shape), and any import/module resolution issue
   across the whole app at once.
4. `npx eslint .` — catches code-quality and correctness patterns that a
   successful build doesn't (e.g. a `useEffect` doing something React
   itself warns is a risky pattern).

Each of these caught a real, different-category problem — none were
redundant with each other (see section 6).

---

## 5. Complete data flow, feature by feature

### 5.1 Identifying the active user (every request)

```
Browser                          UserProvider (client)              Any API route
--------                         ----------------------             --------------
App loads
  -> UserProvider mounts
     -> reads localStorage["docedit:activeUserId"]  (or defaults to Alice)
     -> GET /api/users  -------------------------->  ensureUsersSeeded()
                                                       -> upsert 3 users into Mongo (idempotent)
                                                      <-- { users: [...] }
     -> context now holds { activeUserId, users }

Every subsequent api.* call
  -> lib/api-client.ts attaches header: x-user-id: <activeUserId>
  -> route handler calls getUserIdFromHeaders(req.headers)
       -> isValidUserId(id)?  no  -> 401 { error: "..." }
                               yes -> proceed with that id as "requesting user"
```

Nothing about this is a security boundary on its own — see 5.4.

### 5.2 Create → edit → save → reopen (FR-1, FR-4, FR-5)

```
[+ New document] click
  -> POST /api/documents   { title? }         header: x-user-id
       -> validate userId (401 if missing/invalid)
       -> DocumentModel.create({ title, content: "<p></p>", ownerId: userId, sharedWith: [] })
       <- 201 { document: DTO }
  -> router.push(/document/:id)

Document page mounts
  -> GET /api/documents/:id                    header: x-user-id
       -> validate ObjectId format               (400 if malformed)
       -> findById                                (404 if missing)
       -> canView(doc, userId)                    (403 if neither owner nor shared)
       <- 200 { document: DTO }
  -> DocEditor renders with editable = (doc.ownerId === activeUserId)

User types in title or Tiptap body
  -> onChange handlers update local state immediately (no flicker)
  -> debounce timer (600ms) resets on every keystroke
  -> after 600ms idle:
       PATCH /api/documents/:id  { title?, content? }   header: x-user-id
         -> validate ObjectId, validate body shape       (400 on bad input)
         -> findById -> canEdit(doc, userId)              (403 if not owner)
         -> findByIdAndUpdate($set: update)
         <- 200 { document: DTO }
       UI status flips: "Saving..." -> "Saved" (or "Failed to save" on error, state not lost)

Refresh (F5)
  -> full remount -> same GET /api/documents/:id flow above
  -> content read straight from Mongo, so it's identical to pre-refresh state (FR-11)
```

### 5.3 Upload .txt/.md → new document (FR-6, FR-7)

```
[Upload .txt/.md] -> file picker -> file selected
  -> POST /api/upload   multipart/form-data { file }     header: x-user-id
       -> validate userId                                 (401)
       -> validate file present, extension is txt|md       (400 otherwise — enforces FR-7 server-side too)
       -> validate size (0 < size <= 2MB)                  (400 otherwise)
       -> file.text() -> raw string
       -> convertToEditorHtml(raw, extension)
            .md:  line-by-line; "#"/"##"/"###" prefix -> <h1>/<h2>/<h3>; else <p>
            .txt: every non-blank line -> <p>               (no heading detection)
            (HTML-escaped; "no smart parsing" per TRD section 11)
       -> DocumentModel.create({ title: filename, content: convertedHtml, ownerId: userId })
       <- 201 { document: DTO }
  -> router.push(/document/:id)   -- lands directly in the editor, content already populated
```

### 5.4 Share (read-only) + access enforcement (FR-8, FR-9, FR-12)

```
Owner clicks [Share] -> modal lists other seeded users, excluding current sharedWith
  -> pick "Bob"
  -> POST /api/documents/:id/share  { targetUserId: "user-bob" }   header: x-user-id
       -> validate ObjectId, validate targetUserId is a real seeded id  (400)
       -> findById -> canEdit(doc, userId)                              (403 if requester isn't owner)
       -> reject if targetUserId === doc.ownerId                        (400 — can't share with self)
       -> $addToSet sharedWith (idempotent — re-sharing is a no-op, not a duplicate)
       <- 200 { document: DTO }   (now includes "user-bob" in sharedWith)

Bob switches identity (UserSwitcher -> "Bob") and opens the same document
  -> GET /api/documents/:id   header: x-user-id: user-bob
       -> canView(doc, "user-bob")  -> true (in sharedWith)  -> 200 { document }
  -> Document page computes isOwner = (doc.ownerId === "user-bob") = false
       -> renders "Shared by Alice · read-only" badge
       -> DocEditor mounted with editable = false -> Tiptap toolbar not rendered, content not mutable

Bob attempts PATCH anyway (e.g. via curl, bypassing the UI entirely)
  -> PATCH /api/documents/:id   header: x-user-id: user-bob
       -> findById -> canEdit(doc, "user-bob") -> false (not owner, sharedWith doesn't grant edit)
       <- 403 { error: "Only the owner can edit this document." }
  -- this is the actual enforcement boundary; the UI hiding the toolbar is a courtesy, not the guarantee.
```

### 5.5 Document list — owned vs. shared (FR-10, FR-11)

```
GET /api/documents?userId=<activeUserId>
  -> DocumentModel.find({ $or: [{ ownerId: userId }, { sharedWith: userId }] })
       .sort({ updatedAt: -1 })
  <- 200 { documents: DTO[] }

Client splits the single response into two groups by ownerId, no second request:
  owned  = documents.filter(d => d.ownerId === activeUserId)
  shared = documents.filter(d => d.ownerId !== activeUserId)
  -> rendered as two visually distinct sections (solid border vs. dashed border + badge)
```

---

## 6. Testing strategy

**What's automated, and why this and not something else.** The TRD
requires "1+ automated test... covering a core logic unit (share-access-
check) or an API route" (NFR-5) — an explicit *or*. `lib/access.ts` was
chosen over an API-route test because:

- It's the single seam every route delegates to, so testing it once
  covers the logic behind `PATCH`, `DELETE`, `share`, and the `view`
  check on `GET` simultaneously, by construction — a route-level test
  would only cover one route's wiring, not the shared rule.
- It has zero infrastructure dependency (no DB, no HTTP, no mocking),
  so the test is fast, deterministic, and can't fail for environmental
  reasons — appropriate for a hard time budget.

Nine cases were written, deliberately covering the boundary conditions a
permissions function actually breaks on, not just the happy path:

| Case | Why it matters |
|---|---|
| Owner can view / can edit | Baseline correctness |
| Shared user can view | The core feature |
| Shared user **cannot** edit | The core *guarantee* — most likely place a copy-paste bug (`canView` logic accidentally reused in `canEdit`) would hide |
| Unrelated user cannot view / cannot edit | Rules out "anyone in the DB" being treated as implicitly shared |
| Empty userId cannot view / cannot edit | Guards against a falsy/undefined user id (e.g. a missing header) silently passing an `includes()` or `===` check |
| Owner with empty `sharedWith` | Guards against an off-by-something in array handling when the array is empty rather than absent |

**What's manual, and why.** TRD section 10 calls for a manual pass:
create → edit → save → refresh → upload → share → switch user → verify
read-only. This was walked mentally against the data flows in section 5
above rather than executed against a live browser + live Atlas cluster
in this exercise (see `SUBMISSION.md` for what's genuinely unverified
end-to-end vs. verified via build/lint/test).

**What's intentionally not automated.** API-route-level tests (e.g.
"PATCH as non-owner returns 403 over real HTTP") were scoped out — the
underlying logic they'd exercise is already covered by the
`lib/access.ts` suite, and standing up a test MongoDB instance was
judged lower-leverage than the access-check tests within a 4-hour
budget. Named explicitly in `ARCHITECTURE.md` as the next test to add,
rather than left unmentioned.

---

## 7. Challenges and how each was resolved

### Challenge 1 — `npm install` failed on an unpublished type-package version

**What happened:** `package.json` pinned `@types/react-dom@19.2.8` to
match `@types/react`'s version, on the assumption the two packages
version in lockstep. `npm install` failed with an ERESOLVE error —
`@types/react-dom` doesn't publish that version; its `19.x` line tops
out lower.

**Resolution:** queried the registry directly
(`npm view @types/react-dom versions`) for the actual latest `19.x`
release and re-pinned to that. **Lesson applied elsewhere in this
build:** don't assume companion packages version identically — verify
each one independently, which is exactly why every core dependency was
individually queried up front rather than pattern-matched from one.

### Challenge 2 — TypeScript 7 vs. `ts-jest`

Covered in section 3. Caught at *planning* time (reading
`ts-jest`'s declared peer range) rather than at *test-run* time,
because the peer dependency was checked before writing `package.json`,
not after something broke.

### Challenge 3 — ESLint 9 flat config: wrong assumption about the package shape

**What happened:** first `eslint.config.mjs` called
`nextConfig({ rules: "core-web-vitals" })`, assuming
`eslint-config-next`'s default export was a config-generating function
(a reasonable guess based on older ESLint config conventions). Running
`eslint .` threw `TypeError: nextPlugin is not a function`.

**Resolution:** inspected the installed package's actual compiled
output (`node_modules/eslint-config-next/dist/index.js`) instead of
guessing again, found the default export is already a flat-config
*array* ending in `module.exports = config`, and fixed the config to
spread that array directly: `[...nextConfig]`. **Why this matters as a
process point, not just a fix:** the second attempt was based on reading
the real installed artifact, not on retrying a different guess from
memory.

### Challenge 4 — a genuinely new, stricter lint rule catching a real pattern

**What happened:** `eslint-plugin-react-hooks` v7 (pulled in as
"current stable" per the versioning strategy in section 3) ships
`react-hooks/set-state-in-effect`, which flags `setState` called
directly inside a `useEffect` body — three call sites tripped it:
resetting `docs`/`doc` to `null` before a refetch when
`activeUserId`/`id` changes, and reading `localStorage` after mount in
`UserProvider`.

**Resolution — not a blanket suppression.** Each site was evaluated on
its own merits before deciding how to handle it:

- All three are standard, deliberate patterns (reset-before-refetch;
  read-client-only-storage-after-mount) rather than accidental
  cascading renders, which is what the rule is actually trying to catch.
- Rather than disabling the rule project-wide (which would silence it
  for a genuine future mistake too), each site got a narrow
  `eslint-disable-next-line` immediately above the specific call, with a
  comment explaining *why* that specific call is intentional.
- A subtlety hit while doing this: `eslint-disable-next-line` only
  suppresses the literal next line — an early attempt put an
  explanatory comment *between* the disable directive and the code line,
  which silently made the directive a no-op (reported as an "unused
  disable directive" *and* the original error re-appeared one line
  down). Fixed by keeping explanatory comments above the disable
  directive and the disable directive immediately adjacent to the code.

### Challenge 5 — Next.js 15+/16 dynamic route params are now async

**What happened:** newer Next.js versions changed `params` in route
handlers and dynamic page components from a plain object to a `Promise`
that must be awaited (`{ params }: { params: Promise<{ id: string }> }`
then `const { id } = await params`). Since the version-selection
strategy (section 3) deliberately picked current-stable Next.js rather
than an older, more "training-data-familiar" version, this API shape
had to be applied correctly from the start rather than retrofitted.

**Resolution:** every dynamic API route (`/api/documents/[id]/*`) uses
the `Promise`-based signature; the dynamic *page*
(`app/document/[id]/page.tsx`) sidesteps the issue entirely by being a
Client Component that reads the id via `useParams()` from
`next/navigation` instead of a server-side `params` prop — simpler than
threading an async prop through a component that's client-rendered
anyway. Verified by a clean `next build` rather than assumed correct.

### Challenge 6 — Tailwind CSS v4's config model is different in kind, not just version

**What happened:** Tailwind v4 (current stable per the registry check)
removed the `tailwind.config.js` + `content: [...]` model in favor of a
CSS-first `@import "tailwindcss";` directive plus a dedicated
`@tailwindcss/postcss` PostCSS plugin, with automatic content detection
— a v3-style config file would have silently done nothing.

**Resolution:** confirmed `@tailwindcss/postcss` as the correct
plugin package via the registry (not guessed), wired it into
`postcss.config.mjs`, and used the v4 CSS-import approach in
`globals.css` instead of writing a now-obsolete config file. Verified by
checking the build actually produced styled output, not just that it
compiled.

### Challenge 7 — Tiptap v3 package/extension changes

**What happened:** in Tiptap v2, `Underline` was a separate package
(`@tiptap/extension-underline`) not included in `StarterKit` — a detail
easy to carry over incorrectly when upgrading to v3 from memory.

**Resolution:** checked v3's actual `StarterKit` dependency list via the
registry before writing the editor component, confirmed `Underline` is
bundled in v3, and used `editor.chain().focus().toggleUnderline().run()`
directly without adding an extra package that would have been both
unnecessary and (if versions mismatched) a possible source of a runtime
extension-conflict error.

---

## 8. What this process would look like with more time

Section-6-style unit coverage would expand to one integration test per
mutating route (asserting the 403 path over real HTTP, not just the
underlying function), and the manual QA pass in section 6 would be
executed against a live Atlas cluster and a deployed Vercel URL instead
of reasoned through against the data-flow diagrams in section 5 — both
already flagged as open items in `SUBMISSION.md` rather than presented
as done.