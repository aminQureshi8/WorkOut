import mongoose, { Document } from "mongoose";

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

export interface IComment extends Omit<Comment, "_id" | "blogId" | "userId" | "createdAt" | "updatedAt">, Document {
  blogId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface AdminCommentsResponse {
  comments: AdminComment[];
  total: number;
  totalPages: number;
  stats: AdminCommentStats;
}

export interface CommentStatsProps {
  stats: AdminCommentStats;
  formatNumber: (num: number) => string;
}

export interface ViewCommentModalProps {
  isOpen: boolean;
  comment: AdminComment | null;
  onClose: () => void;
}

export interface RecentCommentsProps {
  limit?: number;
}
