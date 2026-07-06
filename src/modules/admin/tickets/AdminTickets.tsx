"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { showAlert, showConfirm } from "@/utils/alert";
import type {
  IClientTicket as ITicket,
  ITicketStats as IStats,
} from "@/types/ticket";
import TicketStats from "./TicketStats";
import TicketList from "./TicketList";
import TicketDetails from "./TicketDetails";
import { formatNumber } from "./ticketHelpers";

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
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const selectedTicketRef = useRef<ITicket | null>(null);
  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  const fetchTickets = useCallback(async (selectIdAfterFetch?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/admin/ticket?page=${currentPage}&limit=8`;
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
      setTotalPages(data.totalPages || 1);
      setTotalTickets(data.total || 0);

      if (data.stats) {
        setStats(data.stats);
      }

      const currentSelected = selectedTicketRef.current;
      if (selectIdAfterFetch) {
        const updated = data.tickets.find((t: ITicket) => t._id === selectIdAfterFetch);
        if (updated) setSelectedTicket(updated);
      } else if (currentSelected) {
        const updated = data.tickets.find((t: ITicket) => t._id === currentSelected._id);
        if (updated) setSelectedTicket(updated);
      }
    } catch (err: any) {
      setError(err.message || "دریافت اطلاعات با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, debouncedSearchQuery]);


  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Marbeh, sans-serif" }}>
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-white/60 text-sm">
            تیکت‌های ارسالی کاربران را پاسخ داده و مشکلات فنی یا مالی آن‌ها را برطرف کنید.
          </p>
        </div>

        <TicketStats stats={stats} formatNumber={formatNumber} />

        <TicketList
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          setReplyText={setReplyText}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          isLoading={isLoading}
          error={error}
        >
          <TicketDetails
            selectedTicket={selectedTicket}
            replyText={replyText}
            setReplyText={setReplyText}
            sendingReply={sendingReply}
            onSendReply={handleSendReply}
            onCloseTicket={handleCloseTicket}
            onReopenTicket={handleReopenTicket}
            onDeleteTicket={handleDeleteTicket}
          />
        </TicketList>
      </div>
    </div>
  );
}
