"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { showAlert } from "@/utils/alert";
import type { CreatePRModalProps, PRFormInput } from "@/types/pr";

export default function CreatePRModal({ isOpen, onClose, onSuccess, userId }: CreatePRModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PRFormInput>({
    defaultValues: {
      category: "strength",
      testName: "1RM Squat",
      unit: "kg",
      date: new Date().toLocaleDateString("fa-IR"),
      notes: "",
    }
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: PRFormInput) => {
    if (!userId) {
      showAlert("خطا", "شناسه کاربر یافت نشد. امکان ثبت رکورد وجود ندارد.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/user/pr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId,
        }),
      });

      if (res.ok) {
        showAlert("موفقیت", "رکورد شخصی با موفقیت ثبت شد", "success");
        reset();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        showAlert("خطا", errData.message || "خطا در ثبت رکورد", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("خطا", "خطا در برقراری ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl text-white font-bold font-morabbaReg">ثبت رکورد شخصی جدید (PR)</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">دسته‌بندی</label>
              <select
                {...register("category", { required: true })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 text-sm"
              >
                <option value="strength">قدرت</option>
                <option value="speed">سرعت</option>
                <option value="power">توان</option>
                <option value="endurance">استقامت</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">واحد اندازه‌گیری</label>
              <select
                {...register("unit", { required: true })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 text-sm"
              >
                <option value="kg">کیلوگرم (kg)</option>
                <option value="sec">ثانیه (sec)</option>
                <option value="cm">سانتی‌متر (cm)</option>
                <option value="meter">متر (meter)</option>
                <option value="level">سطح (level)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">نام حرکت / تست</label>
              <select
                {...register("testName", { required: true })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 text-sm"
              >
                <option value="1RM Squat">1RM اسکات پا</option>
                <option value="1RM Bench Press">1RM پرس سینه</option>
                <option value="20m Run">دوی ۲۰ متر</option>
                <option value="40m Run">دوی ۴۰ متر</option>
                <option value="Vertical Jump">پرش عمودی</option>
                <option value="Yo-Yo Test">تست Yo-Yo</option>
                <option value="Cooper Test">تست Cooper</option>
                <option value="Weight Endurance">استقامت با وزنه</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">مقدار رکورد</label>
              <input
                type="number"
                step="any"
                {...register("value", { required: true, valueAsNumber: true })}
                placeholder="مثال: ۱۰۰ یا ۲.۹۵"
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 text-left font-sans text-sm"
              />
              {errors.value && <p className="text-red-400 text-xs mt-1">وارد کردن مقدار رکورد الزامی است.</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">تاریخ ثبت</label>
            <input
              type="text"
              {...register("date", { required: true })}
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 text-left font-sans text-sm"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">توضیحات / یادداشت</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="یادداشت مربی (اختیاری)..."
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl text-sm transition-all duration-200 cursor-pointer"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl text-sm shadow-lg shadow-purple-500/10 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              ثبت رکورد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
