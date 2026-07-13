"use client";

import React, { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Apple } from "lucide-react";
import { showAlert } from "@/utils/alert";
import { FoodFormData, FoodsTableRef } from "@/types/nutrition";
import FoodForm from "./FoodForm";
import FoodsTable from "./FoodsTable";

export default function FoodsContainer() {
  const tableRef = useRef<FoodsTableRef>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormData>({
    defaultValues: {
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      unit: "گرم",
      type: "all",
      isActive: true,
    },
  });

  const onSubmit: SubmitHandler<FoodFormData> = async (data) => {
    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        showAlert("موفقیت", "غذای جدید با موفقیت ثبت شد.", "success");
        reset();
        tableRef.current?.refresh();
      } else {
        const errorData = await response.json();
        showAlert("خطا", errorData.message || "خطا در ثبت غذا", "error");
      }
    } catch (error) {
      showAlert("خطا", "خطایی در برقراری ارتباط با سرور رخ داد.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-danaMed p-4 md:p-8" dir="rtl">
      <div className="container mx-auto pt-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-morabbaReg text-white flex items-center gap-3">
              <Apple className="w-8 h-8 text-emerald-400" />
              مدیریت و ایجاد غذاها
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              ایجاد، دسته‌بندی و تعریف ارزش غذایی اقلام غذایی برای بخش کالری‌شمار روزانه کاربران
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FoodsTable ref={tableRef} />
          </div>

          <FoodForm
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            // eslint-disable-next-line react-hooks/refs
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </div>
  );
}
