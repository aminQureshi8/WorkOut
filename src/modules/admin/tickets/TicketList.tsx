import React, { useState, useEffect, useRef } from "react";
import { Search, MessageCircle } from "lucide-react";
import type {
  TicketListProps,
  IClientTicket as ITicket,
} from "@/types/ticket";
import {
  getStatusBadge,
  getStatusLabel,
  getCategoryBadge,
  getCategoryLabel,
} from "./ticketHelpers";

const TicketList: React.FC<TicketListProps> = ({
  children,
  selectedTicket,
  setSelectedTicket,
  onStatsUpdate,
}) => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const lastUpdatedRef = useRef<string | number | undefined>(undefined);
  const lastMsgCountRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/admin/ticket?limit=1000`;
      if (statusFilter !== "all") {
        url += `&status=${statusFilter}`;
      }
      if (debouncedSearchQuery.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت لیست تیکت‌ها");
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.stats) {
        onStatsUpdate(data.stats);
      }
    } catch (err: any) {
      setError(err.message || "دریافت اطلاعات با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter, debouncedSearchQuery]);

  useEffect(() => {
    if (!selectedTicket) {
      if (lastUpdatedRef.current) {
        loadTickets();
      }
      lastUpdatedRef.current = undefined;
      lastMsgCountRef.current = 0;
      return;
    }

    if (
      lastUpdatedRef.current &&
      (selectedTicket.updatedAt !== lastUpdatedRef.current ||
        (selectedTicket.messages?.length || 0) !== lastMsgCountRef.current)
    ) {
      loadTickets();
    }

    lastUpdatedRef.current = selectedTicket.updatedAt;
    lastMsgCountRef.current = selectedTicket.messages?.length || 0;
  }, [selectedTicket]);

  return (
    <>
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
              }}
              className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
              }}
              className="bg-white/5 *:bg-gray-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار پاسخ</option>
              <option value="answered">پاسخ داده شده</option>
              <option value="closed">بسته شده</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${
                      isSelected
                        ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/80 text-white shadow-lg shadow-orange-500/10"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm line-clamp-1">
                        {t.subject}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded border text-[10px] ${getCategoryBadge(t.category)}`}
                      >
                        {getCategoryLabel(t.category)}
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
                        <span>
                          {t.userId?.fullName ||
                            t.userId?.username ||
                            "کاربر ناشناس"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                  </div>
                );
              })}

            </div>
          )}
        </div>

        {children}
      </div>
    </>
  );
};

export default React.memo(TicketList);
