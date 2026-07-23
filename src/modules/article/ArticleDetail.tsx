"use client";
import { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  ChevronLeft,
  Heart,
  Share2,
  Bookmark,
  Eye,
  MessageSquare,
  ThumbsUp,
  ArrowRight,
  Inbox,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { showAlert } from "@/utils/alert";
import type { ArticleDetailProps } from "@/types/blog";

export default function ArticleDetail({
  article,
  relatedArticles = [],
  userId = null,
  isWished = false,
  isLiked = false,
}: ArticleDetailProps) {
  const [liked, setLiked] = useState(isLiked);
  const [bookmarked, setBookmarked] = useState(isWished);
  const [likeCount, setLikeCount] = useState(article?.likedUsers?.length || 0);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState<Array<{
    name: string;
    text: string;
    avatar?: string;
    time?: string;
    createdAt?: string;
    likes?: number;
  }>>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [viewCount, setViewCount] = useState(article?.views || 0);

  useEffect(() => {
    if (!article?._id) return;
    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        const res = await fetch(
          `/api/blog/comment?blogId=${article._id}&page=${commentPage}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            const newComments = data.comments || [];
            if (commentPage === 1) {
              setCommentList(newComments);
              setTotalComments(data.totalCount || 0);
              setHasMoreComments(newComments.length < (data.totalCount || 0));
            } else {
              setCommentList((prev) => {
                const updated = [...prev, ...newComments];
                setTotalComments(data.totalCount || 0);
                setHasMoreComments(updated.length < (data.totalCount || 0));
                return updated;
              });
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingComments(false);
      }
    };
    fetchComments();
  }, [article?._id, commentPage]);

  useEffect(() => {
    if (!article?._id) return;
    const recordView = async () => {
      try {
        const res = await fetch("/api/blog/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blogId: article._id }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.incremented) {
            setViewCount(data.views);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    recordView();
  }, [article?._id]);

  const handleBookmark = async () => {
    if (!userId) {
      showAlert({
        title: "ورود به حساب کاربری",
        text: "برای افزودن به لیست علاقه‌مندی‌ها، ابتدا وارد حساب کاربری خود شوید.",
        icon: "warning",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    try {
      const res = await fetch("/api/blog/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: article._id }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookmarked(data.wished);
        showAlert({
          title: data.wished ? "افزوده شد" : "حذف شد",
          text: data.wished
            ? "این مقاله به لیست علاقه‌مندی‌های شما اضافه شد."
            : "این مقاله از لیست علاقه‌مندی‌های شما حذف شد.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!userId) {
      showAlert({
        title: "ورود به حساب کاربری",
        text: "برای پسندیدن مقالات، ابتدا وارد حساب کاربری خود شوید.",
        icon: "warning",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    try {
      const res = await fetch("/api/blog/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogId: article._id }),
      });

      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likes);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    if (!userId) {
      showAlert({
        title: "ورود به حساب کاربری",
        text: "برای ثبت نظر، ابتدا وارد حساب کاربری خود شوید.",
        icon: "warning",
        confirmButtonColor: "#7c3aed",
      });
      return;
    }

    try {
      const res = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogId: article._id,
          text: newComment.trim(),
        }),
      });

      if (res.ok) {
        setNewComment("");
        showAlert({
          title: "ثبت شد",
          text: "نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده خواهد شد.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
      } else {
        throw new Error("ثبت نظر ناموفق بود");
      }
    } catch (err) {
      console.error(err);
      showAlert({
        title: "خطا",
        text: "ثبت نظر با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const words = content
      ? content
          .replace(/<[^>]+>/g, "")
          .split(/\s+/)
          .filter(Boolean).length
      : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return new Intl.NumberFormat("fa-IR").format(minutes) + " دقیقه";
  };

  if (!article) {
    return (
      <div
        className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white"
        dir="rtl"
      >
        <Inbox className="w-16 h-16 text-white/20 mb-4" />
        <p className="text-white/60 mb-4">مقاله‌ای یافت نشد.</p>
        <Link
          href="/articles"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
        >
          بازگشت به لیست مقالات
        </Link>
      </div>
    );
  }

  const authorName =
    article.authorId?.fullName ||
    article.authorId?.username ||
    "نویسنده فیت‌کوچ";
  const authorRole =
    article.authorId?.role === "admin"
      ? "مدیر سیستم"
      : article.authorId?.role === "coach"
        ? "مربی مجرب"
        : "نویسنده";
  const authorAvatar = authorName.charAt(0);

  return (
    <div className="min-h-screen bg-gray-950 text-white font-danaMed">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            خانه
          </Link>
          <ChevronLeft size={14} />
          <Link
            href="/articles"
            className="hover:text-gray-300 transition-colors"
          >
            مقالات
          </Link>
          <ChevronLeft size={14} />
          <span className="text-gray-300 line-clamp-1">{article.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl overflow-hidden mb-8 border border-white/10"
              style={{
                background:
                  "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.15))",
              }}
            >
              <div className="relative aspect-video flex items-center justify-center text-8xl">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <BookOpen className="w-24 h-24 text-white/20" />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(249,115,22,0.2)", color: "#fb923c" }}
              >
                {article.category}
              </span>
              {article.tags &&
                article.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full text-gray-400"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            <h1
              className="text-3xl font-bold text-white mb-5 leading-relaxed"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {article.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-8 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                  }}
                >
                  {authorAvatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{authorName}</p>
                  <p className="text-gray-500 text-xs">{authorRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={13} />{" "}
                  {formatDate(article.publishDate || article.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {getReadTime(article.content)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {viewCount} بازدید
                </span>
              </div>
            </div>

            <article className="mb-10 text-gray-300 leading-8 text-base space-y-4">
              <div
                className="ck-content-view"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </article>

            <div className="flex items-center justify-between p-4 rounded-2xl mb-10 bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  className={`flex items-center ss02 gap-2 px-4 py-2 rounded-xl text-sm transition-all cursor-pointer ${liked ? "text-red-400" : "text-gray-400 hover:text-white"}`}
                  style={{
                    background: liked
                      ? "rgba(239,68,68,0.15)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                  {likeCount}
                </button>
                <button
                  className="flex ss02 items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-all cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <MessageSquare size={16} />
                  {totalComments}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${bookmarked ? "text-yellow-400" : "text-gray-400 hover:text-white"}`}
                  style={{
                    background: bookmarked
                      ? "rgba(234,179,8,0.15)"
                      : "rgba(255,255,255,0.05)",
                  }}
                >
                  <Bookmark
                    size={16}
                    fill={bookmarked ? "currentColor" : "none"}
                  />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: article.title,
                          url: window.location.href,
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      showAlert({
                        title: "کپی شد",
                        text: "لینک مقاله در حافظه موقت کپی شد.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                      });
                    }
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer bg-white/5 animate-none"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            <div>
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                نظرات ({totalComments})
              </h3>

              <div className="rounded-2xl p-5 mb-6 bg-white/5 border border-white/10">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="نظر خود را بنویسید..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleSendComment}
                    className="px-5 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #ef4444)",
                    }}
                  >
                    ارسال نظر
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {isLoadingComments && commentList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <span className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mb-2"></span>
                    <p className="text-white/40 text-sm">در حال بارگذاری نظرات...</p>
                  </div>
                ) : commentList.length > 0 ? (
                  commentList.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-5 bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #7c3aed, #ec4899)",
                          }}
                        >
                          {c.avatar || c.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white text-sm font-medium">
                              {c.name}
                            </span>
                            <span className="text-gray-600 text-xs">
                              {c.time || formatDate(c.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm leading-6">
                            {c.text}
                          </p>
                          <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-400 mt-3 transition-colors cursor-pointer">
                            <ThumbsUp size={12} /> {c.likes || 0} پسند
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white/40 text-center py-8 text-sm">هیچ نظری برای این مقاله ثبت نشده است.</p>
                )}
              </div>

              {hasMoreComments && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setCommentPage((prev) => prev + 1)}
                    disabled={isLoadingComments}
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                  >
                    {isLoadingComments ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        در حال بارگذاری...
                      </>
                    ) : (
                      "مشاهده بیشتر"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
              <h4 className="font-bold text-white mb-4 text-sm">
                درباره نویسنده
              </h4>
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                  }}
                >
                  {authorAvatar}
                </div>
                <p className="font-semibold text-white">{authorName}</p>
                <p className="text-gray-500 text-xs mt-1">{authorRole}</p>
                <p className="text-gray-400 text-xs mt-3 leading-5">
                  نویسنده و تحلیل‌گر تخصصی فیت‌کوچ، فعال در حوزه ارائه مقالات
                  علمی و کاربردی ورزش و سلامت
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-5 relative overflow-hidden bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30">
              <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full bg-orange-500/10 blur-xl"></div>
              <h4 className="font-bold text-white mb-2 text-sm">
                برنامه شخصی بگیر!
              </h4>
              <p className="text-gray-400 text-xs leading-5 mb-4">
                با مشاوره مربی اختصاصی، سریع‌تر به هدفت برس
              </p>
              <Link
                href="/packages"
                className="flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-white w-full transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #f97316, #ef4444)",
                }}
              >
                مشاهده پکیج‌ها
                <ArrowRight size={14} />
              </Link>
            </div>

            {relatedArticles.length > 0 && (
              <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-4 text-sm">
                  مقالات مرتبط
                </h4>
                <div className="space-y-3">
                  {relatedArticles.map((r) => (
                    <Link
                      key={r._id}
                      href={`/article/${r.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                    >
                      <div className="relative w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 bg-white/5 overflow-hidden">
                        {r.image ? (
                          <Image
                            src={r.image}
                            alt={r.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <BookOpen className="w-5 h-5 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium leading-5 group-hover:text-orange-400 transition-colors line-clamp-2">
                          {r.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-gray-600 text-xs">
                          <Clock size={10} /> {getReadTime(r.content)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {article.tags && article.tags.length > 0 && (
              <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
                <h4 className="font-bold text-white mb-4 text-sm">برچسب‌ها</h4>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 rounded-full text-gray-400 hover:text-white cursor-pointer transition-colors bg-white/5 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/articles"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowRight size={16} />
            بازگشت به مقالات
          </Link>
        </div>
      </div>
    </div>
  );
}
