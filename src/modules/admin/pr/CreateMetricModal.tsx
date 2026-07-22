"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2, PlusCircle } from "lucide-react";
import { showAlert } from "@/utils/alert";
import type { CreateMetricModalProps, MetricFormInput } from "@/types/pr";

export default function CreateMetricModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMetricModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MetricFormInput>({
    defaultValues: {
      name: "",
      category: "strength",
      unit: "kg",
      description: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: MetricFormInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/metric", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        showAlert("موفقیت", "متس / متغیر ارزیابی جدید با موفقیت ایجاد شد", "success");
        reset();
        if (onSuccess) onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        showAlert("خطا", errData.message || "خطا در ایجاد متس", "error");
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl text-white font-bold font-morabbaReg">
              تعریف متس / متغیر ارزیابی جدید (Metric)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div>
            <label className="block text-white/80 text-sm mb-2">
              نام متس / تست ارزیابی
            </label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="مثال: 1RM اسکوات یا زمان دوی ۴۰ متر"
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 text-sm"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                وارد کردن نام متس الزامی است.
              </p>
            )}
          </div>

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
                <option value="flexibility">انعطاف‌پذیری</option>
                <option value="agility">چابکی</option>
                <option value="anthropometry">پیکرسنجی</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                واحد اندازه‌گیری
              </label>
              <select
                {...register("unit", { required: true })}
                className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500/50 text-sm"
              >
                <option value="kg">کیلوگرم (kg)</option>
                <option value="sec">ثانیه (sec)</option>
                <option value="cm">سانتی‌متر (cm)</option>
                <option value="meter">متر (meter)</option>
                <option value="count">تکرار (count)</option>
                <option value="level">سطح (level)</option>
                <option value="percent">درصد (%)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">
              توضیحات و نحوه اجرای تست
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="توضیحات تکمیلی متس (اختیاری)..."
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
              ثبت متس جدید
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
