import React, { useState, useEffect } from "react";
import { Flame, Plus } from "lucide-react";

interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  targetCalories: number;
  targetMacros: { protein: number; carbs: number; fat: number };
  targetWater: number;
  onSaveTargets: (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    water: number,
  ) => void;
}

const EditTargetModal: React.FC<EditTargetModalProps> = ({
  isOpen,
  onClose,
  userId,
  targetCalories,
  targetMacros,
  targetWater,
  onSaveTargets,
}) => {
  const [tempTargetCalories, setTempTargetCalories] = useState(
    targetCalories.toString(),
  );
  const [tempTargetProtein, setTempTargetProtein] = useState(
    targetMacros.protein.toString(),
  );
  const [tempTargetCarbs, setTempTargetCarbs] = useState(
    targetMacros.carbs.toString(),
  );
  const [tempTargetFat, setTempTargetFat] = useState(
    targetMacros.fat.toString(),
  );
  const [tempTargetWater, setTempTargetWater] = useState(
    targetWater.toString(),
  );

  useEffect(() => {
    if (isOpen) {
      setTempTargetCalories(targetCalories.toString());
      setTempTargetProtein(targetMacros.protein.toString());
      setTempTargetCarbs(targetMacros.carbs.toString());
      setTempTargetFat(targetMacros.fat.toString());
      setTempTargetWater(targetWater.toString());
    }
  }, [isOpen, targetCalories, targetMacros, targetWater]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const calories = parseInt(tempTargetCalories) || 2200;
    const protein = parseInt(tempTargetProtein) || 140;
    const carbs = parseInt(tempTargetCarbs) || 240;
    const fat = parseInt(tempTargetFat) || 70;
    const water = parseInt(tempTargetWater) || 2500;

    try {
      const response = await fetch(`/api/nutrition?userId=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tempTargetCalories: calories,
          tempTargetProtein: protein,
          tempTargetCarbs: carbs,
          tempTargetFat: fat,
          tempTargetWater: water,
        }),
      });

      if (response.ok) {
        localStorage.removeItem("targetCalories");
        localStorage.removeItem("targetMacros");
        localStorage.removeItem("targetWater");
      }
    } catch (e) {
      console.error("Error updating targets via PUT:", e);
    }

    onSaveTargets(calories, protein, carbs, fat, water);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      dir="rtl"
    >
      <div onClick={onClose} className="fixed inset-0 z-40 bg-black/75"></div>
      <div className="bg-gray-900 border z-50 border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 rotate-45" />
        </button>

        <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          تنظیم اهداف کالری و درشت‌مغذی‌ها
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-white/80 mb-2 text-xs">
              کالری هدف روزانه:
            </label>
            <input
              type="number"
              value={tempTargetCalories}
              onChange={(e) => setTempTargetCalories(e.target.value)}
              placeholder="مثال: ۲۲۰۰"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 text-sm ss02"
            />
          </div>

          <div>
            <label className="block text-white/80 mb-2 text-xs">
              آب هدف روزانه (میلی‌لیتر):
            </label>
            <input
              type="number"
              value={tempTargetWater}
              onChange={(e) => setTempTargetWater(e.target.value)}
              placeholder="مثال: ۲۵۰۰"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/50 text-sm ss02"
            />
          </div>

          <div className="border-t border-white/5 pt-4">
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">
              اهداف درشت‌مغذی‌ها:
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-purple-300 mb-1 text-[10px]">
                  پروتئین (g):
                </label>
                <input
                  type="number"
                  value={tempTargetProtein}
                  onChange={(e) => setTempTargetProtein(e.target.value)}
                  placeholder="140"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500/50 text-xs ss02"
                />
              </div>
              <div>
                <label className="block text-orange-300 mb-1 text-[10px]">
                  کربوهیدرات (g):
                </label>
                <input
                  type="number"
                  value={tempTargetCarbs}
                  onChange={(e) => setTempTargetCarbs(e.target.value)}
                  placeholder="240"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 text-xs ss02"
                />
              </div>
              <div>
                <label className="block text-yellow-300 mb-1 text-[10px]">
                  چربی (g):
                </label>
                <input
                  type="number"
                  value={tempTargetFat}
                  onChange={(e) => setTempTargetFat(e.target.value)}
                  placeholder="70"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-yellow-500/50 text-xs ss02"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6 pt-4 border-t border-white/5">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold py-2.5 rounded-xl shadow-lg transition-all cursor-pointer text-xs"
          >
            ثبت اهداف
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white py-2.5 rounded-xl transition-all cursor-pointer text-xs"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditTargetModal);
