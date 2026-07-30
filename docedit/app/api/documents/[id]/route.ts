import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import DocumentModel from "@/models/Document";
import { toDocumentDTO } from "@/lib/db-helpers";
import { canEdit, canView } from "@/lib/access";
import { getUserIdFromHeaders } from "@/lib/current-user";
import { jsonError, withErrorHandling } from "@/lib/api-response";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/documents/:id — owner or shared-with user only (FR-5, FR-9).
export async function GET(req: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid document id.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    await connectToDatabase();
    const doc = await DocumentModel.findById(id).lean();
    if (!doc) {
      return jsonError("Document not found.", 404);
    }

    if (!canView(doc, userId)) {
      return jsonError("You don't have access to this document.", 403);
    }

    return NextResponse.json({ document: toDocumentDTO(doc) });
  });
}

// PATCH /api/documents/:id — update title/content. Owner only,
// server-enforced (FR-12) via lib/access.ts's canEdit — the one rule the
// whole product hinges on (TRD section 8).
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid document id.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    let body: { title?: unknown; content?: unknown };
    try {
      body = await req.json();
    } catch {
      return jsonError("Request body must be valid JSON.", 400);
    }

    const update: Record<string, string> = {};
    if (body.title !== undefined) {
      if (typeof body.title !== "string" || !body.title.trim()) {
        return jsonError("title must be a non-empty string.", 400);
      }
      update.title = body.title.trim().slice(0, 200);
    }
    if (body.content !== undefined) {
      if (typeof body.content !== "string") {
        return jsonError("content must be a string.", 400);
      }
      update.content = body.content;
    }
    if (Object.keys(update).length === 0) {
      return jsonError("Nothing to update — provide title and/or content.", 400);
    }

    await connectToDatabase();
    const doc = await DocumentModel.findById(id).lean();
    if (!doc) {
      return jsonError("Document not found.", 404);
    }
    if (!canEdit(doc, userId)) {
      return jsonError("Only the owner can edit this document.", 403);
    }

    const updated = await DocumentModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    return NextResponse.json({ document: toDocumentDTO(updated!) });
  });
}

// DELETE /api/documents/:id — owner only.
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  return withErrorHandling(async () => {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return jsonError("Invalid document id.", 400);
    }

    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    await connectToDatabase();
    const doc = await DocumentModel.findById(id).lean();
    if (!doc) {
      return jsonError("Document not found.", 404);
    }
    if (!canEdit(doc, userId)) {
      return jsonError("Only the owner can delete this document.", 403);
    }

    await DocumentModel.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  });
}
