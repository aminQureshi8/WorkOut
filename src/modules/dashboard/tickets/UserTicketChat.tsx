"use client";

import React, { useState } from "react";
import { MessageSquare, Shield, Lock, Send } from "lucide-react";
import { IClientTicket as ITicket } from "@/types/ticket";
import { showAlert } from "@/utils/alert";
import {
  getStatusBadge,
  getStatusLabel,
  getCategoryBadge,
  getCategoryLabel,
} from "./ticketHelpers";

interface UserTicketChatProps {
  tickets: ITicket[];
  selectedTicket: ITicket | null;
  setSelectedTicket: (ticket: ITicket | null) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  fetchTickets: (selectIdAfterFetch?: string) => Promise<void>;
}

export default function UserTicketChat({
  tickets,
  selectedTicket,
  setSelectedTicket,
  chatEndRef,
  fetchTickets,
}: UserTicketChatProps) {
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-5 space-y-4">
        <h2 className="text-white font-bold text-lg mb-2">درخواست‌های من</h2>
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
              برای مشاهده پاسخ‌ها و گفتگو، یکی از درخواست‌های خود را در سمت راست
              انتخاب کنید.
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
                    {new Date(selectedTicket.createdAt).toLocaleDateString(
                      "fa-IR",
                    )}
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
                  <div className="text-purple-400/60 text-[9px] mb-1">من</div>
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
                          <span>{isSupport ? "پشتیبان فیت‌کوچ" : "من"}</span>
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
                  این تیکت پشتیبانی بسته شده است. در صورت نیاز تیکت جدیدی ایجاد
                  کنید.
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
  );
}
