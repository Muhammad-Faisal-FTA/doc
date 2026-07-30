import { isValidUserId } from "@/lib/users";

/**
 * There's no session/cookie auth (mocked user switcher only, per TRD
 * section 2.2 / section 3). The client sends the active user id on every request via
 * the `x-user-id` header (set once by lib/api-client.ts on the client).
 * This is NOT a security boundary by itself — the point of FR-12 is that
 * every mutating route still re-checks ownerId server-side against
 * whatever id shows up here, so a forged header can view as another user
 * but can never write as one it doesn't own the document for.
 */
export function getUserIdFromHeaders(headers: Headers): string | null {
  const id = headers.get("x-user-id");
  return isValidUserId(id) ? id : null;
}
