"use client";
import { useState } from "react";
import { BookOpen, Eye, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { showAlert } from "@/utils/alert";

interface FavoritesManagementProps {
  initialWishlist: {
    id: string;
    title: string;
    slug: string;
    image: string;
    category: string;
    views: number;
  }[];
}

export default function FavoritesManagement({
  initialWishlist = [],
}: FavoritesManagementProps) {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = async (blogId: string) => {
    try {
      const res = await fetch("/api/blog/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId }),
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.wished) {
          setWishlist((prev) => prev.filter((item) => item.id !== blogId));
          showAlert({
            title: "حذف شد",
            text: "این مقاله از لیست علاقه‌مندی‌های شما حذف شد.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } catch (err) {
      console.error(err);
      showAlert({
        title: "خطا",
        text: "عملیات با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        icon: "error",
        confirmButtonText: "باشه",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{ fontFamily: "Dana, Marbuta, sans-serif", direction: "rtl" }}
    >
      <main className="p-4 md:p-6 space-y-6">
        <div
          className="relative rounded-2xl p-6 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #4c1d95, #1e1b4b)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-purple-500 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-pink-500 blur-2xl"></div>
          </div>
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                علاقه‌مندی‌های من
              </h2>
              <p className="text-gray-400 text-sm">
                لیست مقالات علمی و ورزشی که نشانه‌گذاری کرده‌اید.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10"
            >
              <ArrowRight size={16} />
              بازگشت به داشبورد
            </Link>
          </div>
        </div>

        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((a) => (
                <div
                  key={a.id}
                  className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.07] hover:border-purple-500/40 transition-all group relative"
                >
                  {a.image ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video bg-white/5 rounded-lg flex items-center justify-center text-3xl mb-3">
                      📚
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                      {a.category}
                    </span>
                    <button
                      onClick={() => handleRemove(a.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      title="حذف از علاقه‌مندی‌ها"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <Link href={`/article/${a.slug}`} className="block">
                    <h3 className="text-white text-sm font-semibold group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed mb-3">
                      {a.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Eye size={12} />
                    <span>
                      {new Intl.NumberFormat("fa-IR").format(a.views)} بازدید
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/40 text-sm bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-white/20" />
              <p className="mb-3">لیست علاقه‌مندی‌های شما خالی است.</p>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 bg-gradient-to-r from-purple-600 to-pink-500"
              >
                مشاهده مقالات ورزشی
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
