"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, CheckCircle2, Clock3 } from "lucide-react";
import type { AdminComment, RecentCommentsProps } from "@/types/comment";

export default function RecentComments({ limit = 3 }: RecentCommentsProps) {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getRecentComments() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/admin/comment?limit=${limit}`);
        if (!res.ok) {
          throw new Error("خطا در دریافت دیدگاه‌ها");
        }
        const data = await res.json();
        const list = data.comments || [];
        setComments(list.slice(0, limit));
      } catch (err: any) {
        setError(err.message || "خطایی رخ داد");
      } finally {
        setIsLoading(false);
      }
    }

    getRecentComments();
  }, [limit]);

  return (
    <div className="min-w-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-white font-morabbaReg">
            کامنت‌های جدید
          </h2>
          <Link
            href="/admin/comments"
            className="text-orange-500 hover:text-orange-400 text-sm"
          >
            مشاهده همه
          </Link>
        </div>
      </div>
      <div className="p-3 sm:p-6">
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-3 sm:p-4 bg-white/5 rounded-lg animate-pulse h-20"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-rose-400 text-sm">{error}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-6 text-white/40 text-sm">
            دیدگاهی یافت نشد
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {comments.slice(0, limit).map((comment) => {
              const authorName =
                comment.userId?.fullName ||
                comment.name ||
                comment.userId?.username ||
                "کاربر";
              const dateStr = comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("fa-IR", {
                    day: "numeric",
                    month: "long",
                  })
                : "";

              return (
                <div
                  key={comment._id}
                  className="p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white font-medium text-sm truncate">
                      {authorName}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                        comment.isApproved
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {comment.isApproved ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          تایید شده
                        </>
                      ) : (
                        <>
                          <Clock3 className="w-3 h-3" />
                          در انتظار تایید
                        </>
                      )}
                    </span>
                  </div>
                  {comment.blogId?.title && (
                    <div className="text-orange-400/80 text-xs mb-1 truncate">
                      مقاله: {comment.blogId.title}
                    </div>
                  )}
                  <div className="text-white/70 text-xs sm:text-sm mb-2 line-clamp-2">
                    {comment.text}
                  </div>
                  {dateStr && (
                    <div className="flex items-center text-white/40 text-xs">
                      <Clock className="w-3 h-3 ml-1" />
                      {dateStr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
