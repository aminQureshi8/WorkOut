import mongoose, { Schema } from "mongoose";
import { IComment } from "@/types/comment";

const CommentSchema = new Schema<IComment>(
  {
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    avatar: { type: String, default: "" },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
