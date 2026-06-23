import React from "react";
import { Droplet, Plus } from "lucide-react";
import type { WaterTrackerProps } from "@/types/nutrition";

const WaterTracker: React.FC<WaterTrackerProps> = ({
  currentWater,
  targetWater,
  waterPercent,
  onAddWater,
  onResetWater,
}) => {
  return (
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
          onClick={onResetWater}
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
          onClick={() => onAddWater(250)}
          className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ۲۵۰ میلی‌لیتر (۱ لیوان)
        </button>
        <button
          onClick={() => onAddWater(500)}
          className="bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          ۵۰۰ میلی‌لیتر (بطری)
        </button>
      </div>
    </div>
  );
};

export default React.memo(WaterTracker);
