import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DocumentModel from "@/models/Document";
import { toDocumentDTO } from "@/lib/db-helpers";
import { isValidUserId } from "@/lib/users";
import { getUserIdFromHeaders } from "@/lib/current-user";
import { jsonError, withErrorHandling } from "@/lib/api-response";

// GET /api/documents?userId=user-alice
// Lists documents this user owns OR is in sharedWith. Matches TRD API
// table exactly: userId is a query param here (unlike the mutating
// routes, which read it from the x-user-id header).
export async function GET(req: NextRequest) {
  return withErrorHandling(async () => {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!isValidUserId(userId)) {
      return jsonError("A valid userId query param is required.", 400);
    }

    await connectToDatabase();
    const docs = await DocumentModel.find({
      $or: [{ ownerId: userId }, { sharedWith: userId }],
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ documents: docs.map(toDocumentDTO) });
  });
}

// POST /api/documents
// Creates a new blank document owned by the requesting user (FR-1).
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    let title = "Untitled document";
    try {
      const body = await req.json();
      if (typeof body?.title === "string" && body.title.trim()) {
        title = body.title.trim().slice(0, 200);
      }
    } catch {
      // No/empty body is fine — default title is used.
    }

    await connectToDatabase();
    const doc = await DocumentModel.create({
      title,
      content: "<p></p>",
      ownerId: userId,
      sharedWith: [],
    });

    return NextResponse.json({ document: toDocumentDTO(doc.toObject()) }, { status: 201 });
  });
}
