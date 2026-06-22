"use client";
import React from "react";
import Pagination from "@/components/AdminPagination";
import {
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { AdminComment } from "@/types/comment";

interface CommentListProps {
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

export default function CommentList({
  comments,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  filterApproved,
  setFilterApproved,
  currentPage,
  setCurrentPage,
  totalPages,
  totalComments,
  onToggleApproval,
  onEdit,
  onDelete,
  formatNumber,
}: CommentListProps) {
  
  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return "bg-green-500/20 text-green-400 border-green-500/50";
    }
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  };

  return (
    <>
      {/* Search & Filter Bar */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام نویسنده یا متن دیدگاه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterApproved}
              onChange={(e) => setFilterApproved(e.target.value)}
              className="bg-white/5 *:bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="true">تایید شده</option>
              <option value="false">در انتظار تایید</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 text-right text-white/80 text-sm font-medium">نویسنده</th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">دیدگاه</th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">مطلب مربوطه</th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">وضعیت</th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">تاریخ ثبت</th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/50">
                    در حال بارگذاری دیدگاه‌ها...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-red-400">
                    {error}
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-white/50">
                      <MessageCircle className="w-12 h-12 opacity-30" />
                      <p className="text-lg">هیچ دیدگاهی یافت نشد</p>
                      {searchQuery && (
                        <p className="text-sm">
                          نتیجه‌ای برای جستجوی «{searchQuery}» یافت نشد
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-white text-lg">
                          {comment.avatar || (comment.name ? comment.name.charAt(0) : "👤")}
                        </div>
                        <div>
                          <div className="text-white font-medium">{comment.name || "کاربر ناشناس"}</div>
                          <div className="text-white/60 text-xs">
                            {comment.userId ? comment.userId.email : "مهمان"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs md:max-w-md">
                      <div className="text-white text-sm whitespace-pre-line line-clamp-3 leading-relaxed">
                        {comment.text}
                      </div>
                    </td>
                    <td className="p-4 text-white/80 text-sm">
                      {comment.blogId ? (
                        <a
                          href={`/article/${comment.blogId.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <span className="line-clamp-1">{comment.blogId.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusBadge(comment.isApproved)}`}>
                        {comment.isApproved ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            تایید شده
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            در انتظار تایید
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-white/70 text-sm ss02">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleApproval(comment._id, comment.isApproved)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            comment.isApproved
                              ? "bg-white/5 hover:bg-yellow-500/20 text-yellow-400"
                              : "bg-white/5 hover:bg-green-500/20 text-green-400"
                          }`}
                          title={comment.isApproved ? "لغو تایید" : "تایید کامنت"}
                        >
                          {comment.isApproved ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => onEdit(comment)}
                          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white"
                          title="ویرایش متن"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(comment._id)}
                          className="w-8 h-8 bg-white/5 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors text-red-400"
                          title="حذف دیدگاه"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white/60 text-sm">
            نمایش {(currentPage - 1) * 10 + 1} تا{" "}
            {Math.min(currentPage * 10, totalComments)} از{" "}
            {formatNumber(totalComments)} دیدگاه
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
}
