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

// Admin Dashboard Populated Types
export interface AdminComment {
  _id: string;
  name: string;
  avatar?: string;
  text: string;
  likes: number;
  isApproved: boolean;
  createdAt: string;
  blogId?: {
    _id: string;
    title: string;
    slug: string;
  };
  userId?: {
    _id: string;
    username: string;
    fullName: string;
    email: string;
  };
}

export interface AdminCommentStats {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
}
