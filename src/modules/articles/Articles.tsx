"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, Clock, BookOpen, Loader2, Inbox } from "lucide-react";

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("همه");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = [
    "همه",
    "بدنسازی",
    "تغذیه",
    "کاهش وزن",
    "سلامت",
    "مکمل",
    "تکنیک",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          status: "published",
          page: String(page),
          limit: "9",
        });
        if (category && category !== "همه") {
          queryParams.append("category", category);
        }
        if (debouncedSearch) {
          queryParams.append("search", debouncedSearch);
        }

        const res = await fetch(`/api/admin/blog?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (page === 1) {
            setArticles(data.blogs || []);
          } else {
            setArticles((prev) => [...prev, ...(data.blogs || [])]);
          }
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [category, debouncedSearch, page]);

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const words = content ? content.replace(/<[^>]+>/g, "").split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return new Intl.NumberFormat("fa-IR").format(minutes) + " دقیقه";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      dir="rtl"
    >
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center" style={{ fontFamily: "Marbeh, sans-serif" }}>
            مقالات آموزشی
          </h1>
          <p className="text-xl text-white/70 text-center max-w-2xl mx-auto mb-12">
            دانش خود را در زمینه بدنسازی و تناسب اندام افزایش دهید
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در مقالات..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-full transition-colors cursor-pointer ${
                  cat === category
                    ? "bg-orange-500 text-white font-bold"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto">
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const authorName = article.authorId?.fullName || article.authorId?.username || "نویسنده فیت‌کوچ";
                return (
                  <Link href={`/article/${article.slug}`} key={article._id} className="block h-full">
                    <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 flex flex-col h-full cursor-pointer">
                      <div className="relative aspect-video bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center text-6xl overflow-hidden">
                        {article.image ? (
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="w-16 h-16 text-white/20" />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                          <span className="text-xs text-white/50 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {getReadTime(article.content)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
                          {article.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-6 line-clamp-3 flex-1">
                          {article.excerpt || article.content?.replace(/<[^>]+>/g, "").slice(0, 150) + "..."}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                          <div className="flex items-center gap-2 text-sm text-white/60">
                            <User className="w-4 h-4" />
                            <span>{authorName}</span>
                          </div>
                          <span className="text-xs text-white/50">
                            {formatDate(article.publishDate || article.createdAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 max-w-lg mx-auto">
                <Inbox className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white text-lg font-medium mb-1">هیچ مقاله‌ای یافت نشد</h3>
                <p className="text-white/40 text-sm">شاید با فیلترهای دیگر جستجو کنید.</p>
              </div>
            )
          )}

          {loading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          )}

         
          {!loading && page < totalPages && (
            <div className="text-center mt-12">
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg transition-colors cursor-pointer"
              >
                مشاهده مقالات بیشتر
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
