"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, Dumbbell, AlertCircle, Play } from "lucide-react";
import {
  WorkoutPlan,
  WorkoutDay,
  WorkoutExercise,
  WorkoutPlanFormInputs,
  WorkoutDayFormInputs,
  WorkoutExerciseFormInputs,
  WorkoutPlanModalProps,
} from "@/types/workout";
import { showAlert, showConfirm } from "@/utils/alert";

export default function WorkoutPlanModal({
  selectedPackageForPlan,
  onClose,
  videos,
  setWatchingVideo,
}: WorkoutPlanModalProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  const [isEditingPlanInfo, setIsEditingPlanInfo] = useState(false);
  const [showDayForm, setShowDayForm] = useState(false);
  const [editingDay, setEditingDay] = useState<WorkoutDay | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] =
    useState<WorkoutExercise | null>(null);

  const {
    register: registerPlan,
    handleSubmit: handleSubmitPlan,
    reset: resetPlan,
  } = useForm<WorkoutPlanFormInputs>();

  const {
    register: registerDay,
    handleSubmit: handleSubmitDay,
    reset: resetDay,
  } = useForm<WorkoutDayFormInputs>();

  const {
    register: registerExercise,
    handleSubmit: handleSubmitExercise,
    reset: resetExercise,
  } = useForm<WorkoutExerciseFormInputs>();

  const getVideoLevelBadge = (level?: string) => {
    if (!level) return null;
    const styles: Record<string, string> = {
      beginner: "bg-green-500/20 text-green-400 border-green-500/30",
      intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      advanced: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    const labels: Record<string, string> = {
      beginner: "مبتدی",
      intermediate: "متوسط",
      advanced: "حرفه‌ای",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded border text-[10px] ${styles[level] || styles.beginner}`}
      >
        {labels[level]}
      </span>
    );
  };

  const fetchDays = async (planId: string) => {
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-days?planId=${planId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setWorkoutDays(data.days || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchInitialPlan = async () => {
      try {
        const res = await fetch(
          `/api/admin/subscription/workout-plans?packageId=${selectedPackageForPlan._id}`,
        );
        if (res.ok) {
          const data = await res.json();
          const plan = data.plans && data.plans.length > 0 ? data.plans[0] : null;
          if (plan) {
            setWorkoutPlan(plan);
            resetPlan({
              title: plan.title,
              description: plan.description || "",
            });
            fetchDays(plan._id);
          } else {
            setWorkoutPlan(null);
            setWorkoutDays([]);
            setSelectedDay(null);
            setExercises([]);
            resetPlan({
              title: `برنامه تمرینی ${selectedPackageForPlan.name}`,
              description: "",
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchInitialPlan();
  }, [selectedPackageForPlan]);

  const handleCreatePlan = async (data: WorkoutPlanFormInputs) => {
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackageForPlan._id,
          title: data.title,
          description: data.description,
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        setWorkoutPlan(resData.plan);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت ایجاد شد", "success");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ایجاد برنامه", "error");
    }
  };

  const handleUpdatePlan = async (data: WorkoutPlanFormInputs) => {
    if (!workoutPlan) return;
    try {
      const res = await fetch("/api/admin/subscription/workout-plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: workoutPlan._id,
          title: data.title,
          description: data.description,
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        setWorkoutPlan(resData.plan);
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


  const handleDaySubmit = async (data: WorkoutDayFormInputs) => {
    if (!workoutPlan) return;
    if (!data.dayName?.trim() || !data.muscleGroup?.trim()) {
      showAlert("خطا", "پر کردن نام روز و گروه عضلانی الزامی است.", "error");
      return;
    }
    try {
      if (editingDay) {
        const res = await fetch("/api/admin/subscription/workout-days", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingDay._id,
            dayName: data.dayName,
            muscleGroup: data.muscleGroup,
            sortOrder: Number(data.sortOrder),
          }),
        });
        if (res.ok) {
          fetchDays(workoutPlan._id);
          setShowDayForm(false);
          setEditingDay(null);
          if (selectedDay?._id === editingDay._id) {
            setSelectedDay({
              ...selectedDay,
              dayName: data.dayName,
              muscleGroup: data.muscleGroup,
              sortOrder: Number(data.sortOrder),
            });
          }
        }
      } else {
        const res = await fetch("/api/admin/subscription/workout-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: workoutPlan._id,
            dayName: data.dayName,
            muscleGroup: data.muscleGroup,
            sortOrder: Number(data.sortOrder),
          }),
        });
        if (res.ok) {
          fetchDays(workoutPlan._id);
          setShowDayForm(false);
        }
      }
    } catch (e) {
      console.error(e);
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

  const fetchExercises = async (dayId: string) => {
    try {
      const res = await fetch(
        `/api/admin/subscription/workout-exercises?dayId=${dayId}`,
      );
      if (res.ok) {
        const data = await res.json();
        setExercises(data.exercises || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExerciseSubmit = async (data: WorkoutExerciseFormInputs) => {
    if (!selectedDay) return;
    try {
      if (editingExercise) {
        const res = await fetch("/api/admin/subscription/workout-exercises", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingExercise._id,
            name: data.name,
            sets: Number(data.sets),
            reps: data.reps,
            restSec: Number(data.restSec),
            videoId: data.videoId || null,
            videoId2: data.videoId2 || null,
            sortOrder: Number(data.sortOrder),
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
            name: data.name,
            sets: Number(data.sets),
            reps: data.reps,
            restSec: Number(data.restSec),
            videoId: data.videoId || undefined,
            videoId2: data.videoId2 || undefined,
            sortOrder: Number(data.sortOrder),
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

  const handleStartEditPlan = () => {
    if (workoutPlan) {
      resetPlan({
        title: workoutPlan.title,
        description: workoutPlan.description || "",
      });
      setIsEditingPlanInfo(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-955 border border-white/10 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div>
            <span className="text-xs text-orange-400 font-bold bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              پکیج: {selectedPackageForPlan.name}
            </span>
            <h2 className="text-2xl text-white font-bold mt-2 font-morabbaReg">
              مدیریت برنامه تمرینی
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-white/5 hover:bg-white/10 text-white/80 p-2 rounded-lg transition-colors border border-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="w-full lg:w-80 flex flex-col gap-4 border-l border-white/10 pl-0 lg:pl-6">
            {!workoutPlan ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white/60 text-sm mb-4">
                  برنامه تمرینی برای این پکیج ثبت نشده است.
                </p>
                <form
                  onSubmit={handleSubmitPlan(handleCreatePlan)}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    {...registerPlan("title", { required: true })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-orange-500"
                    placeholder="عنوان برنامه..."
                    required
                  />
                  <textarea
                    {...registerPlan("description")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-orange-500 resize-none h-16"
                    placeholder="توضیحات برنامه..."
                  />
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-xs cursor-pointer"
                  >
                    ایجاد برنامه تمرینی
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
                {isEditingPlanInfo ? (
                  <form
                    onSubmit={handleSubmitPlan(handleUpdatePlan)}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      {...registerPlan("title", { required: true })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500"
                      required
                    />
                    <textarea
                      {...registerPlan("description")}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-orange-500 resize-none h-16"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-500 text-white py-1 rounded text-xs hover:bg-green-600 cursor-pointer"
                      >
                        ذخیره
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingPlanInfo(false)}
                        className="flex-1 bg-white/5 border border-white/10 text-white py-1 rounded text-xs cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-bold text-sm truncate pr-16">
                        {workoutPlan.title}
                      </h3>
                      <div className="absolute top-4 left-4 flex gap-1">
                        <button
                          onClick={handleStartEditPlan}
                          className="text-blue-400 hover:bg-blue-500/15 p-1 rounded cursor-pointer"
                          title="ویرایش توضیحات برنامه"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleDeletePlan}
                          className="text-red-400 hover:bg-red-500/15 p-1 rounded cursor-pointer"
                          title="حذف برنامه تمرینی"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">
                      {workoutPlan.description || "بدون توضیحات"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {workoutPlan && (
              <div className="flex-1 flex flex-col min-h-[300px]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-bold text-sm">
                    روزهای تمرین
                  </span>
                  <button
                    onClick={() => {
                      setEditingDay(null);
                      resetDay({
                        dayName: `روز ${workoutDays.length + 1}`,
                        muscleGroup: "",
                        sortOrder: workoutDays.length + 1,
                      });
                      setShowDayForm(true);
                    }}
                    className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    روز جدید
                  </button>
                </div>

                {showDayForm && (
                  <form
                    onSubmit={handleSubmitDay(handleDaySubmit)}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 mb-3 space-y-2.5"
                  >
                    <div className="text-white font-bold text-xs">
                      {editingDay ? "ویرایش روز تمرین" : "ثبت روز جدید"}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="نام روز (سینه / سرشانه / ...)"
                        {...registerDay("dayName", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="گروه عضلانی (مثلا: سینه، سرشانه، پا)"
                        {...registerDay("muscleGroup", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="ترتیب نمایش"
                        {...registerDay("sortOrder", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 rounded text-xs cursor-pointer"
                      >
                        {editingDay ? "بروزرسانی" : "افزودن"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowDayForm(false);
                          setEditingDay(null);
                        }}
                        className="flex-1 bg-white/10 hover:bg-white/15 text-white py-1 rounded text-xs cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2 overflow-y-auto max-h-[350px]">
                  {workoutDays.length === 0 ? (
                    <div className="text-white/40 text-center text-xs p-6 border border-dashed border-white/10 rounded-lg">
                      روزی ثبت نشده است
                    </div>
                  ) : (
                    workoutDays.map((day) => (
                      <div
                        key={day._id}
                        onClick={() => {
                          setSelectedDay(day);
                          setExercises([]);
                          fetchExercises(day._id);
                          setShowExerciseForm(false);
                        }}
                        className={`p-3 rounded-lg border text-right cursor-pointer transition-all flex items-center justify-between ${
                          selectedDay?._id === day._id
                            ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                            : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs">
                            {day.dayName}
                          </div>
                          <div
                            className={`text-[10px] ${selectedDay?._id === day._id ? "text-white/80" : "text-white/50"}`}
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
                              resetDay({
                                dayName: day.dayName,
                                muscleGroup: day.muscleGroup,
                                sortOrder: day.sortOrder,
                              });
                              setShowDayForm(true);
                            }}
                            className={`p-1 rounded cursor-pointer ${selectedDay?._id === day._id ? "hover:bg-white/20 text-white" : "hover:bg-white/5 text-blue-400"}`}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDay(day._id)}
                            className={`p-1 rounded cursor-pointer ${selectedDay?._id === day._id ? "hover:bg-white/20 text-white" : "hover:bg-white/5 text-red-400"}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            {!selectedDay ? (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-8 text-center text-white/40">
                <Dumbbell className="w-12 h-12 mb-3 text-white/20" />
                <p className="text-sm">
                  برای مدیریت و مشاهده تمرینات، یک روز را از ستون کناری انتخاب
                  کنید
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-white font-bold text-sm block">
                      تمرین‌های {selectedDay.dayName}
                    </span>
                    <span className="text-xs text-white/50">
                      گروه هدف: {selectedDay.muscleGroup}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingExercise(null);
                      resetExercise({
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
                    className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    حرکت تمرینی جدید
                  </button>
                </div>

                {showExerciseForm && (
                  <form
                    onSubmit={handleSubmitExercise(handleExerciseSubmit)}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 space-y-3"
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
                          placeholder="مثلا: نشر جانب دمبل ایستاده"
                          {...registerExercise("name", { required: true })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          ویدیو آموزشی ۱
                        </label>
                        <select
                          {...registerExercise("videoId")}
                          className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="">بدون ویدیو اول</option>
                          {videos.map((vid) => (
                            <option key={vid._id} value={vid._id}>
                              {vid.title} (
                              {getVideoLevelBadge(vid.level)?.props.children ||
                                "مبتدی"}
                              )
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          ویدیو آموزشی ۲ (اختیاری)
                        </label>
                        <select
                          {...registerExercise("videoId2")}
                          className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="">بدون ویدیو دوم</option>
                          {videos.map((vid) => (
                            <option key={vid._id} value={vid._id}>
                              {vid.title} (
                              {getVideoLevelBadge(vid.level)?.props.children ||
                                "مبتدی"}
                              )
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          تعداد ست
                        </label>
                        <input
                          type="number"
                          placeholder="۳"
                          {...registerExercise("sets", {
                            required: true,
                            min: 1,
                          })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          تعداد تکرار
                        </label>
                        <input
                          type="text"
                          placeholder="12-10-8 یا ۱۲"
                          {...registerExercise("reps", { required: true })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          استراحت (ثانیه)
                        </label>
                        <input
                          type="number"
                          placeholder="۶۰"
                          {...registerExercise("restSec", {
                            required: true,
                            min: 0,
                          })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-[10px] mb-1">
                          ترتیب نمایش
                        </label>
                        <input
                          type="number"
                          {...registerExercise("sortOrder", { required: true })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        {editingExercise ? "ثبت تغییرات" : "افزودن به برنامه"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowExerciseForm(false);
                          setEditingExercise(null);
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-5 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex-1 overflow-y-auto max-h-[450px] space-y-3">
                  {exercises.length === 0 ? (
                    <div className="text-white/40 text-center text-xs p-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-white/20 mb-2" />
                      هنوز حرکتی برای این روز ثبت نشده است. با زدن دکمه «حرکت
                      تمرینی جدید» اضافه کنید.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {exercises.map((ex) => (
                        <div
                          key={ex._id}
                          className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-white/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center font-bold text-sm">
                              {ex.sortOrder}
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-sm">
                                {ex.name}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/50 text-[10px] mt-1">
                                <span>
                                  ست‌ها:{" "}
                                  <strong className="text-white">
                                    {ex.sets}
                                  </strong>
                                </span>
                                <span>|</span>
                                <span>
                                  تکرارها:{" "}
                                  <strong className="text-white">
                                    {ex.reps}
                                  </strong>
                                </span>
                                <span>|</span>
                                <span>
                                  استراحت:{" "}
                                  <strong className="text-white">
                                    {ex.restSec} ثانیه
                                  </strong>
                                </span>
                                {ex.videoId && (
                                  <>
                                    <span>|</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (ex.videoId) {
                                          setWatchingVideo(ex.videoId);
                                        }
                                      }}
                                      className="text-orange-400 hover:text-orange-300 flex items-center gap-0.5 font-semibold cursor-pointer"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      ویدیو ۱: {ex.videoId.title}
                                    </button>
                                  </>
                                )}
                                {ex.videoId2 && (
                                  <>
                                    <span>|</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (ex.videoId2) {
                                          setWatchingVideo(ex.videoId2);
                                        }
                                      }}
                                      className="text-pink-400 hover:text-pink-300 flex items-center gap-0.5 font-semibold cursor-pointer"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      ویدیو ۲: {ex.videoId2.title}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto justify-end border-t border-white/5 pt-2.5 md:pt-0 md:border-0">
                            <button
                              onClick={() => {
                                setEditingExercise(ex);
                                resetExercise({
                                  name: ex.name,
                                  sets: ex.sets,
                                  reps: ex.reps,
                                  restSec: ex.restSec,
                                  videoId: ex.videoId ? ex.videoId._id : "",
                                  videoId2: ex.videoId2 ? ex.videoId2._id : "",
                                  sortOrder: ex.sortOrder,
                                });
                                setShowExerciseForm(true);
                              }}
                              className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteExercise(ex._id)}
                              className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="حذف حرکت"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
