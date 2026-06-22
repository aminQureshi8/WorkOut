import Link from "next/link";
import { ChevronLeft, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

interface TicketItem {
  id: string;
  subject: string;
  status: string;
  rawStatus: string;
  time: string;
}

interface RecentTicketsProps {
  recentTickets: TicketItem[];
}

export default function RecentTickets({ recentTickets }: RecentTicketsProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">تیکت‌های اخیر</h3>
        <Link
          href="/dashboard/tickets"
          className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
        >
          همه تیکت‌ها <ChevronLeft size={14} />
        </Link>
      </div>
      {recentTickets.length > 0 ? (
        <div className="space-y-3">
          {recentTickets.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  t.rawStatus === "answered"
                    ? "bg-green-500/20"
                    : t.rawStatus === "closed"
                      ? "bg-gray-500/20"
                      : "bg-yellow-500/20"
                }`}
              >
                {t.rawStatus === "answered" ? (
                  <CheckCircle size={14} className="text-green-400" />
                ) : t.rawStatus === "closed" ? (
                  <CheckCircle size={14} className="text-gray-400" />
                ) : (
                  <AlertCircle size={14} className="text-yellow-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">
                  {t.subject}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{t.time}</p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  t.rawStatus === "answered"
                    ? "bg-green-500/20 text-green-400"
                    : t.rawStatus === "closed"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {t.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-white/40 text-xs">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-white/20" />
          <p>تیکتی ثبت نکرده‌اید</p>
        </div>
      )}
      <Link
        href="/dashboard/tickets"
        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
      >
        <MessageSquare size={14} />
        ارسال تیکت جدید
      </Link>
    </div>
  );
}
