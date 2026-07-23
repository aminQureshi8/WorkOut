import mongoose, { Document } from "mongoose";

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

export interface IBlog extends Omit<Blog, "_id" | "authorId" | "viewedUsers" | "likedUsers" | "publishDate" | "createdAt" | "updatedAt">, Document {
  authorId: mongoose.Types.ObjectId;
  viewedUsers?: mongoose.Types.ObjectId[];
  likedUsers?: mongoose.Types.ObjectId[];
  publishDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  category: string;
  status: "published" | "draft" | "scheduled";
  publishDate?: string | null;
  authorId?: {
    _id: string;
    username: string;
    fullName?: string;
  } | null;
  views: number;
  createdAt: string;
}

export interface AdminBlogStats {
  totalViews: number;
  publishedCount: number;
  draftCount: number;
}

export interface ArticleStatsProps {
  stats: AdminBlogStats;
  totalCount: number;
  formatNumber: (num: number) => string;
}

export interface ArticleListProps {
  articles: AdminBlog[];
  total: number;
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedArticles: string[];
  handleSelectAll: () => void;
  handleSelectArticle: (id: string) => void;
  handleDeleteArticle: (id: string) => void;
  handleBulkDelete: () => void;
  formatNumber: (num: number) => string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export interface ArticleDetailAuthor {
  _id: string;
  username: string;
  fullName?: string;
  role?: string;
}

export interface ArticleDetailData extends Omit<Blog, "authorId"> {
  authorId?: ArticleDetailAuthor | null;
}

export interface ArticleCurrentUser {
  id: string;
  username: string;
  fullName?: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface ArticleDetailProps {
  article: ArticleDetailData;
  relatedArticles?: ArticleDetailData[];
  userId?: string | null;
  currentUser?: ArticleCurrentUser | null;
  isWished?: boolean;
  isLiked?: boolean;
}

export interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}
