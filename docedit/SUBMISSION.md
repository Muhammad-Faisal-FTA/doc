# Submission

## Included (matches TRD sections 4 & 5)

- Document CRUD: create, rename, edit, save, reopen (FR-1, FR-2, FR-4, FR-5)
- Rich text editing via Tiptap: bold, italic, underline, headings (H1-H3),
  ordered/unordered lists (FR-3)
- `.txt`/`.md` upload -> new editable document, with the accepted types
  stated in the UI (FR-6, FR-7)
- Read-only sharing between the 3 seeded users, with a "Shared by
  {owner}" badge and no editing toolbar for recipients (FR-8, FR-9)
- Owned vs. shared documents are visually distinct in the list (FR-10)
- Full state (documents, sharing, active user) survives a page refresh
  — Mongo-backed + `localStorage` for the active user (FR-11)
- Server-side rejection of edit/save/delete/share for non-owners,
  independent of what the client UI shows (FR-12)
- Input validation on every API route: missing fields, invalid
  ObjectIds, wrong file type/size (NFR-1)
- No unhandled 500s — every route is wrapped and returns clean JSON
  errors (NFR-2)
- Single Next.js deployable, no separate backend (NFR-3)
- 9 Jest unit tests over the `canView`/`canEdit` access-check logic
  (NFR-5)
- Code organized by concern: `models/`, `app/api/`, `components/`, `lib/`
  (NFR-6)
- README with a <5-minute clone-to-running path (NFR-7)

## Not included (explicit TRD cuts, section 2.2 — not gaps)

Real authentication, `.docx` upload/parsing, real-time collaborative
editing, edit access for shared users, version history/undo beyond the
editor's native undo, comments, notifications, search.

## Incomplete / would want more time for

- **Live deployment.** The app was built and verified locally (build,
  lint, and full test suite all passing — see `AI_WORKFLOW.md`) but has
  not been pushed to a live Vercel URL or connected to a real Atlas
  cluster as part of this exercise. `README.md` has the exact steps;
  it's an `npm install` + env var + `vercel deploy` away.
- **Walkthrough video / demo GIF.** Not recorded as part of this
  written submission.
- **API-level test coverage.** The required unit test covers the
  access-check logic (the highest-leverage single test given the time
  budget, per the TRD's own note that this is "the natural seam for the
  required unit test"). An integration test hitting
  `PATCH /api/documents/:id` as a non-owner and asserting a 403 would be
  the next test I'd add.
- **Data-fetching robustness.** List/detail views use plain
  `useEffect` + `fetch`, not a caching library — fine at this scale, but
  it means no request deduplication, retry, or stale-while-revalidate
  behavior. Noted as a "next time" item in `ARCHITECTURE.md`.

## Next steps if this became a real product

1. Real auth (replace the mocked user switcher with actual sessions).
2. Edit access tiers for shared users (currently view-only by design).
3. Version history — the data model already timestamps every update;
   the missing piece is persisting prior revisions instead of
   overwriting `content` in place.
4. `.docx` import via a real parser instead of the intentionally-naive
   `.txt`/`.md` converter.
