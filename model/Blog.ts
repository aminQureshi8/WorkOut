import mongoose, { Schema } from "mongoose";
import { IBlog } from "@/types/blog";

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    excerpt: { type: String, default: "" },
    image: { type: String, default: "" },
    category: { type: String, required: true, default: "بدنسازی" },
    status: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "draft",
    },
    publishDate: { type: Date, default: null },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    tags: { type: [String], default: [] },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    views: { type: Number, default: 0 },
    viewedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    likes: { type: Number, default: 0 },
    likedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

BlogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blogId",
});

export default mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);
