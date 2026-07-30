import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    _id: { type: String, required: true }, // e.g. "user-alice"
    name: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

export default mongoose.models.User || mongoose.model("User", UserSchema);
