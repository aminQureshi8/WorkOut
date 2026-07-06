"use client";

import React, { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { showAlert } from "@/utils/alert";

interface UserTicketFormProps {
  setShowCreateForm: (show: boolean) => void;
  fetchTickets: (selectIdAfterFetch?: string) => Promise<void>;
}

export default function UserTicketForm({
  setShowCreateForm,
  fetchTickets,
}: UserTicketFormProps) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<"workout" | "nutrition" | "form_check" | "injury" | "technical">("workout");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

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
        setFile(null);
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-purple-400" />
        ثبت درخواست یا سوال جدید
      </h2>
      <form onSubmit={handleCreateTicket} className="space-y-4">
        <div>
          <label className="block text-white/70 text-xs mb-2">موضوع تیکت</label>
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
          <label className="block text-white/70 text-xs mb-2">دسته‌بندی موضوع</label>
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

        {category === "form_check" && (
          <div className="mt-4">
            <label className="block text-white/70 text-xs mb-2">آپلود ویدیو یا تصویر فرم حرکت</label>
            <div className="relative group border border-dashed border-white/20 hover:border-purple-500/50 rounded-xl bg-white/5 p-6 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept="video/*,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  setFile(e.target.files?.[0] || null);
                }}
              />
              {file ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-purple-400 text-xs font-semibold">فایل انتخاب شد:</span>
                  <span className="text-white text-xs ss02">
                    {file.name} ({Math.round((file.size / 1024 / 1024) * 100) / 100} MB)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-2 text-red-400 hover:text-red-300 text-[10px] underline cursor-pointer"
                  >
                    حذف فایل
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-white text-xs font-semibold">انتخاب ویدیو یا تصویر حرکت</span>
                  <span className="text-white/40 text-[10px]">فرمت‌های مجاز: MP4, MOV, JPG, PNG (حداکثر ۵۰ مگابایت)</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-white/70 text-xs mb-2">شرح درخواست یا سوال</label>
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
          disabled={submittingTicket || !subject.trim() || !description.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submittingTicket ? "در حال ثبت درخواست..." : "ارسال تیکت پشتیبانی"}
        </button>
      </form>
    </div>
  );
}
