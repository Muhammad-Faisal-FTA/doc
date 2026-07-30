import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/models/User";
import { SEEDED_USERS, getUserName } from "@/lib/users";
import type { DocumentDTO } from "@/types";

let seeded = false;

/**
 * Idempotently upserts the 3 seeded users into MongoDB. Runs lazily on
 * first relevant API call rather than requiring a manual `npm run seed`
 * step, so a stranger cloning the repo has zero extra setup beyond
 * MONGODB_URI (README <5 min requirement, NFR-7). `npm run seed` still
 * exists for explicit/manual seeding (e.g. CI, scripts).
 */
export async function ensureUsersSeeded(): Promise<void> {
  if (seeded) return;
  await connectToDatabase();
  await Promise.all(
    SEEDED_USERS.map((u) =>
      UserModel.updateOne({ _id: u.id }, { $set: { name: u.name } }, { upsert: true })
    )
  );
  seeded = true;
}

// Minimal shape this serializer needs from a Mongoose lean() document.
type LeanDocument = {
  _id: unknown;
  title: string;
  content: string;
  ownerId: string;
  sharedWith: string[];
  createdAt: Date;
  updatedAt: Date;
};

export function toDocumentDTO(doc: LeanDocument): DocumentDTO {
  return {
    _id: String(doc._id),
    title: doc.title,
    content: doc.content,
    ownerId: doc.ownerId,
    ownerName: getUserName(doc.ownerId),
    sharedWith: doc.sharedWith,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}
