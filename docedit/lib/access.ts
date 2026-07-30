import type { AccessCheckable } from "@/types";

/**
 * Can this user view the document (read-only is enough)?
 * True for the owner and anyone in sharedWith.
 */
export function canView(doc: AccessCheckable, userId: string): boolean {
  if (!userId) return false;
  return doc.ownerId === userId || doc.sharedWith.includes(userId);
}

/**
 * Can this user edit/rename/delete/share the document?
 * Owner only. This is intentionally the ONLY rule in the whole product
 * that decides write access — used by every mutating API route so there
 * is one rule, not several that can drift out of sync (see TRD section 9).
 */
export function canEdit(doc: AccessCheckable, userId: string): boolean {
  if (!userId) return false;
  return doc.ownerId === userId;
}
