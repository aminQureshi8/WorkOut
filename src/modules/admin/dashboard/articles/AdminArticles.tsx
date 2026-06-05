"use client";
import { useState } from "react";
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
} from "lucide-react";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  author: string;
  category: string;
  views: number;
  publishDate: string;
  status: "published" | "draft" | "scheduled";
  image: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "بهترین تمرینات برای افزایش حجم عضلات سینه",
    author: "علی احمدی",
    category: "بدنسازی",
    views: 3542,
    publishDate: "۱۴۰۳/۰۳/۰۱",
    status: "published",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
  },
  {
    id: 2,
    title: "رژیم غذایی مناسب برای کاهش وزن سریع",
    author: "سارا محمدی",
    category: "تغذیه",
    views: 5123,
    publishDate: "۱۴۰۳/۰۲/۲۸",
    status: "published",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
  },
  {
    id: 3,
    title: "راهنمای کامل مصرف مکمل‌های ورزشی",
    author: "رضا کریمی",
    category: "مکمل",
    views: 2891,
    publishDate: "۱۴۰۳/۰۲/۲۵",
    status: "draft",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
  },
  {
    id: 4,
    title: "تکنیک‌های حرفه‌ای برای اسکات با وزنه",
    author: "محمد رضایی",
    category: "تکنیک",
    views: 4231,
    publishDate: "۱۴۰۳/۰۲/۲۲",
    status: "published",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
  },
  {
    id: 5,
    title: "چگونه از آسیب‌های ورزشی جلوگیری کنیم؟",
    author: "دکتر حسینی",
    category: "سلامت",
    views: 1823,
    publishDate: "۱۴۰۳/۰۳/۰۵",
    status: "scheduled",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400",
  },
  {
    id: 6,
    title: "برنامه تمرینی ۸ هفته‌ای برای کاهش چربی",
    author: "علی احمدی",
    category: "کاهش وزن",
    views: 6891,
    publishDate: "۱۴۰۳/۰۲/۱۸",
    status: "published",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
  },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedStatus, setSelectedStatus] = useState("همه");
  const [selectedArticles, setSelectedArticles] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedArticles.length === mockArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(mockArticles.map((a) => a.id));
    }
  };

  const handleSelectArticle = (id: number) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter((aid) => aid !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
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
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const totalViews = mockArticles.reduce(
    (sum, article) => sum + article.views,
    0,
  );
  const publishedCount = mockArticles.filter(
    (a) => a.status === "published",
  ).length;
  const draftCount = mockArticles.filter((a) => a.status === "draft").length;

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1
              className="text-3xl mb-2 text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              مدیریت مقالات
            </h1>
            <p className="text-white/60">مشاهده و ویرایش تمام مقالات سایت</p>
          </div>
          <Link
            href="/admin/articles/createArticles"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
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
              className="text-3xl text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(mockArticles.length)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">منتشر شده</div>
              <Eye className="w-5 h-5 text-green-400" />
            </div>
            <div
              className="text-3xl text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(publishedCount)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">پیش‌نویس</div>
              <Edit className="w-5 h-5 text-gray-400" />
            </div>
            <div
              className="text-3xl text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(draftCount)}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">کل بازدیدها</div>
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <div
              className="text-3xl text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(totalViews)}
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
            <div className="text-white">
              <span className="font-bold">
                {formatNumber(selectedArticles.length)}
              </span>{" "}
              مقاله انتخاب شده
            </div>
            <div className="flex gap-2">
              <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                تغییر دسته‌بندی
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                تغییر وضعیت
              </button>
            </div>
          </div>
        )}

        {/* Articles Table */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-right p-4">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === mockArticles.length}
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
                {mockArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => handleSelectArticle(article.id)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          //   src={article.image}
                          alt={article.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="max-w-xs">
                          <div className="text-white line-clamp-2">
                            {article.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/80">
                        <User className="w-4 h-4 text-white/40" />
                        {article.author}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full text-sm">
                        {article.category}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-white/40" />
                        {formatNumber(article.views)}
                      </div>
                    </td>
                    <td className="p-4 text-white/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-white/40" />
                        {article.publishDate}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(article.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/10 rounded-lg">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="text-green-400 hover:text-green-300 transition-colors p-2 hover:bg-green-500/10 rounded-lg">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-white/60 text-sm">
              نمایش ۱ تا {formatNumber(mockArticles.length)} از{" "}
              {formatNumber(mockArticles.length)} مقاله
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors">
                قبلی
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                ۱
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors">
                ۲
              </button>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-colors">
                بعدی
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
