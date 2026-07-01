import React from "react";
import { Coffee, Utensils, Salad, Sparkles, Trash2, Plus } from "lucide-react";
import type { MealData } from "@/types/nutrition";
import MealSkeleton from "./MealSkeleton";

interface MealsGridProps {
  currentMeals: MealData;
  isLoadingMeals: boolean;
  onDeleteFood: (mealType: keyof MealData, itemId: string) => void;
  onAddFoodClick: (mealType: keyof MealData) => void;
}

const translateMealName = (type: keyof MealData): string => {
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

const MealsGrid: React.FC<MealsGridProps> = ({
  currentMeals,
  isLoadingMeals,
  onDeleteFood,
  onAddFoodClick,
}) => {
  const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {mealTypes.map((mealType) => {
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
              <span className="text-white/60 font-sans text-[10px] sm:text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-md ss02">
                {mealCalories}  کالری
              </span>
            </div>

            <div className="space-y-2 mb-4 flex-1">
              {isLoadingMeals ? (
                <MealSkeleton />
              ) : mealItems.length > 0 ? (
                mealItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white/5 border border-white/5 hover:border-white/10 px-3 py-2 rounded-xl text-[11px] sm:text-xs transition-colors"
                  >
                    <div>
                      <span className="text-white/90 font-medium block text-xs sm:text-sm">
                        {item.name}
                      </span>
                      <span className="text-white/40 text-[9px] sm:text-[10px] block mt-0.5 ss02">
                        {item.quantity} {item.unit} | پ: {item.protein}g، ک:{" "}
                        {item.carbs}g، چ: {item.fat}g
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-white/80 font-semibold text-xs sm:text-sm ss02">
                        {item.calories} kcal
                      </span>
                      <button
                        onClick={() => onDeleteFood(mealType, item.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
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
              onClick={() => onAddFoodClick(mealType)}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-2 rounded-xl text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              افزودن غذا
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(MealsGrid);
