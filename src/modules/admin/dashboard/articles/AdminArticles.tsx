"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";
import Pagination from "@/components/AdminPagination";

const categories = [
  "همه",
  "بدنسازی",
  "تغذیه",
  "کاهش وزن",
  "سلامت",
  "مکمل",
  "تکنیک",
];
const statuses = ["همه", "منتشر شده", "پیش‌نویس", "زمان‌بندی شده"];

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 0,
    publishedCount: 0,
    draftCount: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedStatus, setSelectedStatus] = useState("همه");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, selectedStatus]);

  // Debounced search fetch
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchArticles();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const mapStatusToEnglish = (status: string) => {
    switch (status) {
      case "منتشر شده":
        return "published";
      case "پیش‌نویس":
        return "draft";
      case "زمان‌بندی شده":
        return "scheduled";
      default:
        return "all";
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const engStatus = mapStatusToEnglish(selectedStatus);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchTerm,
        category: selectedCategory,
        status: engStatus,
      });

      const res = await fetch(`/api/admin/blog?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();

      setArticles(data.blogs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "خطا",
        text: "بارگذاری اطلاعات مقالات با خطا مواجه شد.",
        icon: "error",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedArticles.length === articles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(articles.map((a) => a._id));
    }
  };

  const handleSelectArticle = (id: string) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter((aid) => aid !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    const confirm = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این عمل غیرقابل بازگشت است و مقاله حذف خواهد شد.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
      background: "#111827",
      color: "#ffffff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/admin/blog?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          Swal.fire({
            title: "حذف شد",
            text: "مقاله با موفقیت حذف شد.",
            icon: "success",
            confirmButtonText: "باشه",
            background: "#111827",
            color: "#ffffff",
            confirmButtonColor: "#7c3aed",
          });
          fetchArticles();
        } else {
          throw new Error();
        }
      } catch (e) {
        Swal.fire({
          title: "خطا",
          text: "حذف مقاله با خطا مواجه شد.",
          icon: "error",
          confirmButtonText: "باشه",
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;

    const confirm = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: `آیا مایلید ${formatNumber(selectedArticles.length)} مقاله انتخاب شده را حذف کنید؟ این عمل غیرقابل بازگشت است.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شوند",
      cancelButtonText: "انصراف",
      background: "#111827",
      color: "#ffffff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await Promise.all(
          selectedArticles.map((id) =>
            fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" })
          )
        );

        Swal.fire({
          title: "حذف شد",
          text: "مقالات با موفقیت حذف شدند.",
          icon: "success",
          confirmButtonText: "باشه",
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#7c3aed",
        });
        setSelectedArticles([]);
        fetchArticles();
      } catch (e) {
        console.error(e);
        Swal.fire({
          title: "خطا",
          text: "برخی مقالات با خطا مواجه شدند.",
          icon: "error",
          confirmButtonText: "باشه",
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#7c3aed",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-500/20 text-green-400 border-green-500/30",
      draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    };
    const labels = {
      published: "منتشر شده",
      draft: "پیش‌نویس",
      scheduled: "زمان‌بندی شده",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full border text-xs ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels] || "پیش‌نویس"}
      </span>
    );
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1
              className="text-3xl mb-2 text-white font-bold"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              مدیریت مقالات
            </h1>
            <p className="text-white/60">مشاهده و ویرایش تمام مقالات سایت</p>
          </div>
          <Link
            href="/admin/articles/createArticles"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer font-semibold"
          >
            <Plus className="w-5 h-5" />
            ایجاد مقاله جدید
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">کل مقالات</div>
              <Tag className="w-5 h-5 text-blue-400" />
            </div>
            <div
              className="text-3xl text-white font-bold"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(total)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">منتشر شده</div>
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div
              className="text-3xl text-white font-bold"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(stats.publishedCount)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">پیش‌نویس</div>
              <Edit className="w-5 h-5 text-gray-400" />
            </div>
            <div
              className="text-3xl text-white font-bold"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(stats.draftCount)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">کل بازدیدها</div>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div
              className="text-3xl text-white font-bold"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(stats.totalViews)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="جستجوی مقاله..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status} className="bg-gray-800">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedArticles.length > 0 && (
          <div className="bg-orange-500/20 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="text-white font-medium">
              <span className="font-bold">
                {formatNumber(selectedArticles.length)}
              </span>{" "}
              مقاله انتخاب شده
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
            </div>
          </div>
        )}

        {/* Articles Table */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center text-white/60 gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <span>در حال دریافت مقالات...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center text-white/40 gap-2">
              <Tag className="w-12 h-12 text-white/20 mb-2" />
              <span>هیچ مقاله‌ای یافت نشد.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right p-4 w-12">
                      <input
                        type="checkbox"
                        checked={
                          articles.length > 0 &&
                          selectedArticles.length === articles.length
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                      />
                    </th>
                    <th className="text-right p-4 text-white/60">مقاله</th>
                    <th className="text-right p-4 text-white/60">نویسنده</th>
                    <th className="text-right p-4 text-white/60">دسته‌بندی</th>
                    <th className="text-right p-4 text-white/60">بازدید</th>
                    <th className="text-right p-4 text-white/60">تاریخ انتشار</th>
                    <th className="text-right p-4 text-white/60">وضعیت</th>
                    <th className="text-right p-4 text-white/60">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedArticles.includes(article._id)}
                          onChange={() => handleSelectArticle(article._id)}
                          className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                            {article.image ? (
                              <Image
                                src={article.image}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                <Tag className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="max-w-xs md:max-w-sm">
                            <div className="text-white font-medium line-clamp-2 leading-relaxed">
                              {article.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <User className="w-4 h-4 text-white/40" />
                          {article.authorId?.fullName ||
                            article.authorId?.username ||
                            "مدیر سایت"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-xs">
                          {article.category}
                        </span>
                      </td>
                      <td className="p-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-white/40" />
                          {formatNumber(article.views || 0)}
                        </div>
                      </td>
                      <td className="p-4 text-white/80">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-white/40" />
                          {article.publishDate
                            ? new Date(article.publishDate).toLocaleDateString(
                                "fa-IR"
                              )
                            : new Date(article.createdAt).toLocaleDateString(
                                "fa-IR"
                              )}
                        </div>
                      </td>
                      <td className="p-4">{getStatusBadge(article.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/10 rounded-lg cursor-pointer">
                            <Eye className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/admin/articles/editArticles/${article._id}`}
                            className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-green-500/10 rounded-lg cursor-pointer block"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteArticle(article._id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && articles.length > 0 && (
            <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-white/60 text-sm">
                نمایش {(currentPage - 1) * 10 + 1} تا{" "}
                {Math.min(currentPage * 10, total)} از {formatNumber(total)}{" "}
                مقاله
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
