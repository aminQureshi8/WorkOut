import mongoose, { Schema, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  status: "published" | "draft" | "scheduled";
  publishDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  authorId: mongoose.Types.ObjectId;
  views: number;
  viewedUsers?: mongoose.Types.ObjectId[];
  likes?: number;
  likedUsers?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

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
