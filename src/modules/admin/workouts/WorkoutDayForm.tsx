"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { WorkoutDayFormProps, WorkoutDayFormInputs, WorkoutDay } from "@/types/workout";

export default function WorkoutDayForm({
  editingDay,
  workoutPlanId,
  onSuccess,
  onCancel,
  defaultSortOrder,
}: WorkoutDayFormProps) {
  const { register, handleSubmit, reset } = useForm<WorkoutDayFormInputs>();

  useEffect(() => {
    if (editingDay) {
      reset({
        dayName: editingDay.dayName,
        muscleGroup: editingDay.muscleGroup,
        sortOrder: editingDay.sortOrder,
      });
    } else {
      reset({
        dayName: "",
        muscleGroup: "",
        sortOrder: defaultSortOrder,
      });
    }
  }, [editingDay, defaultSortOrder, reset]);

  const onSubmit = async (data: WorkoutDayFormInputs) => {
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
          const updatedDay: WorkoutDay = {
            ...editingDay,
            dayName: data.dayName,
            muscleGroup: data.muscleGroup,
            sortOrder: Number(data.sortOrder),
          };
          onSuccess(updatedDay);
        }
      } else {
        const res = await fetch("/api/admin/subscription/workout-days", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: workoutPlanId,
            dayName: data.dayName,
            muscleGroup: data.muscleGroup,
            sortOrder: Number(data.sortOrder),
          }),
        });
        if (res.ok) {
          onSuccess();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 text-right animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <div className="text-white font-bold text-xs">
        {editingDay ? "ویرایش روز تمرین" : "ثبت روز جدید"}
      </div>
      <div>
        <input
          type="text"
          placeholder="نام روز (مثال: شنبه - سینه)"
          {...register("dayName", { required: true })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
          required
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="عضله هدف (مثال: سینه و جلو بازو)"
          {...register("muscleGroup", { required: true })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
          required
        />
      </div>
      <div>
        <input
          type="number"
          placeholder="ترتیب نمایش"
          {...register("sortOrder", { required: true })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-orange-500"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded text-xs transition-colors cursor-pointer"
        >
          {editingDay ? "بروزرسانی" : "افزودن"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/10 hover:bg-white/15 text-white py-1.5 rounded text-xs transition-colors cursor-pointer"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
