import { Sparkles } from "lucide-react";
import type { WorkoutHeaderProps } from "@/types/workout";
import WorkoutDownloadButton from "./WorkoutDownloadButton";

export default function WorkoutHeader({
  workoutPlan,
  workoutDays,
}: WorkoutHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-2xl opacity-20" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            برنامه فعال شما
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-morabbaReg text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
            {workoutPlan.title}
          </h1>
          {workoutPlan.description && (
            <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
              {workoutPlan.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="text-gray-400">وضعیت برنامه:</span>
              <span className="font-semibold text-green-400">
                فعال و در حال اجرا
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5">
              <span className="text-gray-400">تعداد روزهای تمرین:</span>
              <span className="font-semibold text-purple-400">
                {/* {
                  workoutDays.filter(
                    (d) => d.exercises && d.exercises.length > 0,
                  ).length
                }{" "} */}
                روز در هفته
              </span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4 self-stretch md:self-auto justify-between md:justify-center">
          <WorkoutDownloadButton
            workoutPlan={workoutPlan}
            workoutDays={workoutDays}
          />
        </div>
      </div>
    </div>
  );
}
