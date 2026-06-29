import React, { useState, useMemo, useEffect } from "react";
import { X, Search, Zap } from "lucide-react";
import type { AddFoodModalProps, FoodItem, Food } from "@/types/nutrition";

const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  activeMealType,
  dbFoods,
  onSaveFood,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPresetFood, setSelectedPresetFood] = useState<Food | null>(
    null,
  );
  const [foodQuantity, setFoodQuantity] = useState("100");
  const [isManualInput, setIsManualInput] = useState(false);

  const [manualName, setManualName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedPresetFood(null);
      setFoodQuantity("100");
      setIsManualInput(false);
      setManualName("");
      setManualCalories("");
      setManualProtein("");
      setManualCarbs("");
      setManualFat("");
    }
  }, [isOpen]);

  const filteredPresetFoods = useMemo(() => {
    if (!searchQuery) return [];
    return dbFoods.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, dbFoods]);

  const popularFoods = useMemo(() => {
    return dbFoods.filter((f) => f.type === activeMealType || f.type === "all");
  }, [dbFoods, activeMealType]);

  const handleSelectPreset = (food: Food) => {
    setSelectedPresetFood(food);
    setSearchQuery(food.name);
    if (
      food.unit.includes("عدد") ||
      food.unit.includes("پیمانه") ||
      food.unit.includes("سیخ")
    ) {
      setFoodQuantity("1");
    } else {
      setFoodQuantity("100");
    }
  };

  const handleSave = () => {
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
        protein:
          Math.round((selectedPresetFood.protein || 0) * multiplier * 10) / 10,
        carbs:
          Math.round((selectedPresetFood.carbs || 0) * multiplier * 10) / 10,
        fat: Math.round((selectedPresetFood.fat || 0) * multiplier * 10) / 10,
      };
    }

    onSaveFood(newItem);
  };

  const translateMealName = (type: string) => {
    switch (type) {
      case "breakfast":
        return "صبحانه";
      case "lunch":
        return "ناهار";
      case "dinner":
        return "شام";
      case "snack":
        return "میان‌وعده";
      default:
        return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/75"></div>
      <div className="bg-gray-900 border z-50 border-white/10 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
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
                    <span className="text-white/40 font-sans">
                      {food.calories} کالری در {food.unit}
                    </span>
                  </button>
                ))
              ) : searchQuery && !selectedPresetFood ? (
                <div className="text-center py-4 text-white/40 text-xs">
                  غذایی پیدا نشد. می‌توانید از تب «ثبت به صورت دستی» استفاده
                  کنید.
                </div>
              ) : !selectedPresetFood ? (
                <div className="space-y-2">
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">
                    غذاهای پر مصرف:
                  </p>
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
                          <span className="block text-[9px] text-white/40 mt-0.5">
                            {food.calories} kcal / {food.unit}
                          </span>
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
                  <span className="text-white text-xs font-semibold">
                    {selectedPresetFood.name}
                  </span>
                  <span className="text-emerald-400 font-sans text-xs bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {selectedPresetFood.calories} کالری پایه
                  </span>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-xs">
                    مقدار مصرفی (
                    {selectedPresetFood.unit.includes("عدد")
                      ? "عدد"
                      : selectedPresetFood.unit.includes("پیمانه")
                        ? "پیمانه"
                        : selectedPresetFood.unit.includes("سیخ")
                          ? "سیخ"
                          : "گرم"}
                    ):
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
              <label className="block text-white/80 mb-2 text-xs">
                نام غذا / مکمل:
              </label>
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
                <label className="block text-white/80 mb-2 text-xs">
                  کالری (هر واحد):
                </label>
                <input
                  type="number"
                  value={manualCalories}
                  onChange={(e) => setManualCalories(e.target.value)}
                  placeholder="مثال: ۱۵۰"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 text-sm font-sans"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 text-xs">
                  تعداد / مقدار:
                </label>
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
              <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">
                درشت‌مغذی‌ها به ازای هر واحد (اختیاری):
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-purple-300 mb-1 text-[10px]">
                    پروتئین (g):
                  </label>
                  <input
                    type="number"
                    value={manualProtein}
                    onChange={(e) => setManualProtein(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-orange-300 mb-1 text-[10px]">
                    کربوهیدرات (g):
                  </label>
                  <input
                    type="number"
                    value={manualCarbs}
                    onChange={(e) => setManualCarbs(e.target.value)}
                    placeholder="0"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 text-xs font-sans"
                  />
                </div>
                <div>
                  <label className="block text-yellow-300 mb-1 text-[10px]">
                    چربی (g):
                  </label>
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
            onClick={handleSave}
            disabled={
              isManualInput
                ? !manualName || !manualCalories
                : !selectedPresetFood
            }
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl shadow-lg transition-all cursor-pointer text-xs"
          >
            ثبت وعده غذایی
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-xs"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AddFoodModal);
