"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Activity,
  Target,
  Dumbbell,
  Scale,
  Camera,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
  Smile,
  Heart,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { showAlert } from "@/utils/alert";

interface FormInputs {
  goal: "weight_loss" | "muscle_gain" | "endurance" | "general_fitness" | "rehabilitation";
  sessionsPerWeek: number;
  equipment: "none" | "home_basic" | "gym_full";
  trainingExperience: "beginner" | "intermediate" | "advanced";
  ageYears: number;
  heightCm: number;
  weightKg: number;
  bodyPhotos: string[];
  notes: string;
}

export default function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingExisting, setCheckingExisting] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      goal: "general_fitness",
      sessionsPerWeek: 3,
      equipment: "none",
      trainingExperience: "beginner",
      ageYears: 25,
      heightCm: 175,
      weightKg: 70,
      bodyPhotos: [],
      notes: "",
    },
  });

  const watchedGoal = watch("goal");
  const watchedExperience = watch("trainingExperience");
  const watchedEquipment = watch("equipment");
  const watchedSessions = watch("sessionsPerWeek");
  const watchedPhotos = watch("bodyPhotos") || [];

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/fitness-profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const p = data.profile;
            setValue("goal", p.goal);
            setValue("sessionsPerWeek", p.sessionsPerWeek);
            setValue("equipment", p.equipment);
            setValue("trainingExperience", p.trainingExperience);
            setValue("ageYears", p.ageYears);
            setValue("heightCm", p.heightCm);
            setValue("weightKg", p.weightKg);
            setValue("bodyPhotos", p.bodyPhotos || []);
            setValue("notes", p.notes || "");
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingExisting(false);
      }
    }
    loadProfile();
  }, [setValue]);

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof FormInputs> = [];
    if (step === 1) {
      fieldsToValidate = ["goal", "trainingExperience"];
    } else if (step === 2) {
      fieldsToValidate = ["sessionsPerWeek", "equipment"];
    } else if (step === 3) {
      fieldsToValidate = ["ageYears", "heightCm", "weightKg"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64String = event.target.result as string;
            setValue("bodyPhotos", [...watchedPhotos, base64String]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    const updated = watchedPhotos.filter((_, i) => i !== index);
    setValue("bodyPhotos", updated);
  };

  const onSubmit = async (data: FormInputs) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/fitness-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در ثبت اطلاعات");
      }

      await showAlert({
        title: "موفقیت‌آمیز",
        text: "پروفایل ورزشی شما با موفقیت ایجاد شد! در حال انتقال به داشبورد...",
        icon: "success",
      });

      router.push("/dashboard");
    } catch (err: any) {
      showAlert({
        title: "خطا",
        text: err.message || "خطایی در ذخیره اطلاعات رخ داد.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingExisting) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-white/60">در حال بررسی اطلاعات...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-400 mb-4">
          <Activity className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white" style={{ fontFamily: "Marbeh, sans-serif" }}>
          به فیت‌کوچ خوش آمدید
        </h2>
        <p className="mt-2 text-sm text-white/60 max-w-sm mx-auto">
          برای طراحی برنامه ورزشی شخصی‌سازی شده، لطفاً فرم زیر را تکمیل کنید.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-10 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />

          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 text-xs sm:text-sm text-white/40">
            <span className={step >= 1 ? "text-purple-400 font-bold" : ""}>۱. اهداف</span>
            <ChevronLeft className="w-4 h-4" />
            <span className={step >= 2 ? "text-purple-400 font-bold" : ""}>۲. تمرین و تجهیزات</span>
            <ChevronLeft className="w-4 h-4" />
            <span className={step >= 3 ? "text-purple-400 font-bold" : ""}>۳. فیزیک بدن</span>
            <ChevronLeft className="w-4 h-4" />
            <span className={step >= 4 ? "text-purple-400 font-bold" : ""}>۴. تصاویر</span>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
                e.preventDefault();
                if (step < 4) {
                  handleNext();
                }
              }
            }}
            className="space-y-6"
          >
            {step === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-white/80 font-medium mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-400" />
                    هدف اصلی شما از ورزش چیست؟
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { val: "weight_loss", label: "کاهش وزن و چربی‌سوزی", icon: TrendingUp },
                      { val: "muscle_gain", label: "عضله‌سازی و افزایش حجم", icon: Dumbbell },
                      { val: "endurance", label: "افزایش استقامت و کاردیو", icon: Zap },
                      { val: "general_fitness", label: "آمادگی جسمانی عمومی", icon: Award },
                      { val: "rehabilitation", label: "توان‌بخشی و بهبود آسیب", icon: Heart },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setValue("goal", item.val as any)}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-right transition-all duration-200 cursor-pointer ${
                            watchedGoal === item.val
                              ? "bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${watchedGoal === item.val ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-white/40"}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-sm">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-4">سابقه ورزشی شما چقدر است؟</label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { val: "beginner", label: "مبتدی", desc: "زیر ۶ ماه" },
                      { val: "intermediate", label: "متوسط", desc: "۶ تا ۲۴ ماه" },
                      { val: "advanced", label: "حرفه‌ای", desc: "بیش از ۲ سال" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setValue("trainingExperience", item.val as any)}
                        className={`p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                          watchedExperience === item.val
                            ? "bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <span className="font-semibold text-sm mb-1">{item.label}</span>
                        <span className="text-[10px] text-white/40">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-white/80 font-medium mb-4">چند جلسه در هفته می‌خواهید تمرین کنید؟</label>
                  <div className="flex justify-between gap-2 max-w-md mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setValue("sessionsPerWeek", num)}
                        className={`w-12 h-12 rounded-full border flex items-center justify-center font-bold font-sans transition-all duration-200 cursor-pointer ${
                          watchedSessions === num
                            ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/20 scale-110"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-xs text-white/40 mt-3">تعداد پیشنهادی معمولاً ۳ الی ۵ جلسه است.</p>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-purple-400" />
                    تجهیزات ورزشی در دسترس شما
                  </label>
                  <div className="space-y-3">
                    {[
                      { val: "none", label: "بدون تجهیزات (فقط وزن بدن)", desc: "مناسب برای تمرین در خانه بدون وسیله" },
                      { val: "home_basic", label: "تجهیزات پایه خانگی", desc: "دمبل، کش ورزشی، مت یا ملزومات ساده" },
                      { val: "gym_full", label: "باشگاه ورزشی مجهز", desc: "دسترسی کامل به دستگاه‌ها و هالترها" },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setValue("equipment", item.val as any)}
                        className={`w-full p-4 rounded-xl border text-right transition-all duration-200 cursor-pointer flex items-center justify-between ${
                          watchedEquipment === item.val
                            ? "bg-purple-500/20 border-purple-500 text-white"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <span className="block font-semibold text-sm mb-1">{item.label}</span>
                          <span className="block text-xs text-white/40">{item.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white/80 font-medium mb-2">سن (سال)</label>
                    <input
                      type="number"
                      {...register("ageYears", { required: true, min: 10, max: 100 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 text-left font-sans"
                    />
                    {errors.ageYears && <p className="text-red-400 text-xs mt-1">سن نامعتبر است</p>}
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2">قد (سانتی‌متر)</label>
                    <input
                      type="number"
                      {...register("heightCm", { required: true, min: 100, max: 250 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 text-left font-sans"
                    />
                    {errors.heightCm && <p className="text-red-400 text-xs mt-1">قد نامعتبر است</p>}
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-2 flex items-center gap-1.5 justify-end sm:justify-start">
                      <Scale className="w-4 h-4 text-purple-400" />
                      وزن (کیلوگرم)
                    </label>
                    <input
                      type="number"
                      {...register("weightKg", { required: true, min: 30, max: 250 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 text-left font-sans"
                    />
                    {errors.weightKg && <p className="text-red-400 text-xs mt-1">وزن نامعتبر است</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-400" />
                    تصاویر وضعیت فیزیکی شما (اختیاری)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {watchedPhotos.map((photo, index) => (
                      <div key={index} className="relative aspect-square border border-white/10 rounded-xl overflow-hidden group">
                        <img src={photo} alt="Physical state" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>
                    ))}
                    {watchedPhotos.length < 4 && (
                      <label className="aspect-square border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 hover:bg-white/5 transition-all">
                        <Plus className="w-6 h-6 text-white/40 mb-2" />
                        <span className="text-xs text-white/40">افزودن تصویر</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">
                    بارگذاری تصویر از نمای جلو، پشت یا پهلو به مربی در جهت شناخت فرم بدنی شما کمک شایانی می‌کند.
                  </p>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-2">یادداشت‌های اضافی برای مربی (اختیاری)</label>
                  <textarea
                    rows={3}
                    {...register("notes")}
                    placeholder="اگر آسیب‌دیدگی قبلی، بیماری خاص یا نکته ورزشی مهمی دارید در این قسمت بنویسید..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 resize-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={loading}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                  مرحله قبلی
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  مرحله بعدی
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-purple-500/10 transition-all cursor-pointer hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      در حال ثبت...
                    </>
                  ) : (
                    <>
                      ثبت و شروع تمرین
                      <Smile className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
