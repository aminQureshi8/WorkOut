"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EditSubscriptionModalProps, EditSubscriptionFormInputs } from "@/types/workout";
import { showAlert } from "@/utils/alert";

export default function EditSubscriptionModal({
  selectedSubscription,
  onClose,
  onSuccess,
}: EditSubscriptionModalProps) {
  const { register, handleSubmit, reset } = useForm<EditSubscriptionFormInputs>();

  useEffect(() => {
    reset({
      status: selectedSubscription.status,
      endsAt: selectedSubscription.endsAt
        ? new Date(selectedSubscription.endsAt).toISOString().split("T")[0]
        : "",
    });
  }, [selectedSubscription, reset]);

  const handleEditSubscription = async (data: EditSubscriptionFormInputs) => {
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSubscription._id,
          status: data.status,
          endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : undefined,
        }),
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت بروزرسانی شد", "success");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ویرایش اشتراک", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-md w-full">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl text-white font-bold font-morabbaReg">
            ویرایش اشتراک کاربر
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(handleEditSubscription)} className="p-6 space-y-4">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white font-medium">
              {selectedSubscription.userId?.fullName || "کاربر ناشناس"}
            </div>
            <div className="text-white/50 text-xs">
              پکیج: {selectedSubscription.packageId?.name || "پکیج حذف شده"}
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              وضعیت اشتراک
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="active">فعال</option>
              <option value="trial">تست (Trial)</option>
              <option value="expired">منقضی شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              تاریخ پایان
            </label>
            <input
              type="date"
              {...register("endsAt", { required: true })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm cursor-pointer"
            >
              ذخیره تغییرات
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
