"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Salad,
  Flame,
  Utensils,
  Edit2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import type { FoodItem, MealData } from "@/types/nutrition";
import WaterTracker from "./WaterTracker";
import AddFoodModal from "./AddFoodModal";
import EditTargetModal from "./EditTargetModal";
import MealsGrid from "./MealsGrid";
import { BeatLoader } from "react-spinners";
import { getLocalDateString, getPersianDateLabel } from "@/utils/date";

export default function NutritionTracker({ userId }: { userId: string }) {
  const [selectedDate, setSelectedDate] = useState<string>(
    getLocalDateString(0),
  );

  const [mealsData, setMealsData] = useState<Record<string, MealData>>({});
  const [waterData, setWaterData] = useState<Record<string, number>>({});

  const [targetCalories, setTargetCalories] = useState<number>(2200);
  const [targetMacros, setTargetMacros] = useState({
    protein: 140,
    carbs: 240,
    fat: 70,
  });
  const [targetWater, setTargetWater] = useState<number>(2500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] =
    useState<keyof MealData>("breakfast");

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetsLoaded, setTargetsLoaded] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  const currentMeals = mealsData[selectedDate] || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  };

  useEffect(() => {
    const fetchDailyLog = async () => {
      if (mealsData[selectedDate] !== undefined) {
        return;
      }
      setIsLoadingMeals(true);
      try {
        const res = await fetch(
          `/api/nutrition?userId=${userId}&date=${selectedDate}`,
        );
        if (res.ok) {
          const data = await res.json();
          console.log(data);

          if (data) {
            if (data.targetCalories) setTargetCalories(data.targetCalories);
            if (data.targetProtein || data.targetCarbs || data.targetFat) {
              setTargetMacros({
                protein: data.targetProtein || 140,
                carbs: data.targetCarbs || 240,
                fat: data.targetFat || 70,
              });
            }
            setMealsData((prev) => ({
              ...prev,
              [selectedDate]: data.meals || {
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
              },
            }));
            setWaterData((prev) => ({
              ...prev,
              [selectedDate]: data.waterIntake || 0,
            }));
          } else {
            setMealsData((prev) => ({
              ...prev,
              [selectedDate]: {
                breakfast: [],
                lunch: [],
                dinner: [],
                snack: [],
              },
            }));
            setWaterData((prev) => ({
              ...prev,
              [selectedDate]: 0,
            }));
          }
        } else {
          setMealsData((prev) => ({
            ...prev,
            [selectedDate]: {
              breakfast: [],
              lunch: [],
              dinner: [],
              snack: [],
            },
          }));
          setWaterData((prev) => ({
            ...prev,
            [selectedDate]: 0,
          }));
        }
      } catch (err) {
        console.error("Error fetching daily log:", err);
      } finally {
        setIsLoadingMeals(false);
        setTargetsLoaded(true);
      }
    };
    fetchDailyLog();
  }, [selectedDate, userId]);

  const changeDate = (direction: "next" | "prev") => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + (direction === "next" ? 1 : -1));

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${y}-${m}-${d}`);
  };

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

  const handleDeleteFood = useCallback(async (mealType: keyof MealData, itemId: string) => {
    const dayMeals = mealsData[selectedDate] || {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    };
    const updatedMeal = dayMeals[mealType].filter((item) => item.id !== itemId);

    const updatedMealsForDate = {
      ...dayMeals,
      [mealType]: updatedMeal,
    };

    setMealsData((prev) => ({
      ...prev,
      [selectedDate]: updatedMealsForDate,
    }));

    try {
      const response = await fetch(`/api/nutrition?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          meals: updatedMealsForDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete food log from server");
      }
    } catch (error) {
      console.error("Error deleting food log:", error);
    }
  }, [selectedDate, userId, mealsData]);

  const handleSaveFood = useCallback((newItem: FoodItem) => {
    setMealsData((prev) => {
      const dayMeals = prev[selectedDate] || {
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
      };
      return {
        ...prev,
        [selectedDate]: {
          ...dayMeals,
          [activeMealType]: [...dayMeals[activeMealType], newItem],
        },
      };
    });
    setIsModalOpen(false);
  }, [selectedDate, activeMealType]);

  const handleWaterChange = useCallback((newAmount: number) => {
    setWaterData((prev) => ({
      ...prev,
      [selectedDate]: newAmount,
    }));
  }, [selectedDate]);

  const handleAddFoodClick = useCallback((mealType: keyof MealData) => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  }, []);

  return (
    <div className="font-danaMed pt-4 md:pt-8" dir="rtl">
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

          <div className="flex items-center justify-between w-full sm:w-auto bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
            <button
              onClick={() => changeDate("prev")}
              className="p-2 rounded-xl text-white/60 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
              title="دیروز"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
            </button>

            <button
              onClick={() => {
                const todayStr = getLocalDateString(0);
                if (selectedDate !== todayStr) {
                  setSelectedDate(todayStr);
                }
              }}
              className="px-3 sm:px-6 py-2 text-xs sm:text-sm font-semibold text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-all cursor-pointer select-none flex-1 text-center"
            >
              <span className="ss02">{getPersianDateLabel(selectedDate)}</span>
            </button>

            <button
              onClick={() => changeDate("next")}
              className="p-2 rounded-xl text-white/60 hover:text-emerald-400 hover:bg-white/5 transition-all cursor-pointer"
              title="فردا"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
            </button>
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
                    <span className="text-xl sm:text-2xl font-extrabold text-white  ss02">
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
                    <span className="block text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400  ss02">
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
                    <span className="text-white font-bold  text-sm sm:text-lg ss02">
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
                    <span className="text-emerald-400 font-bold  text-xs sm:text-base ss02">
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
                    <span className="text-white/60  flex items-center gap-1 ss02">
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
                    <span className="text-white/60  flex items-center gap-1 ss02">
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
                    <span className="text-white/60  flex items-center gap-1 ss02">
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

          <WaterTracker
            userId={userId}
            selectedDate={selectedDate}
            targetWater={targetWater}
            waterIntake={waterData[selectedDate] || 0}
            onWaterChange={handleWaterChange}
            isLoading={isLoadingMeals}
          />
        </div>

        <h3 className="text-lg sm:text-xl text-white font-bold mb-6 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          وعده‌های غذایی امروز
        </h3>

        <MealsGrid
          currentMeals={currentMeals}
          isLoadingMeals={isLoadingMeals}
          onDeleteFood={handleDeleteFood}
          onAddFoodClick={handleAddFoodClick}
        />
      </div>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeMealType={activeMealType}
        onSaveFood={handleSaveFood}
        userId={userId}
        selectedDate={selectedDate}
        currentMeals={currentMeals}
      />

      <EditTargetModal
        isOpen={isEditingTarget}
        onClose={() => setIsEditingTarget(false)}
        userId={userId}
        targetCalories={targetCalories}
        targetMacros={targetMacros}
        targetWater={targetWater}
        onSaveTargets={(calories, protein, carbs, fat, water) => {
          setTargetCalories(calories);
          setTargetMacros({ protein, carbs, fat });
          setTargetWater(water);
          setIsEditingTarget(false);
        }}
      />
    </div>
  );
}
