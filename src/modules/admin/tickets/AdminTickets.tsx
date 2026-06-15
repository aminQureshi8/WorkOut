"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Pagination from "@/components/AdminPagination";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Trash2,
  Send,
  Lock,
  Tag,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import Swal from "sweetalert2";

import {
  IClientUser as IUser,
  IClientMessage as IMessage,
  IClientTicket as ITicket,
  ITicketStats as IStats,
} from "@/types/ticket";

export default function AdminTickets() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [stats, setStats] = useState<IStats>({
    totalCount: 0,
    pendingCount: 0,
    answeredCount: 0,
    closedCount: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  const showAlert = (title: string, text: string, icon: "success" | "error" | "warning" | "info" = "info") => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "باشه",
      background: "#111827",
      color: "#ffffff",
      confirmButtonColor: "#7c3aed",
    });
  };

  const showConfirm = async (title: string, text: string, confirmButtonText = "بله، حذف شود") => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: "انصراف",
      background: "#111827",
      color: "#ffffff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
    });
    return result.isConfirmed;
  };

  const fetchTickets = useCallback(async (selectIdAfterFetch?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/admin/ticket?page=${currentPage}&limit=8`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      if (priorityFilter !== "all") {
        url += `&priority=${priorityFilter}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت لیست تیکت‌ها");
      const data = await res.json();
      setTickets(data.tickets || []);
      setTotalPages(data.totalPages || 1);
      setTotalTickets(data.total || 0);

      if (data.stats) {
        setStats(data.stats);
      }

      // If we need to refresh the currently open ticket detail
      if (selectIdAfterFetch) {
        const updated = data.tickets.find((t: ITicket) => t._id === selectIdAfterFetch);
        if (updated) setSelectedTicket(updated);
      } else if (selectedTicket) {
        // Just refresh the active one if it exists in the list
        const updated = data.tickets.find((t: ITicket) => t._id === selectedTicket._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err: any) {
      setError(err.message || "دریافت اطلاعات با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, priorityFilter, searchQuery, selectedTicket]);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, priorityFilter]);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchTickets();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTicket._id,
          messageText: replyText.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReplyText("");
        // Instantly update local chat view
        setSelectedTicket(data.ticket);
        fetchTickets(selectedTicket._id);
      } else {
        throw new Error("خطا در ارسال پاسخ");
      }
    } catch (err: any) {
      showAlert("خطا", err.message || "پاسخ ارسال نشد.", "error");
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseTicket = async (id: string) => {
    if (!(await showConfirm("بستن تیکت", "آیا از بستن این تیکت اطمینان دارید؟ در صورت نیاز بعدا می‌توانید دوباره آن را باز کنید.", "بله، بسته شود"))) return;

    try {
      const res = await fetch("/api/admin/ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "closed",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        showAlert("موفقیت", "تیکت با موفقیت بسته شد.", "success");
        fetchTickets(id);
      } else {
        throw new Error();
      }
    } catch (e) {
      showAlert("خطا", "عملیات با خطا مواجه شد", "error");
    }
  };

  const handleReopenTicket = async (id: string) => {
    try {
      const res = await fetch("/api/admin/ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "pending",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        showAlert("موفقیت", "تیکت با موفقیت بازگشایی شد.", "success");
        fetchTickets(id);
      } else {
        throw new Error();
      }
    } catch (e) {
      showAlert("خطا", "عملیات با خطا مواجه شد", "error");
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!(await showConfirm("حذف تیکت", "آیا از حذف این تیکت پشتیبانی اطمینان دارید؟ این عمل غیرقابل بازگشت است."))) return;

    try {
      const res = await fetch(`/api/admin/ticket?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSelectedTicket(null);
        showAlert("حذف شد", "تیکت با موفقیت حذف شد.", "success");
        fetchTickets();
      } else {
        throw new Error();
      }
    } catch (e) {
      showAlert("خطا", "حذف تیکت با خطا مواجه شد.", "error");
    }
  };

  const getStatusBadge = (status: ITicket["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "answered":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "closed":
        return "bg-white/10 text-white/50 border-white/20";
      default:
        return "bg-white/10 text-white/55 border-white/20";
    }
  };

  const getStatusLabel = (status: ITicket["status"]) => {
    switch (status) {
      case "pending":
        return "در انتظار پاسخ";
      case "answered":
        return "پاسخ داده شده";
      case "closed":
        return "بسته شده";
      default:
        return status;
    }
  };

  const getPriorityBadge = (priority: ITicket["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "low":
        return "bg-white/5 text-white/60 border-white/10";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const getPriorityLabel = (priority: ITicket["priority"]) => {
    switch (priority) {
      case "high":
        return "فوری";
      case "medium":
        return "متوسط";
      case "low":
        return "کم اهمیت";
      default:
        return priority;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-white/60 text-sm">
            تیکت‌های ارسالی کاربران را پاسخ داده و مشکلات فنی یا مالی آن‌ها را برطرف کنید.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.totalCount)}
              </div>
              <div className="text-white/60 text-xs">کل تیکت‌ها</div>
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
              <div className="text-white/60 text-xs">در انتظار پاسخ</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.answeredCount)}
              </div>
              <div className="text-white/60 text-xs">پاسخ داده شده</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white/40" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white ss02">
                {formatNumber(stats.closedCount)}
              </div>
              <div className="text-white/60 text-xs">بسته شده</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="جستجو در موضوع، متن تیکت یا نام کاربر..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 *:bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار پاسخ</option>
                <option value="answered">پاسخ داده شده</option>
                <option value="closed">بسته شده</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white/5 *:bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
              >
                <option value="all">همه اولویت‌ها</option>
                <option value="high">فوری</option>
                <option value="medium">متوسط</option>
                <option value="low">کم اهمیت</option>
              </select>
            </div>
          </div>
        </div>

        {/* Split Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* TICKETS LIST (5/12 Width) */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-white font-bold text-lg mb-2">لیست تیکت‌ها</h2>
            {isLoading && tickets.length === 0 ? (
              <div className="p-12 text-center text-white/50 bg-white/5 border border-white/10 rounded-xl">
                در حال بارگذاری تیکت‌ها...
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-400 bg-white/5 border border-white/10 rounded-xl">
                {error}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-12 text-center text-white/40 bg-white/5 border border-white/10 rounded-xl">
                <MessageCircle className="w-12 h-12 mx-auto opacity-20 mb-3" />
                تیکتی یافت نشد.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => {
                  const isSelected = selectedTicket?._id === t._id;
                  return (
                    <div
                      key={t._id}
                      onClick={() => {
                        setSelectedTicket(t);
                        setReplyText("");
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${
                        isSelected
                          ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/80 text-white shadow-lg shadow-orange-500/10"
                          : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-sm line-clamp-1">{t.subject}</div>
                        <span className={`px-2 py-0.5 rounded border text-[10px] ${getPriorityBadge(t.priority)}`}>
                          {getPriorityLabel(t.priority)}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                        {t.description}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-white/50 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                            {t.userId?.username?.charAt(0) || "👤"}
                          </div>
                          <span>{t.userId?.fullName || t.userId?.username || "کاربر ناشناس"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] ${getStatusBadge(t.status)}`}>
                            {getStatusLabel(t.status)}
                          </span>
                          <span className="ss02">{new Date(t.createdAt).toLocaleDateString("fa-IR")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {totalPages > 1 && (
                  <div className="pt-2 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-7">
            {!selectedTicket ? (
              <div className="h-[500px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 p-8 text-center bg-white/5">
                <MessageSquare className="w-16 h-16 mb-4 opacity-20 text-orange-500" />
                <h4 className="font-bold text-lg text-white mb-2">تیکتی انتخاب نشده است</h4>
                <p className="text-sm">برای مشاهده گفتگو و پاسخ به کاربر، یکی از تیکت‌های ستون راست را انتخاب کنید.</p>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl">
                <div className="p-4 border-b border-white/10 bg-black/30 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-2 items-center">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getStatusBadge(selectedTicket.status)}`}>
                        {getStatusLabel(selectedTicket.status)}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${getPriorityBadge(selectedTicket.priority)}`}>
                        اولویت: {getPriorityLabel(selectedTicket.priority)}
                      </span>
                      <span className="text-[10px] text-white/40 ss02">
                        ثبت: {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white line-clamp-1">{selectedTicket.subject}</h3>
                    <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                      <span>ارسال کننده: {selectedTicket.userId?.fullName} ({selectedTicket.userId?.email})</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedTicket.status !== "closed" ? (
                      <button
                        onClick={() => handleCloseTicket(selectedTicket._id)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 p-2 rounded-lg transition-all text-xs flex items-center gap-1"
                        title="بستن تیکت"
                      >
                        <Lock className="w-4 h-4 text-red-400" />
                        بستن تیکت
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopenTicket(selectedTicket._id)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 p-2 rounded-lg transition-all text-xs flex items-center gap-1"
                        title="بازگشایی تیکت"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        بازگشایی تیکت
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTicket(selectedTicket._id)}
                      className="bg-white/5 hover:bg-red-500/20 border border-white/10 text-red-400 p-2 rounded-lg transition-all"
                      title="حذف تیکت"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Conversation Chat Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
                  {/* Initial description from user */}
                  <div className="flex gap-3 justify-start max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
                      {selectedTicket.userId?.username?.charAt(0) || "👤"}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tr-none p-4 text-white text-sm">
                      <div className="text-white/40 text-[10px] mb-1.5">{selectedTicket.userId?.fullName || selectedTicket.userId?.username}</div>
                      <p className="leading-relaxed whitespace-pre-line">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {/* Messages Loop */}
                  {selectedTicket.messages && selectedTicket.messages.map((msg) => {
                    const isSupport = (msg.senderId as any)?._id 
                      ? (msg.senderId as any).role === "admin" || (msg.senderId as any).role === "coach"
                      : true; // fallback to support if not populated properly

                    return (
                      <div
                        key={msg._id}
                        className={`flex gap-3 max-w-[85%] ${isSupport ? "mr-auto justify-end flex-row-reverse" : "justify-start"}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                            isSupport
                              ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                              : "bg-orange-500/20 border-orange-500/30 text-orange-400"
                          }`}
                        >
                          {isSupport ? "🛡️" : (selectedTicket.userId?.username?.charAt(0) || "👤")}
                        </div>
                        <div
                          className={`rounded-2xl p-4 text-white text-sm border ${
                            isSupport
                              ? "bg-purple-500/10 border-purple-500/20 rounded-tl-none"
                              : "bg-white/5 border-white/10 rounded-tr-none"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-6 text-white/40 text-[10px] mb-1.5">
                            <span>{msg.senderName}</span>
                            <span className="ss02">{new Date(msg.createdAt).toLocaleTimeString("fa-IR", { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>

                {/* Reply Footer Input */}
                <div className="p-4 border-t border-white/10 bg-black/40">
                  {selectedTicket.status === "closed" ? (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 text-xs flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      این تیکت پشتیبانی بسته شده است. در صورت تمایل ابتدا دکمه بازگشایی تیکت در بالای پنل را کلیک کنید.
                    </div>
                  ) : (
                    <form onSubmit={handleSendReply} className="flex gap-2">
                      <textarea
                        rows={1}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="پاسخ خود را در اینجا بنویسید..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder:text-white/45 focus:outline-none focus:border-orange-500/50 resize-none leading-relaxed h-11 min-h-[44px] max-h-24 overflow-y-auto"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendReply(e);
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!replyText.trim() || sendingReply}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg hover:shadow-orange-500/20 text-white w-12 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4 rotate-180" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
