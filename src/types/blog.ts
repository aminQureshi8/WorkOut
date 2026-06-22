import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  category: string;
  status: "published" | "draft" | "scheduled";
  publishDate?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  authorId: string;
  views: number;
  viewedUsers?: string[];
  likes?: number;
  likedUsers?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IBlog extends Omit<Blog, "_id" | "authorId" | "viewedUsers" | "likedUsers" | "publishDate" | "createdAt" | "updatedAt">, Document {
  authorId: mongoose.Types.ObjectId;
  viewedUsers?: mongoose.Types.ObjectId[];
  likedUsers?: mongoose.Types.ObjectId[];
  publishDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
