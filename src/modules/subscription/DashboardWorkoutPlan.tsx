"use client";

import React, { useState } from "react";
import { Dumbbell, Calendar, Play, ChevronDown, ChevronUp, Film } from "lucide-react";

interface VideoInfo {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
}

interface ExerciseItem {
  _id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  videoId?: VideoInfo | null;
}

interface DayItem {
  _id: string;
  dayName: string;
  muscleGroup: string;
  exercises: ExerciseItem[];
}

interface WorkoutPlanProps {
  plan: {
    _id: string;
    title: string;
    description?: string;
  } | null;
  days: DayItem[];
}

export default function DashboardWorkoutPlan({ plan, days }: WorkoutPlanProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({
    [days[0]?._id]: true // default expand first day
  });
  const [activeVideo, setActiveVideo] = useState<VideoInfo | null>(null);

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  if (!plan) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-white/40">
        <Dumbbell className="w-10 h-10 mx-auto mb-3 text-white/20" />
        <p className="text-sm">برنامه تمرینی برای این اشتراک ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-2">
          <Dumbbell className="w-6 h-6 text-orange-500 animate-pulse" />
          <h3 className="text-lg font-bold text-white font-morabbaReg">{plan.title}</h3>
        </div>
        <p className="text-white/60 text-xs md:text-sm leading-relaxed">{plan.description || "بدون توضیحات"}</p>
      </div>

      {/* Days List Accordion */}
      <div className="space-y-4">
        {days.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl text-white/40">
            روزی برای این برنامه تعریف نشده است
          </div>
        ) : (
          days.map((day) => {
            const isExpanded = !!expandedDays[day._id];
            return (
              <div
                key={day._id}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-350"
              >
                {/* Header click */}
                <button
                  onClick={() => toggleDay(day._id)}
                  className="w-full text-right p-5 flex items-center justify-between hover:bg-white/3 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{day.dayName}</h4>
                      <p className="text-white/50 text-[10px] md:text-xs">عضله هدف: <strong className="text-white">{day.muscleGroup}</strong></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/70">
                      {day.exercises.length} حرکت
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/60" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/60" />
                    )}
                  </div>
                </button>

                {/* Exercises content */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-white/5 bg-black/10">
                    {day.exercises.length === 0 ? (
                      <div className="text-center py-6 text-white/30 text-xs">
                        امروز روز استراحت است.
                      </div>
                    ) : (
                      <div className="space-y-3 pt-4">
                        {day.exercises.map((ex) => (
                          <div
                            key={ex._id}
                            className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/5 transition-all"
                          >
                            <div>
                              <h5 className="text-white font-bold text-xs md:text-sm">{ex.name}</h5>
                              <div className="flex flex-wrap gap-x-3 gap-y-1 text-white/50 text-[10px] md:text-xs mt-1">
                                <span>ست‌ها: <strong className="text-white">{ex.sets}</strong></span>
                                <span>|</span>
                                <span>تکرارها: <strong className="text-white">{ex.reps}</strong></span>
                                <span>|</span>
                                <span>استراحت: <strong className="text-white">{ex.restSec} ثانیه</strong></span>
                              </div>
                            </div>
                            
                            {ex.videoId ? (
                              <button
                                onClick={() => setActiveVideo(ex.videoId!)}
                                className="w-full sm:w-auto bg-orange-500/10 hover:bg-orange-500/25 border border-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                تماشای ویدیو آموزشی
                              </button>
                            ) : (
                              <span className="text-[10px] text-white/20 italic">بدون ویدیو</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-950 border border-white/10 rounded-2xl overflow-hidden w-full max-w-3xl relative">
            <div className="p-4 bg-black/40 flex justify-between items-center text-white border-b border-white/10">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Film className="w-4 h-4 text-orange-500" />
                {activeVideo.title}
              </h3>
              <button
                onClick={() => setActiveVideo(null)}
                className="bg-white/10 text-white p-1 rounded-full hover:bg-white/20 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full bg-black relative flex items-center justify-center">
              <video
                src={activeVideo.url}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
            {activeVideo.description && (
              <div className="p-4 bg-white/5 text-white text-xs leading-relaxed max-h-24 overflow-y-auto">
                <p>{activeVideo.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
