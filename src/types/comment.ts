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

// CommentList Component Props Type
export interface CommentListProps {
  comments: AdminComment[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterApproved: string;
  setFilterApproved: (filter: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  totalComments: number;
  onToggleApproval: (id: string, currentStatus: boolean) => void;
  onEdit: (comment: AdminComment) => void;
  onDelete: (id: string) => void;
  formatNumber: (num: number) => string;
}
