"use client";
import React, { useState } from "react";
import { Calendar, Flame } from "lucide-react";
import { DayItem, WorkoutPlan } from "@/types/workout";
import NoWorkoutPlan from "./NoWorkoutPlan";
import WorkoutHeader from "./WorkoutHeader";
import ExercisesList from "./ExercisesList";
import WeeklyAdvice from "./WeeklyAdvice";
import WorkoutSummary from "./WorkoutSummary";
import WorkoutAchievements from "./WorkoutAchievements";

interface WorkoutViewProps {
  workoutPlan: WorkoutPlan | null;
  workoutDays: DayItem[];
}

export default function WorkoutView({
  workoutPlan,
  workoutDays,
}: WorkoutViewProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<
    Record<string, boolean>
  >({});

  if (!workoutPlan || !workoutDays || workoutDays.length === 0) {
    return <NoWorkoutPlan />;
  }

  const activeDay = workoutDays[activeDayIndex] || workoutDays[0];

  const toggleExercise = (id: string) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalExercises = activeDay?.exercises?.length || 0;
  const completedCount =
    activeDay?.exercises?.filter((ex) => completedExercises[ex._id]).length ||
    0;
  const dayProgressPercent =
    totalExercises > 0
      ? Math.round((completedCount / totalExercises) * 100)
      : 0;

  const allExercises = workoutDays.flatMap((d) => d.exercises || []);
  const overallTotal = allExercises.length;
  const overallCompleted = allExercises.filter(
    (ex) => completedExercises[ex._id],
  ).length;
  const overallProgressPercent =
    overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  return (
    <div className="min-h-screen text-white font-danaMed pb-12 bg-gray-950">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/20 via-pink-900/5 to-transparent -z-10" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-80 left-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-8 space-y-8">
        <WorkoutHeader
          workoutPlan={workoutPlan}
          workoutDays={workoutDays}
          overallProgressPercent={overallProgressPercent}
        />

        <div className="space-y-3">
          <h2 className="text-lg font-bold font-morabbaReg text-gray-300 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>روزهای تمرینی هفته</span>
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {workoutDays.map((day, index) => {
              const isActive = index === activeDayIndex;
              const isRest = !day.exercises || day.exercises.length === 0;
              return (
                <button
                  key={day._id}
                  onClick={() => {
                    setActiveDayIndex(index);
                  }}
                  className={`
                    flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 border text-center
                    ${
                      isActive
                        ? "bg-gradient-to-b from-purple-600/30 to-pink-600/30 border-purple-500 text-white shadow-lg"
                        : "bg-white/5 hover:bg-white/8 border-white/5 text-gray-400 hover:text-white"
                    }
                  `}
                >
                  <span className="text-sm font-bold">{day.dayName}</span>
                  <span className="text-[10px] mt-1 opacity-70 truncate max-w-full">
                    {isRest ? "ریکاوری" : day.muscleGroup}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/3 border border-white/5 p-5 rounded-2xl">
              <div>
                <span className="text-xs text-purple-400 font-semibold">
                  {activeDay.dayName} - تمرین امروز
                </span>
                <h3 className="text-xl font-bold font-morabbaReg text-white mt-1">
                  {activeDay.muscleGroup}
                </h3>
              </div>

              {totalExercises > 0 && (
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-none text-right">
                    <div className="text-[10px] text-gray-400">
                      انجام شده در این روز
                    </div>
                    <div className="text-sm font-bold text-white">
                      {completedCount} از {totalExercises} حرکت
                    </div>
                  </div>
                  <div className="w-16 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-300"
                      style={{ width: `${dayProgressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {totalExercises > 0 ? (
              <ExercisesList
                exercises={activeDay.exercises}
                muscleGroup={activeDay.muscleGroup}
                completedExercises={completedExercises}
                toggleExercise={toggleExercise}
              />
            ) : (
              <div className="rounded-3xl border border-white/5 bg-white/3 p-8 text-center space-y-6 shadow-xl py-16">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
                  <Flame className="w-10 h-10 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold font-morabbaReg text-white">
                    امروز روز استراحت و ریکاوری است
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    رشد واقعی در دوران استراحت اتفاق می‌افتد. برای این روز تمرین
                    با وزنه تجویز نشده است. سعی کنید روی تغذیه مناسب، نوشیدن آب
                    کافی، و رهاسازی عضلانی (فوم رولر) تمرکز کنید.
                  </p>
                </div>
                <div className="flex justify-center gap-4 pt-2">
                  <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 text-center w-36">
                    <span className="text-[10px] text-gray-500 block">
                      مدت استراحت
                    </span>
                    <span className="text-sm font-bold text-white mt-1 block">
                      ۲۴ ساعت
                    </span>
                  </div>
                  <div className="bg-white/5 px-4 py-3 rounded-2xl border border-white/5 text-center w-36">
                    <span className="text-[10px] text-gray-500 block">
                      هدف امروز
                    </span>
                    <span className="text-sm font-bold text-green-400 mt-1 block">
                      ریکاوری عضلانی
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <WorkoutSummary totalExercises={totalExercises} />
            <WeeklyAdvice />
            <WorkoutAchievements />
          </div>
        </div>
      </div>
    </div>
  );
}
