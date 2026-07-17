"use client";

import { useEffect, useState } from "react";
import { Calendar, Flame, ChevronDown } from "lucide-react";
import WorkoutHeader from "./WorkoutHeader";
import ExercisesList from "./ExercisesList";
import WeeklyAdvice from "./WeeklyAdvice";
import WorkoutSummary from "./WorkoutSummary";
import WorkoutAchievements from "./WorkoutAchievements";
import type { DayItem, ExerciseItem } from "@/types/workout";

interface SimpleWeek {
  _id?: string;
  id?: string;
  title: string;
  days: DayItem[];
}

interface WorkoutViewProps {
  subscription?: {
    packageId?: {
      _id: string;
      name?: string;
      tagline?: string;
    };
  };
  userId?: string;
}

export default function WorkoutView({ subscription , userId }: WorkoutViewProps) {
  const [activeWeekIndex, setActiveWeekIndex] = useState("");
  const [activeDayIndex, setActiveDayIndex] = useState("");
  const [workoutWeek, setWorkoutWeek] = useState<SimpleWeek[]>([]);
  const [workoutDays, setWorkoutDays] = useState<DayItem[]>([]);
  const [workoutExercises, setWorkoutExercises] = useState<ExerciseItem[]>([]);

  useEffect(() => {
    const fetchWeeks = async () => {
      if (!subscription?.packageId?._id) return;
      try {
        const res = await fetch(
          `/api/admin/subscription/workout-week?packageId=${subscription.packageId._id}`,
        );
        if (res.ok) {
          const data = await res.json();
          const weeks = data.weeks || [];
          setWorkoutWeek(weeks);
          if (weeks.length > 0) {
            setActiveWeekIndex(weeks[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeeks();
  }, [subscription]);

  useEffect(() => {
    const fetchDays = async () => {
      if (!activeWeekIndex) return;
      try {
        const res = await fetch(
          `/api/admin/subscription/workout-days?planId=${activeWeekIndex}`,
        );
        if (res.ok) {
          const data = await res.json();
          const days = data.days || [];
          setWorkoutDays(days);
          if (days.length > 0) {
            setActiveDayIndex(days[0]._id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDays();
  }, [activeWeekIndex]);

  useEffect(() => {
    const fetchExcersice = async () => {
      if (!activeDayIndex) return;
      try {
        const res = await fetch(
          `/api/admin/subscription/workout-exercises?dayId=${activeDayIndex}`,
        );
        if (res.ok) {
          const data = await res.json();
          setWorkoutExercises(data.exercises || []);
          console.log(data.exercises);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchExcersice();
  }, [activeDayIndex]);

  if (workoutWeek.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-danaMed">
        <div className="text-center space-y-4">
          <Flame className="w-12 h-12 text-purple-500 animate-pulse mx-auto" />
          <p className="text-sm text-gray-400">
            در حال بارگذاری برنامه تمرینی...
          </p>
        </div>
      </div>
    );
  }

  const activeWeek =
    workoutWeek.find((w) => w._id === activeWeekIndex) || workoutWeek[0];
  const activeDay =
    workoutDays.find((d) => d._id === activeDayIndex) || workoutDays[0];

  const workoutPlan = {
    _id: "plan",
    packageId: subscription?.packageId?._id || "",
    title: subscription?.packageId?.name || "برنامه تمرینی من",
    description: activeWeek?.title || "",
    isActive: true,
  };

  const totalExercises = workoutExercises.length;
  const overallProgressPercent = 0;

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

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-bold font-morabbaReg text-gray-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>روزهای تمرینی هفته</span>
            </h2>
            <div className="relative w-full sm:w-48">
              <select
                value={activeWeekIndex}
                onChange={(e) => {
                  setActiveWeekIndex(e.target.value);
                  setActiveDayIndex("");
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-purple-500 transition-all appearance-none cursor-pointer text-right"
              >
                {workoutWeek.map((week, idx) => (
                  <option
                    key={idx}
                    value={week._id}
                    className="bg-gray-900 text-white"
                  >
                    هفته {week.title}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {workoutDays.map((day) => {
              const isActive = day._id === activeDayIndex;
              const isRest = !day.exercises || day.exercises.length === 0;
              return (
                <button
                  key={day._id}
                  onClick={() => {
                    setActiveDayIndex(day._id);
                  }}
                  className={`
                    flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all duration-200 border text-center
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
            {activeDay && (
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
                        تعداد حرکات
                      </div>
                      <div className="text-sm font-bold text-white">
                        {totalExercises} حرکت
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {totalExercises > 0 && activeDay ? (
              <ExercisesList
                exercises={workoutExercises}
                muscleGroup={activeDay.muscleGroup}
                userId={userId}
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
