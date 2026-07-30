import mongoose, { Schema, type InferSchemaType } from "mongoose";

const DocumentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, default: "Untitled document" },
    content: { type: String, default: "" }, // Tiptap HTML
    ownerId: { type: String, required: true, index: true },
    // Flat array, not a join collection: at this scale (few users, few
    // docs) a join table buys nothing but complexity, and it keeps every
    // read to a single document fetch (see TRD section 7.2 design decision).
    sharedWith: { type: [String], default: [] },
  },
  { timestamps: true }
);

DocumentSchema.index({ ownerId: 1 });
DocumentSchema.index({ sharedWith: 1 });

export type DocumentDoc = InferSchemaType<typeof DocumentSchema>;

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
