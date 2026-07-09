"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

  const paramsRef = useRef({ page: 1, status: "all", search: "" });

  const selectedTicketRef = useRef<ITicket | null>(null);
  useEffect(() => {
    selectedTicketRef.current = selectedTicket;
  }, [selectedTicket]);

  const fetchTickets = useCallback(async (selectIdAfterFetch?: string) => {
    const { page, status, search } = paramsRef.current;
    let url = `/api/admin/ticket?page=${page}&limit=8`;
    if (status !== "all") {
      url += `&status=${status}`;
    }
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("خطا در دریافت لیست تیکت‌ها");
    const data = await res.json();
    setTickets(data.tickets || []);

    if (data.stats) {
      setStats(data.stats);
    }

    const currentSelected = selectedTicketRef.current;
    if (selectIdAfterFetch) {
      const updated = data.tickets.find(
        (t: ITicket) => t._id === selectIdAfterFetch,
      );
      if (updated) setSelectedTicket(updated);
    } else if (currentSelected) {
      const updated = data.tickets.find(
        (t: ITicket) => t._id === currentSelected._id,
      );
      if (updated) setSelectedTicket(updated);
    }

    return {
      totalPages: data.totalPages || 1,
      total: data.total || 0,
    };
  }, []);

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-white/60 text-sm">
            تیکت‌های ارسالی کاربران را پاسخ داده و مشکلات فنی یا مالی آن‌ها را
            برطرف کنید.
          </p>
        </div>

        <TicketStats stats={stats} formatNumber={formatNumber} />

        <TicketList
          tickets={tickets}
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          fetchTickets={fetchTickets}
          paramsRef={paramsRef}
        >
          <TicketDetails
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            fetchTickets={fetchTickets}
          />
        </TicketList>
      </div>
    </div>
  );
}
