"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { showAlert, showConfirm } from "@/utils/alert";
import { AdminBlog, AdminBlogStats } from "@/types/blog";
import ArticleStats from "./ArticleStats";
import ArticleList from "./ArticleList";

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fa-IR").format(num);
};

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

export default function AdminArticles() {
  const [articles, setArticles] = useState<AdminBlog[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminBlogStats>({
    totalViews: 0,
    publishedCount: 0,
    draftCount: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [selectedStatus, setSelectedStatus] = useState("همه");
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const engStatus = mapStatusToEnglish(selectedStatus);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: debouncedSearchTerm,
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
      showAlert({
        title: "خطا",
        text: "بارگذاری اطلاعات مقالات با خطا مواجه شد.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedCategory, selectedStatus, debouncedSearchTerm]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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
    const confirm = await showConfirm({
      title: "آیا مطمئن هستید؟",
      text: "این عمل غیرقابل بازگشت است و مقاله حذف خواهد شد.",
      icon: "warning",
      confirmButtonText: "بله، حذف شود",
    });

    if (confirm) {
      try {
        const res = await fetch(`/api/admin/blog?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          showAlert({
            title: "حذف شد",
            text: "مقاله با موفقیت حذف شد.",
            icon: "success",
            confirmButtonColor: "#7c3aed",
          });
          fetchArticles();
        } else {
          throw new Error();
        }
      } catch (e) {
        showAlert({
          title: "خطا",
          text: "حذف مقاله با خطا مواجه شد.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.length === 0) return;

    const confirm = await showConfirm({
      title: "آیا مطمئن هستید؟",
      text: `آیا مایلید ${formatNumber(selectedArticles.length)} مقاله انتخاب شده را حذف کنید؟ این عمل غیرقابل بازگشت است.`,
      icon: "warning",
      confirmButtonText: "بله، حذف شوند",
    });

    if (confirm) {
      try {
        setLoading(true);
        await Promise.all(
          selectedArticles.map((id) =>
            fetch(`/api/admin/blog?id=${id}`, { method: "DELETE" })
          )
        );

        showAlert({
          title: "حذف شد",
          text: "مقالات با موفقیت حذف شدند.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
        setSelectedArticles([]);
        fetchArticles();
      } catch (e) {
        console.error(e);
        showAlert({
          title: "خطا",
          text: "برخی مقالات با خطا مواجه شدند.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 md:p-8" dir="rtl">
      <div className="container mx-auto pt-8">
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

        <ArticleStats
          stats={stats}
          totalCount={total}
          formatNumber={formatNumber}
        />

        <ArticleList
          articles={articles}
          total={total}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedArticles={selectedArticles}
          handleSelectAll={handleSelectAll}
          handleSelectArticle={handleSelectArticle}
          handleDeleteArticle={handleDeleteArticle}
          handleBulkDelete={handleBulkDelete}
          formatNumber={formatNumber}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
