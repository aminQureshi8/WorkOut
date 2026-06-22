"use client";
import React from "react";
import { formatToPersianWithCommas } from "@/utils/price";
import { PackageModalProps } from "@/types/package";

export default function PackageModal({
  isOpen,
  editingPackage,
  onClose,
  onSubmit,
  register,
  errors,
  isSubmitting,
  setValue,
}: PackageModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg z-10">
          <h2
            className="text-2xl text-white font-bold"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            {editingPackage ? "ویرایش پکیج" : "ایجاد پکیج جدید"}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          
          {/* Package Name */}
          <div>
            <label className="block text-white mb-2 text-xs">نام پکیج</label>
            <input
              type="text"
              placeholder="مثال: بسته طلایی"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              {...register("name", {
                required: "نام پکیج ضروری است",
                minLength: 2,
              })}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-white mb-2 text-xs">اسلاگ (URL)</label>
            <input
              type="text"
              placeholder="مثال: gold-package"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              {...register("slug", {
                required: "اسلاگ ضروری است",
                pattern: {
                  value: /^[a-z0-9-]+$/i,
                  message: "فرمت اسلاگ نامعتبر است",
                },
              })}
            />
            {errors.slug && (
              <p className="text-red-400 text-sm mt-1">
                {errors.slug.message}
              </p>
            )}
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-white mb-2 text-xs">تاگلاین (معرفی کوتاه)</label>
            <input
              type="text"
              placeholder="توضیح کوتاه و جذاب"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
              {...register("tagline", {
                required: "تاگلاین ضروری است",
                minLength: 2,
              })}
            />
            {errors.tagline && (
              <p className="text-red-400 text-sm mt-1">
                {errors.tagline.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-white mb-2 text-xs">توضیحات</label>
            <textarea
              rows={3}
              placeholder="توضیحات کامل درباره خدمات این پکیج..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
              {...register("description", {
                required: "توضیحات ضروری است",
                minLength: 2,
              })}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Icon, ColorClass, Tier */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2 text-xs">آیکون پکیج</label>
              <input
                type="text"
                placeholder="مثال: Package"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("icon")}
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">کلاس رنگی</label>
              <input
                type="text"
                placeholder="text-orange-400"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("colorClass")}
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">سطح (Tier)</label>
              <select
                className="w-full bg-white/5 *:bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 text-sm cursor-pointer"
                {...register("tier")}
              >
                <option value="basic">پایه (Basic)</option>
                <option value="professional">حرفه‌ای (Professional)</option>
                <option value="vip">وی‌آی‌پی (VIP)</option>
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2 text-xs">قیمت یک ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("price.monthly", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("price.monthly", formatted);
                  }
                })}
              />
              {errors.price?.monthly && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.monthly.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">قیمت سه ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("price.quarterly", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("price.quarterly", formatted);
                  }
                })}
              />
              {errors.price?.quarterly && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.quarterly.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">قیمت شش ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("price.biannual", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("price.biannual", formatted);
                  }
                })}
              />
              {errors.price?.biannual && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.price.biannual.message}
                </p>
              )}
            </div>
          </div>

          {/* Original Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-white mb-2 text-xs">قیمت اصلی یک ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("originalPrice.monthly", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("originalPrice.monthly", formatted);
                  }
                })}
              />
              {errors.originalPrice?.monthly && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.originalPrice.monthly.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">قیمت اصلی سه ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("originalPrice.quarterly", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("originalPrice.quarterly", formatted);
                  }
                })}
              />
              {errors.originalPrice?.quarterly && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.originalPrice.quarterly.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">قیمت اصلی شش ماهه</label>
              <input
                type="text"
                placeholder="۰"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                {...register("originalPrice.biannual", {
                  required: "ضروری است",
                  onChange: (e: any) => {
                    const formatted = formatToPersianWithCommas(e.target.value);
                    setValue("originalPrice.biannual", formatted);
                  }
                })}
              />
              {errors.originalPrice?.biannual && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.originalPrice.biannual.message}
                </p>
              )}
            </div>
          </div>

          {/* Features text area */}
          <div>
            <label className="block text-white mb-2 text-xs">امکانات پکیج (هر کدام در یک خط)</label>
            <textarea
              rows={4}
              placeholder="برنامه تمرینی اختصاصی&#10;پشتیبانی ۲۴ ساعته&#10;برنامه غذایی هوشمند"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none text-sm leading-relaxed"
              {...register("featuresText")}
            />
          </div>

          {/* Switches (Popular / Active) */}
          <div className="flex gap-6 py-2">
            <label className="flex items-center gap-2 text-white text-xs cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                {...register("isPopular")}
              />
              بخش محبوب‌ترین بسته (Popular Badge)
            </label>
            <label className="flex items-center gap-2 text-white text-xs cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                {...register("isActive")}
              />
              پکیج فعال باشد (نمایش در سایت)
            </label>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-white/10 flex gap-3 bg-gray-950/20 -mx-6 -mb-6 sticky bottom-0 backdrop-blur-lg">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all font-semibold text-sm cursor-pointer"
            >
              {isSubmitting ? "در حال ثبت..." : editingPackage ? "ذخیره تغییرات" : "ایجاد پکیج"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm cursor-pointer"
            >
              انصراف
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
