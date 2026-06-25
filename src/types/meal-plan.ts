import { FormEvent } from "react";
import { UseFormRegister, FieldErrors, Control, UseFormWatch } from "react-hook-form";

export interface FoodItem {
  _id: string;
  name: string;
  unit: string;
}

export interface PackageItem {
  _id: string;
  name: string;
}

export interface SelectedFood {
  foodId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface MealPlanFormInputs {
  title: string;
  description: string;
  packageId: string;
  isActive: boolean;
  breakfast: { foodId: string; name: string; quantity: number; unit: string }[];
  lunch: { foodId: string; name: string; quantity: number; unit: string }[];
  dinner: { foodId: string; name: string; quantity: number; unit: string }[];
  snack: { foodId: string; name: string; quantity: number; unit: string }[];
}

export interface PlanMealItem {
  foodId: {
    _id: string;
    name: string;
    unit: string;
  } | null;
  quantity: number;
  unit: string;
}

export interface MealPlanData {
  _id: string;
  packageId: {
    _id: string;
    name: string;
  } | null;
  title: string;
  description: string;
  breakfast: PlanMealItem[];
  lunch: PlanMealItem[];
  dinner: PlanMealItem[];
  snack: PlanMealItem[];
  isActive: boolean;
  createdAt: string;
}

export interface MealPlanFormProps {
  packages: PackageItem[];
  foods: FoodItem[];
  editingPlan: MealPlanData | null;
  onCancel: () => void;
  onSubmitSuccess: () => void;
}

export interface MealPlanFormFieldsProps {
  register: UseFormRegister<MealPlanFormInputs>;
  errors: FieldErrors<MealPlanFormInputs>;
  control: Control<MealPlanFormInputs>;
  watch: UseFormWatch<MealPlanFormInputs>;
  packages: PackageItem[];
  foods: FoodItem[];
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
