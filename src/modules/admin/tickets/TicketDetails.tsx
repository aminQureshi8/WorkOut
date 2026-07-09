import React, { useRef, useEffect, useState } from "react";
import {
  MessageSquare,
  Lock,
  CheckCircle,
  Trash2,
  AlertCircle,
  Send,
} from "lucide-react";
import type { TicketDetailsProps } from "@/types/ticket";
import { showAlert, showConfirm } from "@/utils/alert";
import {
  getStatusBadge,
  getStatusLabel,
  getCategoryBadge,
  getCategoryLabel,
} from "./ticketHelpers";

const isVideo = (url: string) => {
  const videoExtensions = [".mp4", ".mov", ".webm", ".avi", ".mkv"];
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
};

const TicketDetails: React.FC<TicketDetailsProps> = ({
  selectedTicket,
  setSelectedTicket,
  fetchTickets,
}) => {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    if (selectedTicket?.messages) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages]);

  useEffect(() => {
    setReplyText("");
  }, [selectedTicket?._id]);

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


  if (!selectedTicket) {
    return (
      <div className="lg:col-span-7 h-[500px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 p-8 text-center bg-white/5">
        <MessageSquare className="w-16 h-16 mb-4 opacity-20 text-orange-500" />
        <h4 className="font-bold text-lg text-white mb-2">
          تیکتی انتخاب نشده است
        </h4>
        <p className="text-sm">
          برای مشاهده گفتگو و پاسخ به کاربر، یکی از تیکت‌های ستون راست را انتخاب
          کنید.
        </p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl">
      <div className="p-4 border-b border-white/10 bg-black/30 flex justify-between items-start gap-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2 items-center">
            <span
              className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${getStatusBadge(selectedTicket.status)}`}
            >
              {getStatusLabel(selectedTicket.status)}
            </span>
            <span
              className={`px-2 py-0.5 rounded border text-[10px] ${getCategoryBadge(selectedTicket.category)}`}
            >
              دسته‌بندی: {getCategoryLabel(selectedTicket.category)}
            </span>
            <span className="text-[10px] text-white/40 ss02">
              ثبت:{" "}
              {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1">
            {selectedTicket.subject}
          </h3>
          <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
            <span>
              ارسال کننده: {selectedTicket.userId?.fullName} (
              {selectedTicket.userId?.email})
            </span>
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

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-black/20">
        <div className="flex gap-3 max-w-[85%] mr-auto flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 text-xs font-bold flex-shrink-0">
            {selectedTicket.userId?.username?.charAt(0) || "👤"}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 text-white text-sm">
            <div className="text-white/40 text-[10px] mb-1.5">
              {selectedTicket.userId?.fullName ||
                selectedTicket.userId?.username}
            </div>
            <p className="leading-relaxed whitespace-pre-line">
              {selectedTicket.description}
            </p>
            {selectedTicket.videoUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-white/10 max-w-sm bg-black/40">
                {isVideo(selectedTicket.videoUrl) ? (
                  <video
                    src={selectedTicket.videoUrl}
                    controls
                    className="w-full h-auto max-h-56 object-cover"
                  />
                ) : (
                  <a
                    href={selectedTicket.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group overflow-hidden"
                  >
                    <img
                      src={selectedTicket.videoUrl}
                      alt="پیوست حرکت"
                      className="w-full h-auto max-h-56 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white">
                      مشاهده تصویر کامل
                    </div>
                  </a>
                )}
              </div>
            )}
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
                className={`flex gap-3 max-w-[85%] ${isSupport ? "" : "mr-auto flex-row-reverse"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border ${
                    isSupport
                      ? "bg-purple-500/20 border-purple-500/30 text-purple-400"
                      : "bg-orange-500/20 border-orange-500/30 text-orange-400"
                  }`}
                >
                  {isSupport
                    ? "🛡️"
                    : selectedTicket.userId?.username?.charAt(0) || "👤"}
                </div>
                <div
                  className={`rounded-2xl p-4 text-white text-sm border ${
                    isSupport
                      ? "bg-purple-500/10 border-purple-500/20 rounded-tr-none"
                      : "bg-white/5 border-white/10 rounded-tl-none"
                  }`}
                >
                  <div className="flex justify-between items-center gap-6 text-white/40 text-[10px] mb-1.5">
                    <span>{msg.senderName}</span>
                    <span className="ss02">
                      {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        <div ref={messageEndRef} />
      </div>

      <div className="p-4 border-t border-white/10 bg-black/40">
        {selectedTicket.status === "closed" ? (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center text-red-400 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            این تیکت پشتیبانی بسته شده است. در صورت تمایل ابتدا دکمه بازگشایی
            تیکت در بالای پنل را کلیک کنید.
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
  );
};

export default React.memo(TicketDetails);
