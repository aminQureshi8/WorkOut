"use client";

import React, { useState, useEffect, useCallback } from "react";
import { showAlert, showConfirm } from "@/utils/alert";
import {
  Plus,
  Edit,
  Trash2,
  Dumbbell,
  Check,
  X,
  Clock,
  Play,
  Package,
  ListPlus,
  ChevronDown,
  Info,
} from "lucide-react";

import {
  PackageInfo,
  WorkoutPlan,
  WorkoutDay,
  VideoInfo,
  WorkoutExercise,
} from "@/types/workout";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import WorkoutDayForm from "./WorkoutDayForm";

export default function WorkoutsManagement() {
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(
    null,
  );
  const [videos, setVideos] = useState<VideoInfo[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [planForm, setPlanForm] = useState({ title: "", description: "" });
  const [isEditingPlanInfo, setIsEditingPlanInfo] = useState(false);
  const [showDayForm, setShowDayForm] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);

  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<WorkoutExercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    sets: 3,
    reps: "12-10-8",
    restSec: 60,
    videoId: "",
    videoId2: "",
    sortOrder: 0,
  });

  const [watchingVideo, setWatchingVideo] = useState<VideoInfo | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const pkgRes = await fetch("/api/admin/package");
        if (pkgRes.ok) {
          const pkgData = await pkgRes.json();
          setPackages(pkgData.packages || []);
        }

        const vidRes = await fetch("/api/admin/video");
        if (vidRes.ok) {
          const vidData = await vidRes.json();
          setVideos(vidData.videos || []);
        }
      } catch (err) {
        console.error("Failed to load initial packages/videos:", err);
      } finally {
        setLoadingPackages(false);
      }
    }
    loadData();
  }, []);

  const fetchDays = useCallback(async (planId: string) => {
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-days?planId=${planId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setWorkoutDays(data.days || []);
      }
    } catch (e) {
      console.error("Failed to fetch days:", e);
    }
  }, []);

  const fetchExercises = useCallback(async (dayId: string) => {
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-exercises?dayId=${dayId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises || []);
      }
    } catch (e) {
      console.error("Failed to fetch exercises:", e);
    }
  }, []);

  const handleSelectPackage = async (pkg: PackageInfo) => {
    setSelectedPackage(pkg);
    setWorkoutPlan(null);
    setWorkoutDays([]);
    setSelectedDay(null);
    setExercises([]);
    setLoadingPlan(true);

    try {
      const res = await fetch(
        `/api/admin/subscription/workout-plans?packageId=${pkg._id}`,
      );
      if (res.ok) {
        const data = await res.json();
        const plan = data.plans && data.plans.length > 0 ? data.plans[0] : null;
        if (plan) {
          setWorkoutPlan(plan);
          setPlanForm({
            title: plan.title,
            description: plan.description || "",
          });
          fetchDays(plan._id);
        } else {
          setPlanForm({ title: `برنامه تمرینی ${pkg.name}`, description: "" });
        }
      }
    } catch (err) {
      console.error("Failed to load plan:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage._id,
          title: planForm.title,
          description: planForm.description,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWorkoutPlan(data.plan);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت ایجاد شد", "success");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ایجاد برنامه", "error");
    }
  };

  const handleUpdatePlan = async () => {
    if (!workoutPlan) return;
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: workoutPlan._id,
          title: planForm.title,
          description: planForm.description,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWorkoutPlan(data.plan);
        setIsEditingPlanInfo(false);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت بروزرسانی شد", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlan = async () => {
    if (!workoutPlan) return;
    if (
      !(await showConfirm(
        "حذف برنامه تمرینی",
        "آیا از حذف کامل این برنامه تمرینی به همراه تمام روزها و حرکات آن اطمینان دارید؟",
      ))
    )
      return;
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-plans?id=${workoutPlan._id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        setWorkoutPlan(null);
        setWorkoutDays([]);
        setSelectedDay(null);
        setExercises([]);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت حذف شد", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDaySuccess = (updatedDay?: WorkoutDay) => {
    if (!workoutPlan) return;
    fetchDays(workoutPlan._id);
    setShowDayForm(false);
    setEditingDay(null);
    if (updatedDay && selectedDay?._id === updatedDay._id) {
      setSelectedDay(updatedDay);
    }
  };

  const handleDeleteDay = async (id: string) => {
    if (
      !(await showConfirm(
        "حذف روز تمرینی",
        "آیا از حذف این روز و تمامی حرکات ورزشی آن اطمینان دارید؟",
      ))
    )
      return;
    try {
      const res = await fetch(`/api/admin/subscription/workout-days?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (selectedDay?._id === id) {
          setSelectedDay(null);
          setExercises([]);
        }
        if (workoutPlan) fetchDays(workoutPlan._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;
    try {
      if (editingExercise) {
        const res = await fetch("/api/admin/subscription/workout-exercises", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingExercise._id,
            name: exerciseForm.name,
            sets: Number(exerciseForm.sets),
            reps: exerciseForm.reps,
            restSec: Number(exerciseForm.restSec),
            videoId: exerciseForm.videoId || null,
            videoId2: exerciseForm.videoId2 || null,
            sortOrder: Number(exerciseForm.sortOrder),
          }),
        });
        if (res.ok) {
          fetchExercises(selectedDay._id);
          setShowExerciseForm(false);
          setEditingExercise(null);
        }
      } else {
        const res = await fetch("/api/admin/subscription/workout-exercises", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dayId: selectedDay._id,
            name: exerciseForm.name,
            sets: Number(exerciseForm.sets),
            reps: exerciseForm.reps,
            restSec: Number(exerciseForm.restSec),
            videoId: exerciseForm.videoId || undefined,
            videoId2: exerciseForm.videoId2 || undefined,
            sortOrder: Number(exerciseForm.sortOrder),
          }),
        });
        if (res.ok) {
          fetchExercises(selectedDay._id);
          setShowExerciseForm(false);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExercise = async (id: string) => {
    if (
      !(await showConfirm(
        "حذف حرکت تمرینی",
        "آیا از حذف این حرکت تمرینی اطمینان دارید؟",
      ))
    )
      return;
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-exercises?id=${id}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        if (selectedDay) fetchExercises(selectedDay._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getVideoLevelLabel = (level?: string) => {
    if (!level) return "مبتدی";
    const labels: Record<string, string> = {
      beginner: "مبتدی",
      intermediate: "متوسط",
      advanced: "حرفه‌ای",
    };
    return labels[level] || level;
  };

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مدیریت برنامه‌های تمرینی
          </h1>
          <p className="text-white/60 text-sm">
            برنامه‌های ورزشی و حرکات هر پکیج اشتراک را طراحی، روزبندی و
            سازماندهی کنید.
          </p>
        </div>

        {loadingPackages ? (
          <div className="p-12 text-center text-white/50 bg-white/5 border border-white/10 rounded-xl">
            در حال بارگذاری اطلاعات اولیه...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-white font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-500" />
                انتخاب پکیج
              </h2>
              <div className="space-y-3">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?._id === pkg._id;
                  return (
                    <div
                      key={pkg._id}
                      onClick={() => handleSelectPackage(pkg)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 ${
                        isSelected
                          ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500 text-white shadow-lg shadow-orange-500/10"
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm">{pkg.name}</span>
                        <span className="text-[10px] text-white/50 opacity-80 ss02">
                          {pkg.slug}
                        </span>
                      </div>
                      <div className="text-xs text-white/60 line-clamp-1">
                        برای ویرایش برنامه‌های تمرینی کلیک کنید.
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-3">
              {!selectedPackage ? (
                <div className="h-64 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 text-center p-8 bg-white/5">
                  <Dumbbell className="w-16 h-16 mb-4 opacity-20 text-orange-500" />
                  <p className="font-semibold text-lg">
                    برای شروع، یک پکیج را از ستون سمت راست انتخاب کنید
                  </p>
                  <p className="text-sm text-white/50 mt-1">
                    شما می‌توانید برنامه‌های ورزشی هر پکیج را به صورت مجزا
                    مدیریت کنید.
                  </p>
                </div>
              ) : loadingPlan ? (
                <div className="h-64 border border-white/10 rounded-2xl flex items-center justify-center text-white/50 bg-white/5">
                  در حال بارگذاری برنامه تمرینی پکیج...
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-orange-500/5 to-pink-500/5">
                    <div>
                      <div className="text-xs text-orange-400 font-bold mb-1">
                        پکیج انتخاب شده
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {selectedPackage.name}
                      </h3>
                    </div>
                    {workoutPlan && (
                      <button
                        onClick={handleDeletePlan}
                        className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف کل برنامه تمرینی
                      </button>
                    )}
                  </div>

                  {!workoutPlan ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                      <Info className="w-10 h-10 text-orange-500/60 mx-auto mb-3" />
                      <h4 className="text-white font-bold text-lg mb-2">
                        برنامه تمرینی یافت نشد
                      </h4>
                      <p className="text-white/60 text-sm mb-6">
                        برنامه تمرینی برای پکیج {selectedPackage.name} تعریف
                        نشده است. لطفاً ابتدا عنوان و توضیحات را وارد کنید.
                      </p>
                      <form
                        onSubmit={handleCreatePlan}
                        className="max-w-xl mx-auto space-y-4 text-right"
                      >
                        <div>
                          <label className="block text-white/70 text-xs mb-2">
                            عنوان برنامه
                          </label>
                          <input
                            type="text"
                            value={planForm.title}
                            onChange={(e) =>
                              setPlanForm({
                                ...planForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
                            placeholder="مثال: برنامه سه‌روزه هایپرتروفی بسته پایه"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white/70 text-xs mb-2">
                            توضیحات کلی
                          </label>
                          <textarea
                            value={planForm.description}
                            onChange={(e) =>
                              setPlanForm({
                                ...planForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 resize-none h-24 text-sm"
                            placeholder="توضیحات مربوط به متد تمرین، دوره ریکاوری، تعداد روزها و..."
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm"
                        >
                          ایجاد برنامه تمرینی جدید
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                      {isEditingPlanInfo ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/70 text-xs mb-2">
                              عنوان برنامه
                            </label>
                            <input
                              type="text"
                              value={planForm.title}
                              onChange={(e) =>
                                setPlanForm({
                                  ...planForm,
                                  title: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-white/70 text-xs mb-2">
                              توضیحات
                            </label>
                            <textarea
                              value={planForm.description}
                              onChange={(e) =>
                                setPlanForm({
                                  ...planForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500 resize-none h-24"
                            />
                          </div>
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleUpdatePlan}
                              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs transition-colors"
                            >
                              ذخیره تغییرات
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingPlanInfo(false);
                                setPlanForm({
                                  title: workoutPlan.title,
                                  description: workoutPlan.description || "",
                                });
                              }}
                              className="bg-white/10 hover:bg-white/15 text-white px-5 py-2 rounded-lg text-xs transition-colors"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              {workoutPlan.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">
                              {workoutPlan.description || "بدون توضیحات اضافی"}
                            </p>
                          </div>
                          <button
                            onClick={() => setIsEditingPlanInfo(true)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-blue-400 p-2 rounded-lg transition-all"
                            title="ویرایش مشخصات برنامه"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {workoutPlan && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-bold text-sm">
                            روزهای تمرینی
                          </span>
                          <button
                            onClick={() => {
                              setEditingDay(null);
                              setShowDayForm(true);
                            }}
                            className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            روز جدید
                          </button>
                        </div>

                        {showDayForm && workoutPlan && (
                          <WorkoutDayForm
                            editingDay={editingDay}
                            workoutPlanId={workoutPlan._id}
                            onSuccess={handleDaySuccess}
                            onCancel={() => {
                              setShowDayForm(false);
                              setEditingDay(null);
                            }}
                            defaultSortOrder={workoutDays.length + 1}
                          />
                        )}

                        <div className="space-y-2 overflow-y-auto max-h-[400px]">
                          {workoutDays.length === 0 ? (
                            <div className="text-white/40 text-center text-xs p-8 border border-dashed border-white/10 rounded-xl">
                              هیچ روز تمرینی تعریف نشده است
                            </div>
                          ) : (
                            workoutDays.map((day) => {
                              const isSelected = selectedDay?._id === day._id;
                              return (
                                <div
                                  key={day._id}
                                  onClick={() => {
                                    setSelectedDay(day);
                                    setExercises([]);
                                    fetchExercises(day._id);
                                    setShowExerciseForm(false);
                                  }}
                                  className={`p-4 rounded-xl border text-right cursor-pointer transition-all flex items-center justify-between ${
                                    isSelected
                                      ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                                      : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                                  }`}
                                >
                                  <div>
                                    <div className="font-bold text-xs">
                                      {day.dayName}
                                    </div>
                                    <div
                                      className={`text-[10px] mt-1 ${
                                        isSelected
                                          ? "text-white/80"
                                          : "text-white/50"
                                      }`}
                                    >
                                      عضله هدف: {day.muscleGroup}
                                    </div>
                                  </div>
                                  <div
                                    className="flex gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        setEditingDay(day);
                                        setShowDayForm(true);
                                      }}
                                      className={`p-1.5 rounded transition-all ${
                                        isSelected
                                          ? "hover:bg-white/20 text-white"
                                          : "hover:bg-white/5 text-blue-400"
                                      }`}
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDay(day._id)}
                                      className={`p-1.5 rounded transition-all ${
                                        isSelected
                                          ? "hover:bg-white/20 text-white"
                                          : "hover:bg-white/5 text-red-400"
                                      }`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2 space-y-4">
                        {!selectedDay ? (
                          <div className="h-[300px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 p-8 text-center bg-white/5">
                            <Dumbbell className="w-10 h-10 mb-3 text-white/20" />
                            <p className="text-sm">
                              جهت مشاهده تمرینات، یک روز را انتخاب کنید
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/10 pb-3">
                              <div>
                                <span className="text-white font-bold text-sm block">
                                  حرکات ورزشی {selectedDay.dayName}
                                </span>
                                <span className="text-xs text-white/50">
                                  گروه هدف: {selectedDay.muscleGroup}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setEditingExercise(null);
                                  setExerciseForm({
                                    name: "",
                                    sets: 3,
                                    reps: "12-10-8",
                                    restSec: 60,
                                    videoId: "",
                                    videoId2: "",
                                    sortOrder: exercises.length + 1,
                                  });
                                  setShowExerciseForm(true);
                                }}
                                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                حرکت جدید
                              </button>
                            </div>

                            {showExerciseForm && (
                              <form
                                onSubmit={handleExerciseSubmit}
                                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-right"
                              >
                                <div className="text-white font-bold text-xs">
                                  {editingExercise
                                    ? "ویرایش حرکت ورزشی"
                                    : "ثبت حرکت ورزشی جدید"}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      نام حرکت
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="مثلا: جلو بازو دمبل تناوبی"
                                      value={exerciseForm.name}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          name: e.target.value,
                                        })
                                      }
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      ویدیو آموزشی ۱
                                    </label>
                                    <select
                                      value={exerciseForm.videoId}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          videoId: e.target.value,
                                        })
                                      }
                                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                    >
                                      <option value="">بدون ویدیو اول</option>
                                      {videos.map((vid) => (
                                        <option key={vid._id} value={vid._id}>
                                          {vid.title} (
                                          {getVideoLevelLabel(vid.level)})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      ویدیو آموزشی ۲ (اختیاری)
                                    </label>
                                    <select
                                      value={exerciseForm.videoId2}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          videoId2: e.target.value,
                                        })
                                      }
                                      className="w-full bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                    >
                                      <option value="">بدون ویدیو دوم</option>
                                      {videos.map((vid) => (
                                        <option key={vid._id} value={vid._id}>
                                          {vid.title} (
                                          {getVideoLevelLabel(vid.level)})
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      تعداد ست
                                    </label>
                                    <input
                                      type="number"
                                      value={exerciseForm.sets}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          sets: Number(e.target.value),
                                        })
                                      }
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      تعداد تکرار (رپس)
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="مثلا: 12-10-8"
                                      value={exerciseForm.reps}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          reps: e.target.value,
                                        })
                                      }
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      زمان استراحت (ثانیه)
                                    </label>
                                    <input
                                      type="number"
                                      value={exerciseForm.restSec}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          restSec: Number(e.target.value),
                                        })
                                      }
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-white/70 text-[10px] mb-1">
                                      ترتیب نمایش (Sort Order)
                                    </label>
                                    <input
                                      type="number"
                                      value={exerciseForm.sortOrder}
                                      onChange={(e) =>
                                        setExerciseForm({
                                          ...exerciseForm,
                                          sortOrder: Number(e.target.value),
                                        })
                                      }
                                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-1.5 rounded-lg text-xs transition-all"
                                  >
                                    {editingExercise
                                      ? "بروزرسانی حرکت"
                                      : "افزودن حرکت"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowExerciseForm(false);
                                      setEditingExercise(null);
                                    }}
                                    className="bg-white/10 hover:bg-white/15 text-white px-5 py-1.5 rounded-lg text-xs transition-all"
                                  >
                                    انصراف
                                  </button>
                                </div>
                              </form>
                            )}

                            <div className="space-y-3 overflow-y-auto max-h-[500px]">
                              {exercises.length === 0 ? (
                                <div className="text-white/40 text-center text-xs p-12 border border-dashed border-white/10 rounded-xl bg-white/5">
                                  حرکتی برای این روز ثبت نشده است.
                                </div>
                              ) : (
                                exercises.map((ex) => (
                                  <div
                                    key={ex._id}
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/10 transition-all"
                                  >
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-white text-sm">
                                          {ex.name}
                                        </span>
                                        <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 ss02">
                                          ترتیب: {ex.sortOrder}
                                        </span>
                                      </div>
                                      <div className="flex flex-wrap gap-4 text-xs text-white/60 pt-1">
                                        <span className="ss02">
                                          ست‌ها: {ex.sets}
                                        </span>
                                        <span className="ss02">
                                          تکرار: {ex.reps}
                                        </span>
                                        <span className="flex items-center gap-1 ss02">
                                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                                          استراحت: {ex.restSec} ثانیه
                                        </span>
                                        {ex.videoId && (
                                          <button
                                            onClick={() =>
                                              setWatchingVideo(ex.videoId!)
                                            }
                                            className="text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors cursor-pointer"
                                          >
                                            <Play className="w-3 h-3 fill-orange-400/20" />
                                            ویدیو ۱: {ex.videoId.title}
                                          </button>
                                        )}
                                        {ex.videoId2 && (
                                          <button
                                            onClick={() =>
                                              setWatchingVideo(ex.videoId2!)
                                            }
                                            className="text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors cursor-pointer"
                                          >
                                            <Play className="w-3 h-3 fill-pink-400/20" />
                                            ویدیو ۲: {ex.videoId2.title}
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingExercise(ex);
                                          setExerciseForm({
                                            name: ex.name,
                                            sets: ex.sets,
                                            reps: ex.reps,
                                            restSec: ex.restSec,
                                            videoId: ex.videoId?._id || "",
                                            videoId2: ex.videoId2?._id || "",
                                            sortOrder: ex.sortOrder,
                                          });
                                          setShowExerciseForm(true);
                                        }}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 text-blue-400 p-2 rounded-lg transition-all cursor-pointer"
                                        title="ویرایش"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDeleteExercise(ex._id)
                                        }
                                        className="bg-white/5 hover:bg-red-500/20 border border-white/10 text-red-400 p-2 rounded-lg transition-all cursor-pointer"
                                        title="حذف"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {watchingVideo && (
        <VideoPlayerModal
          video={watchingVideo}
          onClose={() => setWatchingVideo(null)}
        />
      )}
    </div>
  );
}
