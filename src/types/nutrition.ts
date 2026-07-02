import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Food {
  _id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  unit: string;
  isActive: boolean;
  type?: "breakfast" | "lunch" | "dinner" | "snack" | "all";
  createdAt?: string;
  updatedAt?: string;
}

export interface MealItem {
  _id?: string;
  foodId?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionLog {
  _id: string;
  userId: string;
  date: string; // Format: YYYY-MM-DD
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
  };
  waterIntake: number; // in ml
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWater: number;
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IFood extends Omit<Food, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealItem extends Omit<MealItem, "foodId"> {
  foodId?: mongoose.Types.ObjectId | null;
}

export interface INutritionLog extends Omit<NutritionLog, "_id" | "userId" | "meals" | "createdAt" | "updatedAt">, Document {
  userId: mongoose.Types.ObjectId;
  meals: {
    breakfast: IMealItem[];
    lunch: IMealItem[];
    dinner: IMealItem[];
    snack: IMealItem[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealData {
  breakfast: FoodItem[];
  lunch: FoodItem[];
  dinner: FoodItem[];
  snack: FoodItem[];
}



export interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMealType: keyof MealData;
  dbFoods: Food[];
  onSaveFood: (newItem: FoodItem) => void;
  userId: string;
  selectedDate: string;
  currentMeals: MealData;
}

export interface MealPlanItem {
  foodId: string | mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
}

export interface MealPlan {
  _id: string;
  packageId: string | mongoose.Types.ObjectId;
  title: string;
  description?: string;
  breakfast: MealPlanItem[];
  lunch: MealPlanItem[];
  dinner: MealPlanItem[];
  snack: MealPlanItem[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMealPlan extends Omit<MealPlan, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface EditTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  targetCalories: number;
  targetMacros: { protein: number; carbs: number; fat: number };
  targetWater: number;
  onSaveTargets: (
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    water: number,
  ) => void;
}

export interface MealsGridProps {
  currentMeals: MealData;
  isLoadingMeals: boolean;
  onDeleteFood: (mealType: keyof MealData, itemId: string) => void;
  onAddFoodClick: (mealType: keyof MealData) => void;
}

export interface WaterTrackerProps {
  selectedDate: string;
  targetWater: number;
}

export interface FoodFormValues {
  manualName: string;
  manualCalories: string;
  foodQuantity: string;
  manualProtein: string;
  manualCarbs: string;
  manualFat: string;
}
