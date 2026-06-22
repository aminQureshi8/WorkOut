import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Comment {
  _id: string;
  blogId: string;
  userId?: string | null;
  name: string;
  avatar?: string;
  text: string;
  likes: number;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IComment extends Omit<Comment, "_id" | "blogId" | "userId" | "createdAt" | "updatedAt">, Document {
  blogId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
