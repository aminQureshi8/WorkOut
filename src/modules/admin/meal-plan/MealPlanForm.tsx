import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { X, Utensils } from "lucide-react";
import { showAlert } from "@/utils/alert";
import { MealPlanFormInputs, PlanMealItem, MealPlanFormProps } from "@/types/meal-plan";
import MealPlanFormFields from "./MealPlanFormFields";

export default function MealPlanForm({
  packages,
  foods,
  editingPlan,
  onCancel,
  onSubmitSuccess,
}: MealPlanFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MealPlanFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      packageId: "",
      isActive: true,
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: [],
    },
  });

  useEffect(() => {
    if (editingPlan) {
      const mapMealItems = (items: PlanMealItem[]) => {
        return items
          .filter((item) => item.foodId !== null)
          .map((item) => ({
            foodId: item.foodId!._id,
            name: item.foodId!.name,
            quantity: item.quantity,
            unit: item.unit || item.foodId!.unit || "گرم",
          }));
      };

      reset({
        title: editingPlan.title,
        description: editingPlan.description || "",
        packageId: editingPlan.packageId?._id || "",
        isActive: editingPlan.isActive,
        breakfast: mapMealItems(editingPlan.breakfast || []),
        lunch: mapMealItems(editingPlan.lunch || []),
        dinner: mapMealItems(editingPlan.dinner || []),
        snack: mapMealItems(editingPlan.snack || []),
      });
    } else {
      reset({
        title: "",
        description: "",
        packageId: "",
        isActive: true,
        breakfast: [],
        lunch: [],
        dinner: [],
        snack: [],
      });
    }
  }, [editingPlan, reset]);

  const onSubmit: SubmitHandler<MealPlanFormInputs> = async (data) => {
    try {
      const sanitizeMeal = (items: any[]) =>
        items.map((item) => ({
          foodId: item.foodId,
          quantity: Number(item.quantity),
          unit: item.unit,
        }));

      const payload = {
        title: data.title,
        description: data.description,
        packageId: data.packageId,
        isActive: data.isActive,
        breakfast: sanitizeMeal(data.breakfast || []),
        lunch: sanitizeMeal(data.lunch || []),
        dinner: sanitizeMeal(data.dinner || []),
        snack: sanitizeMeal(data.snack || []),
      };

      const url = editingPlan ? `/api/admin/meal-plan/${editingPlan._id}` : "/api/admin/meal-plan";
      const method = editingPlan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        showAlert("موفقیت", editingPlan ? "برنامه غذایی با موفقیت ویرایش شد." : "برنامه غذایی جدید با موفقیت ثبت شد.", "success");
        onSubmitSuccess();
      } else {
        const errorData = await response.json();
        showAlert("خطا", errorData.error || "خطا در ثبت اطلاعات", "error");
      }
    } catch (error) {
      showAlert("خطا", "خطایی در برقراری ارتباط رخ داد.", "error");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-400" />
          {editingPlan ? "ویرایش برنامه غذایی" : "ثبت برنامه غذایی جدید"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <MealPlanFormFields
        register={register}
        errors={errors}
        control={control}
        watch={watch}
        packages={packages}
        foods={foods}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
