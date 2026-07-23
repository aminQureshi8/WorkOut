import React from "react";
import { Droplet, Plus } from "lucide-react";
import { BeatLoader } from "react-spinners";
import type { WaterTrackerProps } from "@/types/nutrition";

const WaterTracker: React.FC<WaterTrackerProps> = ({
  selectedDate,
  targetWater,
  waterIntake,
  onWaterChange,
  isLoading,
}) => {
  const currentWater = waterIntake;
  const waterPercent = Math.min(
    100,
    Math.round((currentWater / targetWater) * 100)
  );

  const handleAddWater = async (amount: number) => {
    if (isLoading) return;
    const previousAmount = currentWater;
    const newAmount = Math.min(4000, currentWater + amount);
    onWaterChange(newAmount);

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          waterIntake: newAmount,
        }),
      });
      if (!res.ok) {
        onWaterChange(previousAmount);
      }
    } catch {
      onWaterChange(previousAmount);
    }
  };

  const handleResetWater = async () => {
    if (isLoading) return;
    const previousAmount = currentWater;
    onWaterChange(0);

    try {
      const res = await fetch("/api/nutrition", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          waterIntake: 0,
        }),
      });
      if (!res.ok) {
        onWaterChange(previousAmount);
      }
    } catch {
      onWaterChange(previousAmount);
    }
  };

  return (
    <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
      <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl -z-10" />

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base sm:text-lg text-white font-bold flex items-center gap-2">
            <Droplet className="w-5 h-5 text-blue-400" />
            مصرف آب روزانه
          </h3>
          <p className="text-white/50 text-[10px] sm:text-xs mt-1">
            پیشرفت تا هیدراتاسیون کامل بدن
          </p>
        </div>
        <button
          onClick={handleResetWater}
          disabled={isLoading}
          className="text-[10px] text-red-400 hover:bg-red-500/10 px-2 py-1 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          صفر کردن
        </button>
      </div>

      <div className="text-center my-4 h-[40px] flex items-center justify-center gap-1">
        {isLoading ? (
          <BeatLoader color="#60a5fa" size={8} />
        ) : (
          <>
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 ss02">
              {currentWater}
            </span>
            <span className="text-white/40 text-[10px] sm:text-xs mr-1 ss02">
              / {targetWater} میلی‌لیتر
            </span>
          </>
        )}
      </div>

      <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-500 bg-gradient-to-l from-blue-600 to-teal-400"
          style={{ width: `${waterPercent}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          onClick={() => handleAddWater(250)}
          disabled={isLoading}
          className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-medium py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 text-[10px] sm:text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden sm:inline ss02">۲۵۰ میلی‌لیتر (۱ لیوان)</span>
          <span className="sm:hidden ss02">۲۵0 میلی‌لیتر</span>
        </button>
        <button
          onClick={() => handleAddWater(500)}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white font-medium py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 text-[10px] sm:text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="hidden sm:inline ss02">۵۰۰ میلی‌لیتر (بطری)</span>
          <span className="sm:hidden ss02">۵۰۰ میلی‌لیتر</span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(WaterTracker);
