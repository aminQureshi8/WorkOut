"use client";

import React, { useState } from "react";
import type {
  IClientTicket as ITicket,
  ITicketStats as IStats,
} from "@/types/ticket";
import TicketStats from "./TicketStats";
import TicketList from "./TicketList";
import TicketDetails from "./TicketDetails";
import { formatNumber } from "./ticketHelpers";

export default function AdminTickets() {
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [stats, setStats] = useState<IStats>({
    totalCount: 0,
    pendingCount: 0,
    answeredCount: 0,
    closedCount: 0,
  });

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-morabbaReg">
            مدیریت تیکت‌های پشتیبانی
          </h1>
          <p className="text-white/60 text-sm">
            تیکت‌های ارسالی کاربران را پاسخ داده و مشکلات فنی یا مالی آن‌ها را
            برطرف کنید.
          </p>
        </div>

        <TicketStats stats={stats} formatNumber={formatNumber} />

        <TicketList
          selectedTicket={selectedTicket}
          setSelectedTicket={setSelectedTicket}
          onStatsUpdate={setStats}
        >
          <TicketDetails
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
          />
        </TicketList>
      </div>
    </div>
  );
}
