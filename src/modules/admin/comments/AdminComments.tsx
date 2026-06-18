"use client";
import React, { useState, useEffect, useCallback } from "react";
import Pagination from "@/components/AdminPagination";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Clock,
  User,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { showAlert, showConfirm } from "@/utils/alert";

interface IComment {
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

interface IStats {
  totalCount: number;
  approvedCount: number;
  pendingCount: number;
}

export default function AdminComments() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [stats, setStats] = useState<IStats>({
    totalCount: 0,
    approvedCount: 0,
    pendingCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterApproved, setFilterApproved] = useState<string>("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  
  const [editingComment, setEditingComment] = useState<IComment | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/admin/comment?page=${currentPage}&limit=10`;
      if (filterApproved !== "all") {
        url += `&isApproved=${filterApproved}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت لیست دیدگاه‌ها");
      const data = await res.json();
      setComments(data.comments || []);
      setTotalPages(data.totalPages || 1);
      setTotalComments(data.total || 0);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "دریافت اطلاعات با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filterApproved, searchQuery]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  
  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchComments();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    const confirm = await showConfirm({
      title: nextStatus ? "آیا از تایید این کامنت مطمئن هستید؟" : "آیا از عدم تایید این کامنت مطمئن هستید؟",
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
            text: nextStatus ? "دیدگاه با موفقیت تایید شد." : "تایید دیدگاه با موفقیت لغو شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          fetchComments();
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

  const handleEdit = (comment: IComment) => {
    setEditingComment(comment);
    setEditText(comment.text);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingComment || !editText.trim()) return;

    try {
      const res = await fetch("/api/admin/comment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingComment._id, text: editText }),
      });

      if (res.ok) {
        showAlert({
          title: "ذخیره شد",
          text: "متن دیدگاه با موفقیت ویرایش شد.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
        setShowEditModal(false);
        setEditingComment(null);
        fetchComments();
      } else {
        throw new Error("خطا در ذخیره متن دیدگاه");
      }
    } catch (err: any) {
      showAlert({
        title: "خطا",
        text: err.message || "خطایی رخ داد.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
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
          fetchComments();
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

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
              مدیریت دیدگاه‌ها
            </h1>
            <p className="text-white/60 text-sm">
              دیدگاه‌های کاربران را در اینجا مدیریت، ویرایش و تایید کنید.
            </p>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.totalCount)}
              </div>
              <div className="text-white/60 text-sm">کل دیدگاه‌ها</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.approvedCount)}
              </div>
              <div className="text-white/60 text-sm">تایید شده</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center animate-pulse">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.pendingCount)}
              </div>
              <div className="text-white/60 text-sm">در انتظار تایید</div>
            </div>
          </div>
        </div>

        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="جستجو بر اساس نام نویسنده یا متن دیدگاه..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterApproved}
                onChange={(e) => {
                  setFilterApproved(e.target.value);
                  setCurrentPage(1);
                }}
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
                            onClick={() => handleToggleApproval(comment._id, comment.isApproved)}
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
                            onClick={() => handleEdit(comment)}
                            className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors text-white/70 hover:text-white"
                            title="ویرایش متن"
                          >
                            <Edit2 className="w-4 h-4" />
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
      </div>

      
      {showEditModal && editingComment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full">
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                ویرایش دیدگاه
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingComment(null);
                }}
                className="text-white/60 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {editingComment.name ? editingComment.name.charAt(0) : "👤"}
                </div>
                <div>
                  <div className="text-white font-medium">{editingComment.name}</div>
                  <div className="text-white/60 text-xs ss02">
                    {new Date(editingComment.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-white mb-2 text-sm">متن دیدگاه</label>
                <textarea
                  rows={6}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none leading-relaxed"
                  placeholder="متن دیدگاه را وارد کنید..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium"
              >
                ذخیره تغییرات
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingComment(null);
                }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
