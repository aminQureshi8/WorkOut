"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { X, Loader2 } from "lucide-react";
import { showAlert } from "@/utils/alert";
import type { CreatePRModalProps, PRFormInput, TestMetricItem } from "@/types/pr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreatePRModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: CreatePRModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PRFormInput>({
    defaultValues: {
      category: "strength",
      testName: "",
      unit: "kg",
      date: new Date().toLocaleDateString("fa-IR"),
      notes: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const { data: metricsData } = useSWR(
    isOpen ? "/api/admin/metric" : null,
    fetcher,
  );
  const metrics: TestMetricItem[] = metricsData?.metrics || [];

  useEffect(() => {
    if (metrics.length > 0 && isOpen) {
      const first = metrics[0];
      setValue("metricId", first._id);
      setValue("testName", first.name);
      if (first.category) setValue("category", first.category);
      if (first.unit) setValue("unit", first.unit);
    }
  }, [metrics, isOpen, setValue]);

  const handleMetricSelect = (metricId: string) => {
    if (!metricId) return;
    const selected = metrics.find((m) => m._id === metricId);
    if (selected) {
      setValue("metricId", selected._id);
      setValue("testName", selected.name);
      if (selected.category) setValue("category", selected.category);
      if (selected.unit) setValue("unit", selected.unit);
    }
  };

  const onSubmit = async (data: PRFormInput) => {
    if (!userId) {
      showAlert("خطا", "شناسه کاربر یافت نشد. امکان ثبت رکورد وجود ندارد.", "error");
      return;
    }

    if (!data.testName && !data.metricId) {
      showAlert("خطا", "لطفاً یک متس ارزیابی انتخاب کنید.", "error");
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-xl text-white font-bold font-morabbaReg">
            ثبت رکورد شخصی جدید (PR)
          </h2>
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
          <input type="hidden" {...register("testName")} />
          <input type="hidden" {...register("category")} />
          <input type="hidden" {...register("unit")} />

          <div>
            <label className="block text-white/80 text-sm mb-2">
              انتخاب متس ارزیابی (Metric)
            </label>
            <select
              onChange={(e) => handleMetricSelect(e.target.value)}
              className="w-full bg-gray-950 border border-purple-500/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
            >
              {metrics.length === 0 ? (
                <option value="">در حال بارگذاری یا هیچ متسی ثبت نشده است...</option>
              ) : (
                metrics.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.unit})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">
              مقدار رکورد
            </label>
            <input
              type="number"
              step="any"
              {...register("value", { required: true, valueAsNumber: true })}
              placeholder="مثال: ۱۰۰ یا ۲.۹۵"
              className="w-full bg-gray-950 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 text-left font-sans text-sm"
            />
            {errors.value && (
              <p className="text-red-400 text-xs mt-1">
                وارد کردن مقدار رکورد الزامی است.
              </p>
            )}
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
            <label className="block text-white/80 text-sm mb-2">
              توضیحات / یادداشت
            </label>
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
