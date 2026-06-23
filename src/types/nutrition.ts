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
