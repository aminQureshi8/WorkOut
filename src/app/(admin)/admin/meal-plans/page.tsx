"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Search, Trash2, Eye, EyeOff, Utensils, ChevronDown, ChevronUp, ShieldAlert, Activity } from "lucide-react";
import { showAlert, showConfirm } from "@/utils/alert";
import { FoodItem, PackageItem, MealPlanData } from "@/types/meal-plan";
import MealPlanForm from "@/modules/admin/meal-plan/MealPlanForm";

export default function AdminMealPlansPage() {
  const [plans, setPlans] = useState<MealPlanData[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("search") || "";
    }
    return "";
  });
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlanData | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/meal-plan");
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPackagesAndFoods = useCallback(async () => {
    try {
      const pkgRes = await fetch("/api/admin/package");
      if (pkgRes.ok) {
        const pkgData = await pkgRes.json();
        setPackages(pkgData.packages || []);
      }

      const foodRes = await fetch("/api/food?all=true");
      if (foodRes.ok) {
        const foodData = await foodRes.json();
        setFoods(foodData || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
    fetchPackagesAndFoods();
  }, [fetchPlans, fetchPackagesAndFoods]);

  const handleEditClick = (plan: MealPlanData) => {
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingPlan(null);
  };

  const handleSubmitSuccess = () => {
    setShowForm(false);
    setEditingPlan(null);
    fetchPlans();
  };

  const handleToggleActive = async (plan: MealPlanData) => {
    try {
      const response = await fetch(`/api/admin/meal-plan/${plan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !plan.isActive }),
      });

      if (response.ok) {
        showAlert("موفقیت", "وضعیت فعال بودن برنامه تغییر یافت.", "success");
        fetchPlans();
      } else {
        showAlert("خطا", "خطا در تغییر وضعیت برنامه", "error");
      }
    } catch (error) {
      showAlert("خطا", "خطایی در ارتباط رخ داد.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      "آیا مطمئن هستید؟",
      "این برنامه غذایی به طور کامل از سیستم حذف خواهد شد!",
      "بله، حذف شود"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/admin/meal-plan/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          showAlert("موفقیت", "برنامه غذایی با موفقیت حذف شد.", "success");
          fetchPlans();
        } else {
          showAlert("خطا", "خطا در حذف برنامه غذایی", "error");
        }
      } catch (error) {
        showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
      }
    }
  };

  const filteredPlans = plans.filter((plan) =>
    plan.title.toLowerCase().includes(search.toLowerCase()) ||
    (plan.packageId?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white font-danaMed p-4 md:p-8" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-morabbaReg text-white flex items-center gap-3">
              <Utensils className="w-8 h-8 text-emerald-400" />
              برنامه‌ریزی غذایی پکیج‌ها
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              تعریف برنامه غذایی روزانه (صبحانه، ناهار، شام، میان وعده) برای هر پکیج آموزشی و مربیگری
            </p>
          </div>

          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setEditingPlan(null);
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer font-semibold text-sm"
            >
              <Plus className="w-5 h-5" />
              ایجاد برنامه غذایی جدید
            </button>
          )}
        </div>

        {showForm && (
          <MealPlanForm
            packages={packages}
            foods={foods}
            editingPlan={editingPlan}
            onCancel={handleCancelForm}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                لیست برنامه‌های غذایی ثبت شده
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                تعداد کل برنامه‌ها: {filteredPlans.length} مورد
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس عنوان یا پکیج..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500"
              />
              <Search className="w-4 h-4 text-gray-500 absolute top-1/2 right-3.5 -translate-y-1/2" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              در حال دریافت لیست برنامه‌های غذایی...
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-2xl">
              <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              هیچ برنامه غذایی یافت نشد.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map((plan) => {
                const totalBreakfastFoods = (plan.breakfast || []).length;
                const totalLunchFoods = (plan.lunch || []).length;
                const totalDinnerFoods = (plan.dinner || []).length;
                const totalSnackFoods = (plan.snack || []).length;
                const isExpanded = expandedPlanId === plan._id;

                return (
                  <div
                    key={plan._id}
                    className="border border-white/5 bg-white/2 hover:bg-white/3 rounded-2xl p-5 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                          <Utensils className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-base">{plan.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              پکیج: {plan.packageId?.name || "بدون پکیج"}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className="text-[10px] text-gray-500 font-sans">
                              {new Date(plan.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleActive(plan)}
                          className={`p-2 rounded-xl border transition-all ${
                            plan.isActive
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                          }`}
                          title={plan.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        >
                          {plan.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditClick(plan)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold rounded-xl text-white transition-all"
                        >
                          ویرایش برنامه
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                          title="حذف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedPlanId(isExpanded ? null : plan._id)}
                          className="p-2 hover:bg-white/5 text-gray-400 hover:text-white rounded-xl transition-all"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-white/5 pt-4 space-y-4">
                        {plan.description && (
                          <p className="text-xs text-gray-400 bg-white/3 p-3 rounded-xl border border-white/5 leading-relaxed">
                            <span className="font-semibold text-gray-300 block mb-1">توضیحات و توصیه‌های عمومی:</span>
                            {plan.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { name: "صبحانه", count: totalBreakfastFoods, items: plan.breakfast },
                            { name: "ناهار", count: totalLunchFoods, items: plan.lunch },
                            { name: "شام", count: totalDinnerFoods, items: plan.dinner },
                            { name: "میان وعده", count: totalSnackFoods, items: plan.snack },
                          ].map((meal, index) => (
                            <div key={index} className="bg-white/2 border border-white/5 p-4 rounded-xl space-y-2.5">
                              <h4 className="text-xs font-bold text-emerald-400 flex items-center justify-between border-b border-white/5 pb-2">
                                <span>{meal.name}</span>
                                <span className="text-[10px] text-gray-500 font-sans">({meal.count} غذا)</span>
                              </h4>
                              {meal.count === 0 ? (
                                <p className="text-[10px] text-gray-500 py-2">غذایی ثبت نشده است.</p>
                              ) : (
                                <ul className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                                  {meal.items
                                    .filter((item) => item.foodId !== null)
                                    .map((item, foodIndex) => (
                                      <li key={foodIndex} className="text-xs text-gray-300 flex justify-between gap-2">
                                        <span className="truncate">{item.foodId!.name}</span>
                                        <span className="text-emerald-400/80 font-semibold font-sans text-[11px] shrink-0">
                                          {item.quantity} {item.unit || item.foodId!.unit}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
