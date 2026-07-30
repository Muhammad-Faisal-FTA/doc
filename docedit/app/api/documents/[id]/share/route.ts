import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import DocumentModel from "@/models/Document";
import { toDocumentDTO } from "@/lib/db-helpers";
import { canEdit } from "@/lib/access";
import { getUserIdFromHeaders } from "@/lib/current-user";
import { isValidUserId } from "@/lib/users";
import { jsonError, withErrorHandling } from "@/lib/api-response";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/documents/:id/share  { targetUserId: "user-bob" }
// Owner only (FR-8). Adding the owner themself or a duplicate is a no-op.
export async function POST(req: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid document id.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    let body: { targetUserId?: unknown };
    try {
      body = await req.json();
    } catch {
      return jsonError("Request body must be valid JSON.", 400);
    }

    const targetUserId = body.targetUserId;
    if (typeof targetUserId !== "string" || !isValidUserId(targetUserId)) {
      return jsonError("targetUserId must be a valid seeded user id.", 400);
    }

    await connectToDatabase();
    const doc = await DocumentModel.findById(id).lean();
    if (!doc) {
      return jsonError("Document not found.", 404);
    }
    if (!canEdit(doc, userId)) {
      return jsonError("Only the owner can share this document.", 403);
    }
    if (targetUserId === doc.ownerId) {
      return jsonError("Document is already owned by that user.", 400);
    }

    const updated = await DocumentModel.findByIdAndUpdate(
      id,
      { $addToSet: { sharedWith: targetUserId } },
      { new: true }
    ).lean();

    return NextResponse.json({ document: toDocumentDTO(updated!) });
  });
}
