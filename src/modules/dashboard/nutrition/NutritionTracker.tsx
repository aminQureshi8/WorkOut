"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Salad,
  Activity,
  Flame,
  Coffee,
  Utensils,
  Plus,
  Trash2,
  Sparkles,
  Edit2,
} from "lucide-react";
import type { Food, FoodItem, MealData } from "@/types/nutrition";
import WaterTracker from "./WaterTracker";
import AddFoodModal from "./AddFoodModal";
import EditTargetModal from "./EditTargetModal";
import { BeatLoader } from "react-spinners";

export default function NutritionTracker() {
  const [selectedDate, setSelectedDate] = useState<
    "today" | "yesterday" | "prev"
  >("today");

  const [mealsData, setMealsData] = useState<Record<string, MealData>>({
    today: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
    yesterday: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
    prev: {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
  });

  const [dbFoods, setDbFoods] = useState<Food[]>([]);
  const [isFetchingFoods, setIsFetchingFoods] = useState(false);
  const [targetCalories, setTargetCalories] = useState<number>(2200);
  const [targetMacros, setTargetMacros] = useState({
    protein: 140,
    carbs: 240,
    fat: 70,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] =
    useState<keyof MealData>("breakfast");

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetsLoaded, setTargetsLoaded] = useState(false);

  const currentMeals = mealsData[selectedDate];

  useEffect(() => {
    console.log(isEditingTarget)
  } , [isEditingTarget])

  useEffect(() => {
    const fetchDbFoods = async () => {
      setIsFetchingFoods(true);
      try {
        const res = await fetch("/api/food");
        if (res.ok) {
          const data = await res.json();
          setDbFoods(data || []);
        }
      } catch (err) {
        console.error("Error fetching foods:", err);
      } finally {
        setIsFetchingFoods(false);
      }
    };
    fetchDbFoods();

    const savedTarget = localStorage.getItem("targetCalories");
    if (savedTarget) {
      const val = parseInt(savedTarget);
      if (val) {
        setTargetCalories(val);
      }
    }
    const savedMacros = localStorage.getItem("targetMacros");
    if (savedMacros) {
      try {
        const macros = JSON.parse(savedMacros);
        if (macros) {
          setTargetMacros(macros);
        }
      } catch (e) {
        console.error(e);
      }
    }
    setTargetsLoaded(true);
  }, []);

  const dailyTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    Object.values(currentMeals).forEach((mealItems) => {
      mealItems.forEach((item: FoodItem) => {
        calories += item.calories;
        protein += item.protein;
        carbs += item.carbs;
        fat += item.fat;
      });
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  }, [currentMeals]);

  const caloriesRemaining = Math.max(0, targetCalories - dailyTotals.calories);
  const calPercent = Math.min(
    100,
    Math.round((dailyTotals.calories / targetCalories) * 100),
  );


  const handleDeleteFood = (mealType: keyof MealData, itemId: string) => {
    setMealsData((prev) => {
      const updatedMeal = prev[selectedDate][mealType].filter(
        (item) => item.id !== itemId,
      );
      return {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [mealType]: updatedMeal,
        },
      };
    });
  };

  const handleSaveFood = (newItem: FoodItem) => {
    setMealsData((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [activeMealType]: [...prev[selectedDate][activeMealType], newItem],
      },
    }));
    setIsModalOpen(false);
  };

  const translateMealName = (type: keyof MealData) => {
    switch (type) {
      case "breakfast":
        return "صبحانه";
      case "lunch":
        return "ناهار";
      case "dinner":
        return "شام";
      case "snack":
        return "میان‌وعده";
    }
  };

  const getPersianDateLabel = () => {
    switch (selectedDate) {
      case "today":
        return "امروز (یکشنبه، ۳۱ خرداد)";
      case "yesterday":
        return "دیروز (شنبه، ۳۰ خرداد)";
      case "prev":
        return "پریروز (جمعه، ۲۹ خرداد)";
    }
  };

  return (
    <div className=" pt-4 md:pt-8" dir="rtl">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Salad className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl text-white font-bold">
                تغذیه و کالری‌شمار روزانه
              </h1>
              <p className="text-white/60 text-xs sm:text-sm mt-0.5">
                رهگیری دقیق کالری، درشت‌مغذی‌ها و آب مصرفی
              </p>
            </div>
          </div>

          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={() => setSelectedDate("prev")}
              className={`px-3 py-2 text-xs rounded-lg transition-all ${
                selectedDate === "prev"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              پریروز
            </button>
            <button
              onClick={() => setSelectedDate("yesterday")}
              className={`px-3 py-2 text-xs rounded-lg transition-all ${
                selectedDate === "yesterday"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              دیروز
            </button>
            <button
              onClick={() => setSelectedDate("today")}
              className={`px-3 py-2 text-xs rounded-lg transition-all ${
                selectedDate === "today"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              امروز
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3 justify-between sm:items-center text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-white/80 font-medium">
            <Activity className="w-4 h-4 text-emerald-400" />
            تاریخ فعال: {getPersianDateLabel()}
          </div>
          <div className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] sm:text-xs self-start sm:self-auto">
            پکیج فعال: کاهش وزن سریع
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base sm:text-lg text-white font-bold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  وضعیت کالری روزانه
                </h3>
                <p className="text-white/50 text-[10px] sm:text-xs mt-1">
                  ترازو و تحلیل کالری‌های وارد شده
                </p>
              </div>
              <button
                onClick={() => {
                  if (targetsLoaded) setIsEditingTarget(true);
                }}
                disabled={!targetsLoaded}
                className="text-left flex flex-col items-end group hover:opacity-85 transition-all cursor-pointer border-none bg-transparent p-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-1">
                  {targetsLoaded ? (
                    <span className="text-xl sm:text-2xl font-extrabold text-white font-sans">
                      {targetCalories}
                    </span>
                  ) : (
                    <BeatLoader color="#10b981" size={6} />
                  )}
                  <Edit2 className="w-3.5 h-3.5 text-white/40 group-hover:text-emerald-400 transition-colors" />
                </div>
                <span className="text-white/40 text-[10px] sm:text-xs">
                  کالری هدف (کلیک برای ویرایش)
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center rounded-full bg-emerald-500/5 border-4 border-emerald-500/20">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-emerald-400 transition-all duration-500"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${calPercent >= 25 ? "100% 0%" : "50% 0%"}, ${calPercent >= 50 ? "100% 100%" : "50% 0%"}, ${calPercent >= 75 ? "0% 100%" : "50% 0%"}, ${calPercent >= 100 ? "0% 0%" : "50% 0%"}, 50% 0%)`,
                      transform: "rotate(-90deg)",
                    }}
                  />
                  <div className="text-center z-10">
                    <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-sans">
                      {dailyTotals.calories}
                    </span>
                    <span className="text-white/40 text-[10px] sm:text-xs mt-0.5 block">
                      مصرف شده
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/60 text-xs sm:text-sm">
                    باقی‌مانده:
                  </span>
                  {targetsLoaded ? (
                    <span className="text-white font-bold font-sans text-sm sm:text-lg">
                      {caloriesRemaining} kcal
                    </span>
                  ) : (
                    <BeatLoader color="#10b981" size={5} />
                  )}
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/60 text-xs sm:text-sm">
                    درصد تکمیل:
                  </span>
                  {targetsLoaded ? (
                    <span className="text-emerald-400 font-bold font-sans text-xs sm:text-base">
                      {calPercent}%
                    </span>
                  ) : (
                    <BeatLoader color="#10b981" size={4} />
                  )}
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-white/60 text-xs sm:text-sm">
                    رعایت رژیم:
                  </span>
                  {targetsLoaded ? (
                    <span
                      className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-md font-semibold ${
                        calPercent > 105
                          ? "bg-red-500/20 text-red-400"
                          : calPercent >= 90
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-orange-500/20 text-orange-400"
                      }`}
                    >
                      {calPercent > 105
                        ? "فراتر از حد مجاز"
                        : calPercent >= 90
                          ? "عالی و متعادل"
                          : "کمتر از کالری مورد نیاز"}
                    </span>
                  ) : (
                    <BeatLoader color="#10b981" size={4} />
                  )}
                </div>
              </div>

              <div className="space-y-3 bg-white/5 border border-white/5 rounded-2xl p-4">
                <h4 className="text-white/80 text-[10px] sm:text-xs font-semibold mb-2">
                  درشت‌مغذی‌ها (Macros)
                </h4>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="text-purple-300">پروتئین (عضله‌ساز)</span>
                    <span className="text-white/60 font-sans flex items-center gap-1">
                      {dailyTotals.protein} /{" "}
                      {targetsLoaded ? (
                        `${targetMacros.protein}g`
                      ) : (
                        <BeatLoader color="#c084fc" size={4} />
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (dailyTotals.protein / targetMacros.protein) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="text-orange-300">کربوهیدرات (انرژی)</span>
                    <span className="text-white/60 font-sans flex items-center gap-1">
                      {dailyTotals.carbs} /{" "}
                      {targetsLoaded ? (
                        `${targetMacros.carbs}g`
                      ) : (
                        <BeatLoader color="#fb923c" size={4} />
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (dailyTotals.carbs / targetMacros.carbs) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] sm:text-xs mb-1">
                    <span className="text-yellow-300">چربی (هورمون‌ساز)</span>
                    <span className="text-white/60 font-sans flex items-center gap-1">
                      {dailyTotals.fat} /{" "}
                      {targetsLoaded ? (
                        `${targetMacros.fat}g`
                      ) : (
                        <BeatLoader color="#facc15" size={4} />
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (dailyTotals.fat / targetMacros.fat) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <WaterTracker selectedDate={selectedDate} />
        </div>

        <h3 className="text-lg sm:text-xl text-white font-bold mb-6 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          وعده‌های غذایی امروز
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map(
            (mealType) => {
              const mealItems = currentMeals[mealType] || [];
              const mealCalories = mealItems.reduce(
                (sum, item) => sum + item.calories,
                0,
              );

              let mealIcon = <Coffee className="w-5 h-5 text-yellow-400" />;
              if (mealType === "lunch")
                mealIcon = <Utensils className="w-5 h-5 text-orange-400" />;
              if (mealType === "dinner")
                mealIcon = <Salad className="w-5 h-5 text-emerald-400" />;
              if (mealType === "snack")
                mealIcon = <Sparkles className="w-5 h-5 text-pink-400" />;

              return (
                <div
                  key={mealType}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {mealIcon}
                      <h4 className="text-white font-bold text-sm sm:text-base">
                        {translateMealName(mealType)}
                      </h4>
                    </div>
                    <span className="text-white/60 font-sans text-[10px] sm:text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md">
                      {mealCalories} کالری
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 flex-1">
                    {mealItems.length > 0 ? (
                      mealItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl text-[11px] sm:text-xs transition-colors"
                        >
                          <div>
                            <span className="text-white/90 font-medium block text-xs sm:text-sm">
                              {item.name}
                            </span>
                            <span className="text-white/40 text-[9px] sm:text-[10px] block mt-0.5">
                              {item.quantity} {item.unit} | پ: {item.protein}g،
                              ک: {item.carbs}g، چ: {item.fat}g
                            </span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-white/80 font-sans font-semibold text-xs sm:text-sm">
                              {item.calories} kcal
                            </span>
                            <button
                              onClick={() =>
                                handleDeleteFood(mealType, item.id)
                              }
                              className="text-white/30 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/5"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-white/30 text-[11px] sm:text-xs">
                        هیچ غذایی ثبت نشده است
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setActiveMealType(mealType);
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-2 rounded-xl text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    افزودن غذا
                  </button>
                </div>
              );
            },
          )}
        </div>
      </div>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeMealType={activeMealType}
        dbFoods={dbFoods}
        onSaveFood={handleSaveFood}
      />

      <EditTargetModal
        isOpen={isEditingTarget}
        onClose={() => setIsEditingTarget(false)}
        targetCalories={targetCalories}
        targetMacros={targetMacros}
        onSaveTargets={(calories, protein, carbs, fat) => {
          setTargetCalories(calories);
          setTargetMacros({ protein, carbs, fat });
          localStorage.setItem("targetCalories", calories.toString());
          localStorage.setItem(
            "targetMacros",
            JSON.stringify({ protein, carbs, fat }),
          );
          setIsEditingTarget(false);
        }}
      />
    </div>
  );
}
