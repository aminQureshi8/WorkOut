import React from "react";
import { Plus, Sparkles } from "lucide-react";
import { FoodFormProps } from "@/types/nutrition";

export default function FoodForm({
  register,
  errors,
  isSubmitting,
  onSubmit,
}: FoodFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          ایجاد غذای جدید
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400">نام غذا</label>
            <input
              type="text"
              {...register("name", { required: "وارد کردن نام غذا الزامی است." })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              placeholder="مثال: سینه مرغ آب‌پز"
            />
            {errors.name && (
              <span className="text-[10px] text-red-400">{errors.name.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">کالری (کربوهیدرات/پروتئین)</label>
              <input
                type="number"
                {...register("calories", {
                  required: "وارد کردن کالری الزامی است.",
                  min: { value: 0, message: "کالری نمی‌تواند منفی باشد." },
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-sans"
                placeholder="0"
              />
              {errors.calories && (
                <span className="text-[10px] text-red-400">{errors.calories.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">واحد اندازه گیری</label>
              <input
                type="text"
                {...register("unit", { required: "وارد کردن واحد الزامی است." })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
                placeholder="مثال: ۱۰۰ گرم"
              />
              {errors.unit && (
                <span className="text-[10px] text-red-400">{errors.unit.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-purple-300">پروتئین (گرم)</label>
              <input
                type="number"
                step="0.1"
                {...register("protein", {
                  min: { value: 0, message: "پروتئین نمی‌تواند منفی باشد." },
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-sans"
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-orange-300">کربوهیدرات (گرم)</label>
              <input
                type="number"
                step="0.1"
                {...register("carbs", {
                  min: { value: 0, message: "کربوهیدرات نمی‌تواند منفی باشد." },
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-sans"
                placeholder="0"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-yellow-300">چربی (گرم)</label>
              <input
                type="number"
                step="0.1"
                {...register("fat", {
                  min: { value: 0, message: "چربی نمی‌تواند منفی باشد." },
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all font-sans"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">مناسب برای وعده</label>
              <select
                {...register("type")}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
              >
                <option value="all">همه وعده‌ها</option>
                <option value="breakfast">صبحانه</option>
                <option value="lunch">ناهار</option>
                <option value="dinner">شام</option>
                <option value="snack">میان وعده</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 justify-center">
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20 focus:ring-2 focus:ring-offset-0"
                />
                <label htmlFor="isActive" className="text-xs text-gray-300 cursor-pointer">
                  غذا فعال باشد
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            <Sparkles className="w-4 h-4" />
            {isSubmitting ? "در حال ثبت..." : "ثبت غذای جدید"}
          </button>
        </form>
      </div>
    </div>
  );
}
