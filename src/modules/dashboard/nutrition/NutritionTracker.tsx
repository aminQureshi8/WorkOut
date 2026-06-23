"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Salad,
  Activity,
  Flame,
  Droplet,
  Coffee,
  Utensils,
  Plus,
  Trash2,
  X,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Food } from "@/types/nutrition";

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealData {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
}

export default function NutritionTracker() {
  const [selectedDate, setSelectedDate] = useState<"today" | "yesterday" | "prev">("today");
  
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

  const [waterData, setWaterData] = useState<Record<string, number>>({
    today: 0,
    yesterday: 0,
    prev: 0,
  });

  const [dbFoods, setDbFoods] = useState<Food[]>([]);
  const [isFetchingFoods, setIsFetchingFoods] = useState(false);

  const targetWater = 2500;
  const targetCalories = 2200;
  const targetMacros = { protein: 140, carbs: 240, fat: 70 };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<keyof MealData>("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPresetFood, setSelectedPresetFood] = useState<Food | null>(null);
  const [foodQuantity, setFoodQuantity] = useState("100");
  const [isManualInput, setIsManualInput] = useState(false);
  
  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");

  const currentMeals = mealsData[selectedDate];
  const currentWater = waterData[selectedDate];

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
  const calPercent = Math.min(100, Math.round((dailyTotals.calories / targetCalories) * 100));
  const waterPercent = Math.min(100, Math.round((currentWater / targetWater) * 100));

  const filteredPresetFoods = useMemo(() => {
    if (!searchQuery) return [];
    return dbFoods.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, dbFoods]);

  const popularFoods = useMemo(() => {
    return dbFoods.filter((f) => f.type === activeMealType || f.type === "all");
  }, [dbFoods, activeMealType]);

  const handleAddWater = (amount: number) => {
    setWaterData((prev) => ({
      ...prev,
      [selectedDate]: Math.min(4000, (prev[selectedDate] || 0) + amount),
    }));
  };

  const handleResetWater = () => {
    setWaterData((prev) => ({
      ...prev,
      [selectedDate]: 0,
    }));
  };

  const handleDeleteFood = (mealType: keyof MealData, itemId: string) => {
    setMealsData((prev) => {
      const updatedMeal = prev[selectedDate][mealType].filter((item) => item.id !== itemId);
      return {
        ...prev,
        [selectedDate]: {
          ...prev[selectedDate],
          [mealType]: updatedMeal,
        },
      };
    });
  };

  const handleSelectPreset = (food: Food) => {
    setSelectedPresetFood(food);
    setSearchQuery(food.name);
    if (food.unit.includes("عدد") || food.unit.includes("پیمانه") || food.unit.includes("سیخ")) {
      setFoodQuantity("1");
    } else {
      setFoodQuantity("100");
    }
  };

  const handleSaveFood = () => {
    let newItem: FoodItem;

    if (isManualInput) {
      if (!manualName || !manualCalories) return;
      const qty = parseFloat(foodQuantity) || 1;
      const cals = (parseFloat(manualCalories) || 0) * qty;
      const prot = (parseFloat(manualProtein) || 0) * qty;
      const crbs = (parseFloat(manualCarbs) || 0) * qty;
      const ft = (parseFloat(manualFat) || 0) * qty;

      newItem = {
        id: Date.now().toString(),
        name: manualName,
        quantity: qty,
        unit: "واحد",
        calories: Math.round(cals),
        protein: Math.round(prot * 10) / 10,
        carbs: Math.round(crbs * 10) / 10,
        fat: Math.round(ft * 10) / 10,
      };
    } else {
      if (!selectedPresetFood) return;
      const qty = parseFloat(foodQuantity) || 100;
      
      let multiplier = 1;
      let unitStr = "گرم";

      if (selectedPresetFood.unit.includes("عدد")) {
        multiplier = qty;
        unitStr = "عدد";
      } else if (selectedPresetFood.unit.includes("پیمانه")) {
        multiplier = qty;
        unitStr = "پیمانه";
      } else if (selectedPresetFood.unit.includes("سیخ")) {
        multiplier = qty;
        unitStr = "سیخ";
      } else {
        multiplier = qty / 100;
        unitStr = "گرم";
      }

      newItem = {
        id: Date.now().toString(),
        name: selectedPresetFood.name,
        quantity: qty,
        unit: unitStr,
        calories: Math.round(selectedPresetFood.calories * multiplier),
        protein: Math.round((selectedPresetFood.protein || 0) * multiplier * 10) / 10,
        carbs: Math.round((selectedPresetFood.carbs || 0) * multiplier * 10) / 10,
        fat: Math.round((selectedPresetFood.fat || 0) * multiplier * 10) / 10,
      };
    }

    setMealsData((prev) => ({
      ...prev,
      [selectedDate]: {
        ...prev[selectedDate],
        [activeMealType]: [...prev[selectedDate][activeMealType], newItem],
      },
    }));

    setIsModalOpen(false);
    setSearchQuery("");
    setSelectedPresetFood(null);
    setFoodQuantity("100");
    setIsManualInput(false);
    setManualName("");
    setManualCalories("");
    setManualProtein("");
    setManualCarbs("");
    setManualFat("");
  };

  const translateMealName = (type: keyof MealData) => {
    switch (type) {
      case "breakfast": return "صبحانه";
      case "lunch": return "ناهار";
      case "dinner": return "شام";
      case "snack": return "میان‌وعده";
    }
  };

  const getPersianDateLabel = () => {
    switch (selectedDate) {
      case "today": return "امروز (یکشنبه، ۳۱ خرداد)";
      case "yesterday": return "دیروز (شنبه، ۳۰ خرداد)";
      case "prev": return "پریروز (جمعه، ۲۹ خرداد)";
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Salad className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl text-white font-bold" style={{ fontFamily: "Marbeh, sans-serif" }}>
                تغذیه و کالری‌شمار روزانه
              </h1>
              <p className="text-white/60 text-sm mt-0.5">رهگیری دقیق کالری، درشت‌مغذی‌ها و آب مصرفی</p>
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

        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-white/80 font-medium">
            <Activity className="w-4 h-4 text-emerald-400" />
            تاریخ فعال: {getPersianDateLabel()}
          </div>
          <div className="text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs">
            پکیج فعال: کاهش وزن سریع
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          <div className="lg:col-span-8 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg text-white font-bold flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  وضعیت کالری روزانه
                </h3>
                <p className="text-white/50 text-xs mt-1">ترازو و تحلیل کالری‌های وارد شده</p>
              </div>
              <div className="text-left">
                <span className="text-2xl font-extrabold text-white font-sans">{targetCalories}</span>
                <span className="text-white/40 text-xs mr-1">کالری هدف</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-emerald-500/5 border-4 border-emerald-500/20">
                  <div 
                    className="absolute inset-0 rounded-full border-4 border-emerald-400 transition-all duration-500" 
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${calPercent >= 25 ? "100% 0%" : "50% 0%"}, ${calPercent >= 50 ? "100% 100%" : "50% 0%"}, ${calPercent >= 75 ? "0% 100%" : "50% 0%"}, ${calPercent >= 100 ? "0% 0%" : "50% 0%"}, 50% 0%)`,
                      transform: "rotate(-90deg)",
                    }}
                  />
                  <div className="text-center z-10">
                    <span className="block text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-sans">
                      {dailyTotals.calories}
                    </span>
                    <span className="text-white/40 text-xs mt-0.5 block">مصرف شده</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/60 text-sm">باقی‌مانده:</span>
                  <span className="text-white font-bold font-sans text-lg">{caloriesRemaining} kcal</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-white/60 text-sm">درصد تکمیل:</span>
                  <span className="text-emerald-400 font-bold font-sans">{calPercent}%</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-white/60 text-sm">رعایت رژیم:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                    calPercent > 105 ? "bg-red-500/20 text-red-400" :
                    calPercent >= 90 ? "bg-emerald-500/20 text-emerald-400" :
                    "bg-orange-500/20 text-orange-400"
                  }`}>
                    {calPercent > 105 ? "فراتر از حد مجاز" :
                     calPercent >= 90 ? "عالی و متعادل" :
                     "کمتر از کالری مورد نیاز"}
                  </span>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 border border-white/5 rounded-2xl p-4">
                <h4 className="text-white/80 text-xs font-semibold mb-2">درشت‌مغذی‌ها (Macros)</h4>
                
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-300">پروتئین (عضله‌ساز)</span>
                    <span className="text-white/60 font-sans">{dailyTotals.protein} / {targetMacros.protein}g</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (dailyTotals.protein / targetMacros.protein) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-orange-300">کربوهیدرات (انرژی)</span>
                    <span className="text-white/60 font-sans">{dailyTotals.carbs} / {targetMacros.carbs}g</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (dailyTotals.carbs / targetMacros.carbs) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-yellow-300">چربی (هورمون‌ساز)</span>
                    <span className="text-white/60 font-sans">{dailyTotals.fat} / {targetMacros.fat}g</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (dailyTotals.fat / targetMacros.fat) * 100)}%` }}
                    />
                  </div>
                </div>

              </div>

            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl -z-10" />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg text-white font-bold flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-400" />
                  مصرف آب روزانه
                </h3>
                <p className="text-white/50 text-xs mt-1">پیشرفت تا هیدراتاسیون کامل بدن</p>
              </div>
              <button 
                onClick={handleResetWater}
                className="text-[10px] text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
              >
                صفر کردن
              </button>
            </div>

            <div className="text-center my-4">
              <span className="text-4xl font-extrabold text-blue-400 font-sans">{currentWater}</span>
              <span className="text-white/40 text-xs mr-1">/ {targetWater} میلی‌لیتر</span>
            </div>

            <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500 bg-gradient-to-l from-blue-600 to-teal-400"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAddWater(250)}
                className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                ۲۵۰ میلی‌لیتر (۱ لیوان)
              </button>
              <button
                onClick={() => handleAddWater(500)}
                className="bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                ۵۰۰ میلی‌لیتر (بطری)
              </button>
            </div>

          </div>
        </div>

        <h3 className="text-xl text-white font-bold mb-6 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          وعده‌های غذایی امروز
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {(["breakfast", "lunch", "dinner", "snack"] as const).map((mealType) => {
            const mealItems = currentMeals[mealType] || [];
            const mealCalories = mealItems.reduce((sum, item) => sum + item.calories, 0);
            
            let mealIcon = <Coffee className="w-5 h-5 text-yellow-400" />;
            if (mealType === "lunch") mealIcon = <Utensils className="w-5 h-5 text-orange-400" />;
            if (mealType === "dinner") mealIcon = <Salad className="w-5 h-5 text-emerald-400" />;
            if (mealType === "snack") mealIcon = <Sparkles className="w-5 h-5 text-pink-400" />;

            return (
              <div 
                key={mealType} 
                className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
              >
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    {mealIcon}
                    <h4 className="text-white font-bold">{translateMealName(mealType)}</h4>
                  </div>
                  <span className="text-white/60 font-sans text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md">
                    {mealCalories} کالری
                  </span>
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  {mealItems.length > 0 ? (
                    mealItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl text-xs transition-colors"
                      >
                        <div>
                          <span className="text-white/90 font-medium block">{item.name}</span>
                          <span className="text-white/40 text-[10px] block mt-0.5">
                            {item.quantity} {item.unit} | پ: {item.protein}g، ک: {item.carbs}g، چ: {item.fat}g
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white/80 font-sans font-semibold">{item.calories} kcal</span>
                          <button
                            onClick={() => handleDeleteFood(mealType, item.id)}
                            className="text-white/30 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/5"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-white/30 text-xs">
                      هیچ غذایی ثبت نشده است
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setActiveMealType(mealType);
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  افزودن غذا
                </button>

              </div>
            );
          })}

        </div>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm" dir="rtl">
          <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 left-4 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              ثبت غذا در وعده {translateMealName(activeMealType)}
            </h3>

            <div className="grid grid-cols-2 gap-2 mb-4 p-1 bg-white/5 rounded-xl border border-white/5">
              <button
                type="button"
                onClick={() => setIsManualInput(false)}
                className={`py-2 text-xs rounded-lg transition-all ${
                  !isManualInput
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                جستجو در پایگاه غذاها
              </button>
              <button
                type="button"
                onClick={() => setIsManualInput(true)}
                className={`py-2 text-xs rounded-lg transition-all ${
                  isManualInput
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                ثبت به صورت دستی
              </button>
            </div>

            {!isManualInput ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedPresetFood(null);
                    }}
                    placeholder="مثلاً: سینه مرغ، تخم‌مرغ..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
                  />
                  <Search className="w-4 h-4 text-white/40 absolute top-3.5 right-3.5" />
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {searchQuery && filteredPresetFoods.length > 0 ? (
                    filteredPresetFoods.map((food) => (
                      <button
                        type="button"
                        key={food._id}
                        onClick={() => handleSelectPreset(food)}
                        className="w-full text-right text-xs text-white/80 hover:text-white bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 px-3 py-2 rounded-xl transition-all flex justify-between items-center"
                      >
                        <span>{food.name}</span>
                        <span className="text-white/40 font-sans">{food.calories} کالری در {food.unit}</span>
                      </button>
                    ))
                  ) : searchQuery && !selectedPresetFood ? (
                    <div className="text-center py-4 text-white/40 text-xs">
                      غذایی پیدا نشد. می‌توانید از تب «ثبت به صورت دستی» استفاده کنید.
                    </div>
                  ) : !selectedPresetFood ? (
                    <div className="space-y-2">
                      <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">غذاهای پر مصرف:</p>
                      {popularFoods.length === 0 ? (
                        <div className="text-center py-4 text-white/30 text-xs">
                          غذایی برای این وعده یافت نشد.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {popularFoods.slice(0, 6).map((food) => (
                            <button
                              type="button"
                              key={food._id}
                              onClick={() => handleSelectPreset(food)}
                              className="text-right text-xs bg-white/5 hover:bg-white/10 hover:text-white text-white/70 border border-white/5 px-3 py-2.5 rounded-xl transition-all"
                            >
                              <span className="block font-medium">{food.name}</span>
                              <span className="block text-[9px] text-white/40 mt-0.5">{food.calories} kcal / {food.unit}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                {selectedPresetFood && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-xs font-semibold">{selectedPresetFood.name}</span>
                      <span className="text-emerald-400 font-sans text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        {selectedPresetFood.calories} کالری پایه
                      </span>
                    </div>

                    <div>
                      <label className="block text-white/80 mb-2 text-xs">
                        مقدار مصرفی ({selectedPresetFood.unit.includes("عدد") ? "عدد" : selectedPresetFood.unit.includes("پیمانه") ? "پیمانه" : selectedPresetFood.unit.includes("سیخ") ? "سیخ" : "گرم"}):
                      </label>
                      <input
                        type="number"
                        value={foodQuantity}
                        onChange={(e) => setFoodQuantity(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 mb-2 text-xs">نام غذا / مکمل:</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="مثال: فیله بوقلمون"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 mb-2 text-xs">کالری (هر واحد):</label>
                    <input
                      type="number"
                      value={manualCalories}
                      onChange={(e) => setManualCalories(e.target.value)}
                      placeholder="مثال: ۱۵۰"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 mb-2 text-xs">تعداد / مقدار:</label>
                    <input
                      type="number"
                      value={foodQuantity}
                      onChange={(e) => setFoodQuantity(e.target.value)}
                      placeholder="مثال: ۱"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">درشت‌مغذی‌ها به ازای هر واحد (اختیاری):</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-purple-300 mb-1 text-[10px]">پروتئین (g):</label>
                      <input
                        type="number"
                        value={manualProtein}
                        onChange={(e) => setManualProtein(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 text-xs font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-orange-300 mb-1 text-[10px]">کربوهیدرات (g):</label>
                      <input
                        type="number"
                        value={manualCarbs}
                        onChange={(e) => setManualCarbs(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 text-xs font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-yellow-300 mb-1 text-[10px]">چربی (g):</label>
                      <input
                        type="number"
                        value={manualFat}
                        onChange={(e) => setManualFat(e.target.value)}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-yellow-500/50 text-xs font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleSaveFood}
                disabled={isManualInput ? (!manualName || !manualCalories) : !selectedPresetFood}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition-all cursor-pointer text-xs"
              >
                ثبت وعده غذایی
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-xs"
              >
                انصراف
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
