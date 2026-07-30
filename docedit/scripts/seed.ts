/**
 * Optional manual seeding: `npm run seed`.
 * Not required for local dev — the app auto-seeds users lazily on the
 * first call to GET /api/users (see lib/db-helpers.ts) — but useful for
 * CI or inspecting the DB directly before starting the server.
 */
import "dotenv/config";
import { connectToDatabase } from "../lib/mongodb";
import UserModel from "../models/User";
import { SEEDED_USERS } from "../lib/users";

async function main() {
  await connectToDatabase();
  for (const u of SEEDED_USERS) {
    await UserModel.updateOne({ _id: u.id }, { $set: { name: u.name } }, { upsert: true });
    console.log(`Seeded ${u.name} (${u.id})`);
  }
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
