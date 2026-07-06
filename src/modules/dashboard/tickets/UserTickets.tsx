"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Plus, ArrowRight } from "lucide-react";

import {
  IClientUser as IUser,
  IClientMessage as IMessage,
  IClientTicket as ITicket,
} from "@/types/ticket";
import UserTicketChat from "./UserTicketChat";
import UserTicketForm from "./UserTicketForm";

export default function UserTickets() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);

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

  return (
    <div
      className="min-h-screen bg-slate-950 p-4 md:p-8 font-danaMed text-white"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 font-morabbaReg">
              تیکت‌های پشتیبانی و مشاوره
            </h1>
            <p className="text-white/60 text-sm">
              سوالات بدنسازی، برنامه‌های ورزشی یا مشکلات فنی خود را با مربیان و
              کارشناسان در میان بگذارید.
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/20 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition-all font-semibold text-sm"
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
          <UserTicketForm
            setShowCreateForm={setShowCreateForm}
            fetchTickets={fetchTickets}
          />
        ) : (
          <UserTicketChat
            tickets={tickets}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            chatEndRef={chatEndRef}
            fetchTickets={fetchTickets}
          />
        )}
      </div>
    </div>
  );
}
