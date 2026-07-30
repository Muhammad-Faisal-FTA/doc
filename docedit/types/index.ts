export type SeededUser = {
  id: string;
  name: string;
};

// Shape returned to the client. `_id` is stringified (ObjectIds are not
// directly JSON-safe / comparable to plain strings on the client).
export type DocumentDTO = {
  _id: string;
  title: string;
  content: string;
  ownerId: string;
  ownerName: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
};

// Minimal shape the access-check utility needs. Kept separate from the
// Mongoose document type so lib/access.ts has zero DB dependency and is
// trivially unit-testable.
export type AccessCheckable = {
  ownerId: string;
  sharedWith: string[];
};
