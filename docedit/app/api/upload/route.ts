import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DocumentModel from "@/models/Document";
import { toDocumentDTO } from "@/lib/db-helpers";
import { convertToEditorHtml } from "@/lib/import-text";
import { getUserIdFromHeaders } from "@/lib/current-user";
import { jsonError, withErrorHandling } from "@/lib/api-response";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB — generous for plain text/markdown

// POST /api/upload  (multipart/form-data, field name "file")
// Only .txt / .md are accepted (FR-6, FR-7). Becomes a new document
// owned by the requesting user.
export async function POST(req: NextRequest) {
  return withErrorHandling(async () => {
    const userId = getUserIdFromHeaders(req.headers);
    if (!userId) {
      return jsonError("A valid x-user-id header is required.", 401);
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return jsonError("Request must be multipart/form-data.", 400);
    }

    const file = formData.get("file");
    if (!(file instanceof File)) {
      return jsonError("A file is required (field name 'file').", 400);
    }

    const nameParts = file.name.split(".");
    const extension = nameParts.length > 1 ? nameParts.pop()!.toLowerCase() : "";
    if (extension !== "txt" && extension !== "md") {
      return jsonError("Only .txt and .md files are supported.", 400);
    }

    if (file.size === 0) {
      return jsonError("The uploaded file is empty.", 400);
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return jsonError("File is too large (2MB max).", 400);
    }

    const rawText = await file.text();
    const content = convertToEditorHtml(rawText, extension as "txt" | "md");
    const title = nameParts.join(".") || file.name;

    await connectToDatabase();
    const doc = await DocumentModel.create({
      title: title.slice(0, 200),
      content,
      ownerId: userId,
      sharedWith: [],
    });

    return NextResponse.json({ document: toDocumentDTO(doc.toObject()) }, { status: 201 });
  });
}
