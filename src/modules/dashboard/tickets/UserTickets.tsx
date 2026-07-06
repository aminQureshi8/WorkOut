"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Lock,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";
import { showAlert } from "@/utils/alert";

import {
  IClientUser as IUser,
  IClientMessage as IMessage,
  IClientTicket as ITicket,
} from "@/types/ticket";

export default function UserTickets() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<"workout" | "nutrition" | "form_check" | "injury" | "technical">("workout");
  const [description, setDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);



  const fetchTickets = useCallback(
    async (selectIdAfterFetch?: string) => {
      setError(null);
      try {
        const res = await fetch("/api/user/ticket");
        if (!res.ok) throw new Error("خطا در دریافت لیست تیکت‌ها");
        const data = await res.json();
        const userTickets = data.tickets || [];
        setTickets(userTickets);

        if (selectIdAfterFetch) {
          const updated = userTickets.find(
            (t: ITicket) => t._id === selectIdAfterFetch,
          );
          if (updated) setSelectedTicket(updated);
        } else if (selectedTicket) {
          const updated = userTickets.find(
            (t: ITicket) => t._id === selectedTicket._id,
          );
          if (updated) setSelectedTicket(updated);
        }
      } catch (err: any) {
        setError(err.message || "بارگذاری تیکت‌ها با خطا مواجه شد.");
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTicket],
  );

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim() || submittingTicket) return;

    setSubmittingTicket(true);
    try {
      const res = await fetch("/api/user/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          description: description.trim(),
          category,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubject("");
        setDescription("");
        setCategory("workout");
        setShowCreateForm(false);
        showAlert(
          "موفقیت",
          "تیکت شما با موفقیت ثبت شد و به زودی توسط مربیان یا پشتیبانان فیت‌کوچ پاسخ داده خواهد شد.",
          "success",
        );
        fetchTickets(data.ticket._id);
      } else {
        const err = await res.json();
        throw new Error(err.message || "خطا در ثبت تیکت");
      }
    } catch (err: any) {
      showAlert("خطا", err.message || "ثبت تیکت با خطا مواجه شد.", "error");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/user/ticket", {
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
        setSelectedTicket(data.ticket);
        fetchTickets(selectedTicket._id);
      } else {
        const err = await res.json();
        throw new Error(err.message || "خطا در ارسال پیام");
      }
    } catch (err: any) {
      showAlert("خطا", err.message || "ارسال پاسخ ناموفق بود.", "error");
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusBadge = (status: ITicket["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "answered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "closed":
        return "bg-white/10 text-white/50 border-white/20";
      default:
        return "bg-white/10 text-white/55 border-white/20";
    }
  };

  const getStatusLabel = (status: ITicket["status"]) => {
    switch (status) {
      case "pending":
        return "در انتظار پاسخ مربی";
      case "answered":
        return "پاسخ داده شده";
      case "closed":
        return "بسته شده";
      default:
        return status;
    }
  };

  const getCategoryBadge = (category: ITicket["category"]) => {
    switch (category) {
      case "workout":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "nutrition":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "form_check":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "injury":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "technical":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default:
        return "bg-white/5 text-white/60 border-white/10";
    }
  };

  const getCategoryLabel = (category: ITicket["category"]) => {
    switch (category) {
      case "workout":
        return "سوال تمرینی";
      case "nutrition":
        return "سوال تغذیه";
      case "form_check":
        return "بررسی فرم حرکت";
      case "injury":
        return "درد یا آسیب";
      case "technical":
        return "مشکل سایت";
      default:
        return category;
    }
  };



  return (
    <div
      className="min-h-screen bg-slate-950 p-4 md:p-8 font-danaMed text-white"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              تیکت‌های پشتیبانی و مشاوره
            </h1>
            <p className="text-white/60 text-sm">
              سوالات بدنسازی، برنامه‌های ورزشی یا مشکلات فنی خود را با مربیان و
              کارشناسان در میان بگذارید.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold text-sm"
          >
            {showCreateForm ? (
              <>
                <ArrowRight className="w-4 h-4" />
                بازگشت به گفتگوها
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                ثبت تیکت جدید
              </>
            )}
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-white/50 bg-white/5 border border-white/10 rounded-2xl">
            در حال بارگذاری اطلاعات تیکت‌ها...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 bg-white/5 border border-white/10 rounded-2xl">
            {error}
          </div>
        ) : showCreateForm ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-purple-400" />
              ثبت درخواست یا سوال جدید
            </h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-white/70 text-xs mb-2">
                  موضوع تیکت
                </label>
                <input
                  type="text"
                  placeholder="مثال: سوال در مورد شیوه اجرای حرکت اسکات"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-xs mb-2">
                  دسته‌بندی موضوع
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
                >
                  <option value="workout">سوال تمرینی</option>
                  <option value="nutrition">سوال تغذیه</option>
                  <option value="form_check">بررسی فرم حرکت</option>
                  <option value="injury">درد یا آسیب</option>
                  <option value="technical">مشکل سایت</option>
                </select>
              </div>



              <div>
                <label className="block text-white/70 text-xs mb-2">
                  شرح درخواست یا سوال
                </label>
                <textarea
                  rows={6}
                  placeholder="جزئیات سوال یا مشکل خود را به صورت کامل بنویسید..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 resize-none text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={
                  submittingTicket || !subject.trim() || !description.trim()
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingTicket
                  ? "در حال ثبت درخواست..."
                  : "ارسال تیکت پشتیبانی"}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-white font-bold text-lg mb-2">
                درخواست‌های من
              </h2>
              {tickets.length === 0 ? (
                <div className="p-12 text-center text-white/40 bg-white/5 border border-white/10 rounded-2xl">
                  <MessageSquare className="w-12 h-12 mx-auto opacity-20 mb-3" />
                  شما هیچ تیکت پشتیبانی ثبت نکرده‌اید.
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {tickets.map((t) => {
                    const isSelected = selectedTicket?._id === t._id;
                    return (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTicket(t)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-600/20 to-pink-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-sm line-clamp-1">
                            {t.subject}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded border text-[9px] ${getCategoryBadge(t.category)}`}
                          >
                            {getCategoryLabel(t.category)}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                          {t.description}
                        </p>
                        <div className="flex justify-between items-center text-[10px] text-white/50 pt-2 border-t border-white/5">
                          <span
                            className={`px-2 py-0.5 rounded-full border text-[9px] ${getStatusBadge(t.status)}`}
                          >
                            {getStatusLabel(t.status)}
                          </span>
                          <span className="ss02">
                            {new Date(t.createdAt).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="lg:col-span-7">
              {!selectedTicket ? (
                <div className="h-[480px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 p-8 text-center bg-white/5">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-20 text-purple-400" />
                  <h4 className="font-bold text-lg text-white mb-2">
                    تیکتی انتخاب نشده است
                  </h4>
                  <p className="text-sm">
                    برای مشاهده پاسخ‌ها و گفتگو، یکی از درخواست‌های خود را در
                    سمت راست انتخاب کنید.
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[580px] shadow-2xl">
                  <div className="p-4 border-b border-white/10 bg-black/30 flex justify-between items-center">
                    <div>
                      <h3 className="text-md font-bold text-white line-clamp-1 mb-1">
                        {selectedTicket.subject}
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[8px] font-semibold ${getStatusBadge(selectedTicket.status)}`}
                        >
                          {getStatusLabel(selectedTicket.status)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded border text-[8px] ${getCategoryBadge(selectedTicket.category)}`}
                        >
                          {getCategoryLabel(selectedTicket.category)}
                        </span>
                        <span className="text-[9px] text-white/40 ss02">
                          ثبت:{" "}
                          {new Date(
                            selectedTicket.createdAt,
                          ).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                    <div className="flex gap-3 justify-end max-w-[85%] mr-auto flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-bold flex-shrink-0">
                        من
                      </div>
                      <div className="bg-purple-950/20 border border-purple-500/20 rounded-2xl rounded-tl-none p-3 text-white text-xs">
                        <div className="text-purple-400/60 text-[9px] mb-1">
                          من
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    {selectedTicket.messages &&
                      selectedTicket.messages.map((msg) => {
                        const isSupport = (msg.senderId as any)?._id
                          ? (msg.senderId as any).role === "admin" ||
                            (msg.senderId as any).role === "coach"
                          : true;

                        return (
                          <div
                            key={msg._id}
                            className={`flex gap-3 max-w-[85%] ${isSupport ? "justify-start" : "mr-auto justify-end flex-row-reverse"}`}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 border ${
                                isSupport
                                  ? "bg-pink-500/20 border-pink-500/30 text-pink-400"
                                  : "bg-purple-500/20 border-purple-500/30 text-purple-400"
                              }`}
                            >
                              {isSupport ? (
                                <Shield className="w-4 h-4 text-pink-400" />
                              ) : (
                                "من"
                              )}
                            </div>
                            <div
                              className={`rounded-2xl p-3 text-white text-xs border ${
                                isSupport
                                  ? "bg-white/5 border-white/10 rounded-tr-none"
                                  : "bg-purple-950/20 border-purple-500/20 rounded-tl-none"
                              }`}
                            >
                              <div className="flex justify-between items-center gap-6 text-white/40 text-[9px] mb-1">
                                <span>
                                  {isSupport ? "پشتیبان فیت‌کوچ" : "من"}
                                </span>
                                <span className="ss02">
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    "fa-IR",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-line">
                                {msg.text}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 border-t border-white/10 bg-black/40">
                    {selectedTicket.status === "closed" ? (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 text-xs flex items-center justify-center gap-2">
                        <Lock className="w-4 h-4" />
                        این تیکت پشتیبانی بسته شده است. در صورت نیاز تیکت جدیدی
                        ایجاد کنید.
                      </div>
                    ) : (
                      <form onSubmit={handleSendReply} className="flex gap-2">
                        <textarea
                          rows={1}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="پاسخ خود را در اینجا بنویسید..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder:text-white/45 focus:outline-none focus:border-purple-500/50 resize-none leading-relaxed h-11 min-h-[44px] max-h-24 overflow-y-auto"
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
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 text-white w-12 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        )}
      </div>
    </div>
  );
}
