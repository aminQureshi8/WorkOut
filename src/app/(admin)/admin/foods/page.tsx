"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Plus, Search, Apple, Activity, ShieldAlert, Sparkles, Trash2, Eye, EyeOff } from "lucide-react";
import { showAlert, showConfirm } from "@/utils/alert";
import { Food } from "@/types/nutrition";

interface FoodFormData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
  type: "breakfast" | "lunch" | "dinner" | "snack" | "all";
  isActive: boolean;
}

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormData>({
    defaultValues: {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      unit: "گرم",
      type: "all",
      isActive: true,
    },
  });

  const fetchFoods = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/food?all=true");
      if (response.ok) {
        const data = await response.json();
        setFoods(data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const onSubmit: SubmitHandler<FoodFormData> = async (data) => {
    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showAlert("موفقیت", "غذای جدید با موفقیت ثبت شد.", "success");
        reset();
        fetchFoods();
      } else {
        const errorData = await response.json();
        showAlert("خطا", errorData.message || "خطا در ثبت غذا", "error");
      }
    } catch (error) {
      showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/food/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        showAlert("موفقیت", "وضعیت غذا با موفقیت تغییر کرد.", "success");
        fetchFoods();
      } else {
        showAlert("خطا", "خطا در تغییر وضعیت غذا", "error");
      }
    } catch (error) {
      showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      "آیا مطمئن هستید؟",
      "این غذا به طور کامل از سیستم حذف خواهد شد!",
      "بله، حذف شود"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/food/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          showAlert("موفقیت", "غذا با موفقیت حذف شد.", "success");
          fetchFoods();
        } else {
          showAlert("خطا", "خطا در حذف غذا", "error");
        }
      } catch (error) {
        showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
      }
    }
  };

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-danaMed p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-morabbaReg text-white flex items-center gap-3">
              <Apple className="w-8 h-8 text-emerald-400" />
              مدیریت و ایجاد غذاها
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              ایجاد، دسته‌بندی و تعریف ارزش غذایی اقلام غذایی برای بخش کالری‌شمار روزانه کاربران
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    لیست غذاهای موجود
                  </h2>
                  <p className="text-gray-400 text-xs mt-1">
                    تعداد کل غذاها: {filteredFoods.length} مورد
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجوی نام غذا..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500"
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute top-1/2 right-3.5 -translate-y-1/2" />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  در حال بارگذاری اطلاعات...
                </div>
              ) : filteredFoods.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-xl">
                  <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                  هیچ غذایی یافت نشد.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400 text-xs md:text-sm">
                        <th className="pb-3 pr-2">نام غذا</th>
                        <th className="pb-3">واحد اندازه گیری</th>
                        <th className="pb-3 text-center">کالری (Kcal)</th>
                        <th className="pb-3 text-center">پروتئین</th>
                        <th className="pb-3 text-center">کربوهیدرات</th>
                        <th className="pb-3 text-center">چربی</th>
                        <th className="pb-3 text-center">وضعیت</th>
                        <th className="pb-3 pl-2 text-center">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-xs md:text-sm text-gray-200">
                      {filteredFoods.map((food) => (
                        <tr key={food._id} className="hover:bg-white/2 ss02 transition-colors">
                          <td className="py-3.5 pr-2 font-semibold text-white">
                            {food.name}
                          </td>
                          <td className="py-3.5 text-gray-300">
                            {food.unit}
                          </td>
                          <td className="py-3.5 text-center font-bold text-white">
                            {food.calories}
                          </td>
                          <td className="py-3.5 text-center text-purple-400 font-semibold">
                            {food.protein}g
                          </td>
                          <td className="py-3.5 text-center text-orange-400 font-semibold">
                            {food.carbs}g
                          </td>
                          <td className="py-3.5 text-center text-yellow-400 font-semibold">
                            {food.fat}g
                          </td>
                          <td className="py-3.5 text-center">
                            {food.isActive ? (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                فعال
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                                غیرفعال
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pl-2 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleToggleActive(food._id, food.isActive)}
                                className={`p-1.5 cursor-pointer rounded-lg border transition-all ${
                                  food.isActive
                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                    : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                }`}
                                title={food.isActive ? "غیرفعال کردن" : "فعال کردن"}
                              >
                                {food.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDelete(food._id)}
                                className="p-1.5 cursor-pointer rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                ایجاد غذای جدید
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        </div>
      </div>
    </div>
  );
}
