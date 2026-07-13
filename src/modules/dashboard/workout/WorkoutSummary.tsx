import React from "react";

interface WorkoutSummaryProps {
  totalExercises: number;
}

export default function WorkoutSummary({ totalExercises }: WorkoutSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
      <h3 className="font-bold font-morabbaReg text-white text-base">
        خلاصه تمرین امروز
      </h3>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-[10px] text-gray-400 block">
            مدت تمرین تقریبی
          </span>
          <span className="text-sm font-bold text-purple-400 mt-1 block">
            {totalExercises * 10 || 30} دقیقه
          </span>
        </div>
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <span className="text-[10px] text-gray-400 block">
            تعداد حرکات
          </span>
          <span className="text-sm font-bold text-pink-400 mt-1 block">
            {totalExercises} حرکت
          </span>
        </div>
      </div>

      <div className="bg-white/3 p-3 rounded-xl border border-white/5 flex justify-between items-center text-xs">
        <span className="text-gray-400">شدت تمرین امروز:</span>
        <span className="font-bold text-orange-400">
          {totalExercises > 0 ? "متوسط مایل به بالا" : "ریکاوری"}
        </span>
      </div>
    </div>
  );
}
