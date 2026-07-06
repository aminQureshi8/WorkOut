"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { HelpCircle, Plus } from "lucide-react";
import { showAlert } from "@/utils/alert";
import { TicketFormValues, UserTicketFormProps } from "@/types/ticket";

export default function UserTicketForm({
  setShowCreateForm,
  fetchTickets,
}: UserTicketFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormValues>({
    defaultValues: {
      subject: "",
      category: "workout",
      file: null,
      description: "",
    },
  });

  const category = watch("category");
  const file = watch("file");

  const selectedFile = file && file.length > 0 ? file[0] : null;

  const onSubmit = async (data: TicketFormValues) => {
    if (!data.subject.trim() || !data.description.trim() || isSubmitting) return;

    try {
      const formData = new FormData();
      formData.append("subject", data.subject.trim());
      formData.append("description", data.description.trim());
      formData.append("category", data.category);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch("/api/user/ticket", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const resData = await res.json();
        reset();
        setShowCreateForm(false);
        showAlert(
          "موفقیت",
          "تیکت شما با موفقیت ثبت شد و به زودی توسط مربیان یا پشتیبانان فیت‌کوچ پاسخ داده خواهد شد.",
          "success",
        );
        fetchTickets(resData.ticket._id);
      } else {
        const err = await res.json();
        throw new Error(err.message || "خطا در ثبت تیکت");
      }
    } catch (err: any) {
      showAlert("خطا", err.message || "ثبت تیکت با خطا مواجه شد.", "error");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto shadow-2xl">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-purple-400" />
        ثبت درخواست یا سوال جدید
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-white/70 text-xs mb-2">موضوع تیکت</label>
          <input
            type="text"
            placeholder="مثال: سوال در مورد شیوه اجرای حرکت اسکات"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 text-sm"
            {...register("subject", { required: true })}
          />
          {errors.subject && (
            <span className="text-red-400 text-xs mt-1 block">
              پر کردن موضوع تیکت الزامی است.
            </span>
          )}
        </div>

        <div>
          <label className="block text-white/70 text-xs mb-2">
            دسته‌بندی موضوع
          </label>
          <select
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm"
            {...register("category", { required: true })}
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
            <label className="block text-white/70 text-xs mb-2">
              آپلود ویدیو یا تصویر فرم حرکت
            </label>
            <div className="relative group border border-dashed border-white/20 hover:border-purple-500/50 rounded-xl bg-white/5 p-6 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept="video/*,image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                {...register("file")}
              />
              {selectedFile ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-purple-400 text-xs font-semibold">
                    فایل انتخاب شد:
                  </span>
                  <span className="text-white text-xs ss02">
                    {selectedFile.name} (
                    {Math.round((selectedFile.size / 1024 / 1024) * 100) / 100}{" "}
                    MB)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("file", null);
                    }}
                    className="mt-2 text-red-400 hover:text-red-300 text-[10px] underline cursor-pointer relative z-10"
                  >
                    حذف فایل
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-white text-xs font-semibold">
                    انتخاب ویدیو یا تصویر حرکت
                  </span>
                  <span className="text-white/40 text-[10px]">
                    فرمت‌های مجاز: MP4, MOV, JPG, PNG (حداکثر ۵۰ مگابایت)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-white/70 text-xs mb-2">
            شرح درخواست یا سوال
          </label>
          <textarea
            rows={6}
            placeholder="جزئیات سوال یا مشکل خود را به صورت کامل بنویسید..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 resize-none text-sm"
            {...register("description", { required: true })}
          />
          {errors.description && (
            <span className="text-red-400 text-xs mt-1 block">
              شرح درخواست یا سوال الزامی است.
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? "در حال ثبت درخواست..." : "ارسال تیکت پشتیبانی"}
        </button>
      </form>
    </div>
  );
}
