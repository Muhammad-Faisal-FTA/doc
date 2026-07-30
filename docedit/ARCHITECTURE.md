# Architecture

## Overview

```
Client (Next.js App Router, React 19)
  |- User switcher (localStorage-persisted, sends x-user-id header)
  |- Document list (owned vs shared, visually distinct)
  |- Tiptap editor (editable prop driven by server-confirmed access)
  `- Upload widget (.txt/.md only)
        |
        v  fetch()
Next.js API Routes (/app/api/*)
  |- lib/access.ts        - single source of truth for owner/shared logic
  |- lib/current-user.ts  - reads + validates the mocked user id
  |- lib/import-text.ts   - naive .txt/.md -> Tiptap HTML converter
  |- lib/api-response.ts  - consistent JSON errors, no unhandled 500s
  `- Mongoose models (User, Document)
        |
        v
MongoDB Atlas (cached connection via lib/mongodb.ts)
```

Single Next.js deployable: the frontend and every API route live in one
app, one Vercel deployment, no separate backend service (NFR-3).

## Key decisions

**Mocked auth via header, not cookies.** There's no session. The client
persists the active user id in `localStorage` and sends it as an
`x-user-id` header on every API call (`lib/api-client.ts`). This is not a
security boundary by itself — anyone could forge the header with curl.
The actual boundary is server-side: every mutating route re-derives
`ownerId === requestingUserId` from the database record, not from
anything the client claims about permissions (FR-12). Forging the header
lets you *view* as someone else; it never lets you *write* as an owner
you aren't.

**One access-check module, used everywhere.** `lib/access.ts` exports two
pure functions, `canView` and `canEdit`, with zero dependency on Mongoose
or Next — just a `{ ownerId, sharedWith }` shape in, a boolean out. Every
API route imports these instead of re-deriving the rule inline. This is
the seam called out in the TRD as the natural home for the required unit
test, and it's the reason there's exactly one place a permissions bug
could hide instead of five.

**`sharedWith` as a flat string array on the Document, not a join
collection.** At this scale (a handful of seeded users, a handful of
documents) a separate `Share` collection buys normalized-data hygiene at
the cost of an extra query and an extra place for owner/share state to
drift out of sync. A flat array keeps every access check and every
document fetch to a single `findById` — appropriate for the product as
specified, revisited if the user/doc count were expected to grow.

**Auto-seeding instead of a mandatory seed step.** The TRD's <5-minute
setup requirement (NFR-7) doesn't leave room for "clone, configure env,
run a seed script, then start the server." `GET /api/users` lazily
upserts the three seeded users on first call (`lib/db-helpers.ts`), so
`npm run dev` alone is enough. `npm run seed` still exists for anyone who
wants to pre-populate the DB explicitly (e.g. CI).

**Cached Mongoose connection (`global._mongooseCache`).** Vercel's
serverless functions can spin up a fresh module scope per invocation;
without caching the connection on `global`, each request would open a
new connection to Atlas and the free tier's connection limit would be
exhausted quickly under any real traffic. This is the standard
Next.js-on-serverless pattern, called out explicitly as a risk mitigation
in the TRD (section 11).

**Upload parsing is deliberately dumb.** `lib/import-text.ts` maps
`#`/`##`/`###` lines to h1/h2/h3 for `.md` and treats every non-blank
line as a paragraph otherwise — no bold/links/lists/tables parsing. The
TRD locks this in explicitly to avoid scope creep on a feature that's
meant to get content into the editor, not be a full Markdown parser.
Once in the editor, the user has the full rich-text toolbar to reformat.

**Editor read-only state comes from the server, not just UI hiding.**
`DocEditor`'s `editable` prop is driven by `doc.ownerId === activeUserId`
computed from the document the API actually returned — the same document
whose `PATCH` would be rejected server-side for a non-owner. The toolbar
disappearing is a UX nicety; the enforcement is the 403 in
`app/api/documents/[id]/route.ts`.

**Autosave over an explicit Save button.** Title and content changes are
debounced (~600ms) and PATCHed automatically, with a small "Saving... /
Saved / Failed to save" status indicator. Chosen over a Save button
because the TRD doesn't call for explicit save semantics, and a document
editor where losing 10 seconds of typing to a missed click is possible
felt like the worse default for a "production-quality" bar.

## What I'd do differently with more time

- Replace the effect-based data fetching in `DocumentList` and the
  document page with a small fetching library (SWR/TanStack Query) for
  built-in caching, revalidation, and race-condition handling instead of
  hand-rolled `useEffect` + `useState`.
- Add optimistic UI for share/delete instead of waiting on the round-trip.
- Expand the Jest suite to cover at least one API route (e.g. the
  ownership-rejection path on `PATCH /api/documents/:id`), not just the
  pure access-check functions — the TRD only requires one of the two, and
  the access-check unit test was the higher-leverage single test to write
  given the time budget.
