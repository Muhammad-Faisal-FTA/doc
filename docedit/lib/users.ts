import type { SeededUser } from "@/types";

/**
 * No real auth (explicitly out of scope per TRD 2.2). These are the only
 * three identities that can ever exist in this app. IDs are stable strings
 * so they can be used directly as ownerId / sharedWith entries without a
 * lookup, and re-seeding is idempotent (upsert by _id).
 */
export const SEEDED_USERS: SeededUser[] = [
  { id: "user-alice", name: "Alice" },
  { id: "user-bob", name: "Bob" },
  { id: "user-carol", name: "Carol" },
];

export function isValidUserId(id: string | null | undefined): boolean {
  if (!id) return false;
  return SEEDED_USERS.some((u) => u.id === id);
}

export function getUserName(id: string): string {
  return SEEDED_USERS.find((u) => u.id === id)?.name ?? "Unknown user";
}
