"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Pagination from "@/components/AdminPagination";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Clock,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { showAlert, showConfirm } from "@/utils/alert";
import { formatNumber } from "@/utils/numbers";
import CommentStats from "./CommentStats";
import ViewCommentModal from "./ViewCommentModal";
import type { AdminComment, AdminCommentStats, AdminCommentsResponse } from "@/types/comment";

const fetcher = async (url: string): Promise<AdminCommentsResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("خطا در دریافت لیست دیدگاه‌ها");
  return res.json();
};

export default function CommentList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterApproved, setFilterApproved] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingComment, setViewingComment] = useState<AdminComment | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  let url = `/api/admin/comment?page=${currentPage}`;
  if (filterApproved !== "all") {
    url += `&isApproved=${filterApproved}`;
  }
  if (debouncedSearchQuery.trim()) {
    url += `&search=${encodeURIComponent(debouncedSearchQuery.trim())}`;
  }

  const { data, error: swrError, isLoading, mutate } = useSWR(url, fetcher);

  const comments = data?.comments || [];
  const totalPages = data?.totalPages || 1;
  const totalComments = data?.total || 0;
  const stats: AdminCommentStats = data?.stats || {
    totalCount: 0,
    approvedCount: 0,
    pendingCount: 0,
  };
  const error = swrError ? (swrError.message || "دریافت اطلاعات با خطا مواجه شد") : null;

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const confirm = await showConfirm({
      title: nextStatus
        ? "آیا از تایید این کامنت مطمئن هستید؟"
        : "آیا از عدم تایید این کامنت مطمئن هستید؟",
      text: nextStatus
        ? "پس از تایید، این کامنت در سایت برای عموم نمایش داده خواهد شد."
        : "پس از عدم تایید، این کامنت از سایت مخفی خواهد شد.",
      icon: "question",
      confirmButtonText: nextStatus ? "بله، تایید شود" : "بله، لغو تایید شود",
      confirmButtonColor: nextStatus ? "#10b981" : "#eab308",
    });

    if (confirm) {
      try {
        const res = await fetch("/api/admin/comment", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isApproved: nextStatus }),
        });

        if (res.ok) {
          showAlert({
            title: nextStatus ? "تایید شد" : "لغو تایید شد",
            text: nextStatus
              ? "دیدگاه با موفقیت تایید شد."
              : "تایید دیدگاه با موفقیت لغو شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          mutate();
        } else {
          throw new Error("خطا در بروزرسانی وضعیت");
        }
      } catch (err: any) {
        showAlert({
          title: "خطا",
          text: err.message || "بروزرسانی با خطا مواجه شد.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  const handleView = (comment: AdminComment) => {
    setViewingComment(comment);
    setShowViewModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirm = await showConfirm({
      title: "آیا مطمئن هستید؟",
      text: "این عمل غیرقابل بازگشت است و کامنت حذف خواهد شد.",
      icon: "warning",
      confirmButtonText: "بله، حذف شود",
    });

    if (confirm) {
      try {
        const res = await fetch(`/api/admin/comment?id=${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          showAlert({
            title: "حذف شد",
            text: "دیدگاه با موفقیت حذف شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          mutate();
        } else {
          throw new Error("خطا در حذف دیدگاه");
        }
      } catch (err: any) {
        showAlert({
          title: "خطا",
          text: err.message || "حذف با خطا مواجه شد.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return "bg-green-500/20 text-green-400 border-green-500/50";
    }
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
  };

  return (
    <>
      <CommentStats stats={stats} formatNumber={formatNumber} />

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

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  نویسنده
                </th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  دیدگاه
                </th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  مطلب مربوطه
                </th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  وضعیت
                </th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  تاریخ ثبت
                </th>
                <th className="p-4 text-right text-white/80 text-sm font-medium">
                  عملیات
                </th>
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
                  <tr
                    key={comment._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-white text-lg">
                          {comment.avatar ||
                            (comment.name ? comment.name.charAt(0) : "👤")}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {comment.name || "کاربر ناشناس"}
                          </div>
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
                          <span className="line-clamp-1">
                            {comment.blogId.title}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-white/40">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusBadge(comment.isApproved)}`}
                      >
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
                          onClick={() =>
                            handleToggleApproval(comment._id, comment.isApproved)
                          }
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            comment.isApproved
                              ? "bg-white/5 hover:bg-yellow-500/20 text-yellow-400"
                              : "bg-white/5 hover:bg-green-500/20 text-green-400"
                          }`}
                          title={
                            comment.isApproved ? "لغو تایید" : "تایید کامنت"
                          }
                        >
                          {comment.isApproved ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleView(comment)}
                          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white"
                          title="مشاهده دیدگاه"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment._id)}
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

      <ViewCommentModal
        isOpen={showViewModal}
        comment={viewingComment}
        onClose={() => {
          setShowViewModal(false);
          setViewingComment(null);
        }}
      />
    </>
  );
}
