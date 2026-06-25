import React, { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Search, Trash2, Salad, Sparkles } from "lucide-react";
import { showAlert } from "@/utils/alert";
import { MealPlanFormFieldsProps } from "@/types/meal-plan";

export default function MealPlanFormFields({
  register,
  errors,
  control,
  watch,
  packages,
  foods,
  isSubmitting,
  onCancel,
  onSubmit,
}: MealPlanFormFieldsProps) {
  const [activeMealTab, setActiveMealTab] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [foodSearchText, setFoodSearchText] = useState("");
  const [selectedFoodIdToAdd, setSelectedFoodIdToAdd] = useState("");

  const { fields: breakfastFields, append: appendBreakfast, remove: removeBreakfast } = useFieldArray({
    control,
    name: "breakfast",
  });
  const { fields: lunchFields, append: appendLunch, remove: removeLunch } = useFieldArray({
    control,
    name: "lunch",
  });
  const { fields: dinnerFields, append: appendDinner, remove: removeDinner } = useFieldArray({
    control,
    name: "dinner",
  });
  const { fields: snackFields, append: appendSnack, remove: removeSnack } = useFieldArray({
    control,
    name: "snack",
  });

  const watchBreakfast = watch("breakfast") || [];
  const watchLunch = watch("lunch") || [];
  const watchDinner = watch("dinner") || [];
  const watchSnack = watch("snack") || [];

  const handleAddFoodToTab = () => {
    if (!selectedFoodIdToAdd) return;
    const food = foods.find((f) => f._id === selectedFoodIdToAdd);
    if (!food) return;

    const getActiveTabFields = () => {
      if (activeMealTab === "breakfast") return watchBreakfast;
      if (activeMealTab === "lunch") return watchLunch;
      if (activeMealTab === "dinner") return watchDinner;
      return watchSnack;
    };

    if (getActiveTabFields().some((item) => item.foodId === food._id)) {
      showAlert("هشدار", "این غذا قبلاً به این وعده اضافه شده است.", "warning");
      return;
    }

    const newItem = {
      foodId: food._id,
      name: food.name,
      quantity: 100,
      unit: food.unit || "گرم",
    };

    if (activeMealTab === "breakfast") appendBreakfast(newItem);
    else if (activeMealTab === "lunch") appendLunch(newItem);
    else if (activeMealTab === "dinner") appendDinner(newItem);
    else appendSnack(newItem);

    setSelectedFoodIdToAdd("");
    setFoodSearchText("");
  };

  const filteredFoodsForSelect = foods.filter((food) =>
    food.name.toLowerCase().includes(foodSearchText.toLowerCase())
  );

  const getActiveTabFields = () => {
    if (activeMealTab === "breakfast") return breakfastFields;
    if (activeMealTab === "lunch") return lunchFields;
    if (activeMealTab === "dinner") return dinnerFields;
    return snackFields;
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">عنوان برنامه</label>
          <input
            type="text"
            {...register("title", { required: "وارد کردن عنوان برنامه الزامی است." })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500"
            placeholder="مثال: رژیم کاهش وزن پکیج طلایی"
          />
          {errors.title && (
            <span className="text-[10px] text-red-400">{errors.title.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">مربوط به پکیج</label>
          <select
            {...register("packageId", { required: "انتخاب پکیج الزامی است." })}
            className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all"
          >
            <option value="">انتخاب پکیج...</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name}
              </option>
            ))}
          </select>
          {errors.packageId && (
            <span className="text-[10px] text-red-400">{errors.packageId.message}</span>
          )}
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
              برنامه غذایی فعال باشد (نمایش به کاربر دارای اشتراک)
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-gray-400">توضیحات و توصیه‌های عمومی</label>
        <textarea
          rows={2}
          {...register("description")}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500 resize-none"
          placeholder="توصیه‌هایی مانند زمان مصرف آب، میزان نمک یا روغن و..."
        />
      </div>

      <div className="border-t border-white/5 pt-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-gray-300 mb-4 flex items-center gap-2">
            <Salad className="w-4.5 h-4.5 text-emerald-400" />
            تنظیم وعده‌های غذایی روزانه
          </h3>

          <div className="flex flex-wrap border-b border-white/10 gap-2 mb-6">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((tab) => {
              const tabLabels = {
                breakfast: "صبحانه",
                lunch: "ناهار",
                dinner: "شام",
                snack: "میان وعده",
              };

              const tabLength = tab === "breakfast" ? watchBreakfast.length :
                                tab === "lunch" ? watchLunch.length :
                                tab === "dinner" ? watchDinner.length :
                                watchSnack.length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveMealTab(tab);
                    setSelectedFoodIdToAdd("");
                  }}
                  className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
                    activeMealTab === tab
                      ? "border-emerald-500 text-emerald-400 bg-white/5"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tabLabels[tab]} ({tabLength})
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white/2 border border-white/5 rounded-2xl p-5">
            <div className="lg:col-span-1 space-y-4">
              <h4 className="text-xs font-bold text-gray-400">افزودن غذا به این وعده</h4>

              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    value={foodSearchText}
                    onChange={(e) => setFoodSearchText(e.target.value)}
                    placeholder="جستجوی غذا از بانک اطلاعاتی..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 pr-8 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all placeholder-gray-500"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute top-1/2 right-2.5 -translate-y-1/2" />
                </div>

                <select
                  value={selectedFoodIdToAdd}
                  onChange={(e) => setSelectedFoodIdToAdd(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-all"
                >
                  <option value="">انتخاب غذا...</option>
                  {filteredFoodsForSelect.map((food) => (
                    <option key={food._id} value={food._id}>
                      {food.name} ({food.unit})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddFoodToTab}
                  disabled={!selectedFoodIdToAdd}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  افزودن به این وعده
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-gray-400">غذاهای انتخاب شده</h4>

              {getActiveTabFields().length === 0 ? (
                <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-gray-500 text-xs">
                  هیچ غذایی برای این وعده انتخاب نشده است. از منوی سمت راست غذا اضافه کنید.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {getActiveTabFields().map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-xs gap-4"
                    >
                      <span className="font-semibold text-white flex-1">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">مقدار:</span>
                        <input
                          type="number"
                          min="1"
                          {...register(`${activeMealTab}.${index}.quantity` as const, { valueAsNumber: true })}
                          className="w-16 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-center text-white font-sans focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-gray-400 min-w-8">{item.unit}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (activeMealTab === "breakfast") removeBreakfast(index);
                          else if (activeMealTab === "lunch") removeLunch(index);
                          else if (activeMealTab === "dinner") removeDinner(index);
                          else removeSnack(index);
                        }}
                        className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 font-danaDemiBold pt-4 border-t border-white/5">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-all text-xs font-semibold"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold"
        >
          <Sparkles className="w-4 h-4" />
          {isSubmitting ? "در حال ذخیره..." : "ذخیره و ثبت برنامه"}
        </button>
      </div>
    </form>
  );
}
