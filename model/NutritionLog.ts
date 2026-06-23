import mongoose, { Schema } from "mongoose";
import { INutritionLog, IMealItem } from "@/types/nutrition";

const MealItemSchema = new Schema<IMealItem>({
  foodId: { type: Schema.Types.ObjectId, ref: "Food", default: null },
  name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, default: "گرم" },
  calories: { type: Number, required: true, min: 0 },
  protein: { type: Number, default: 0, min: 0 },
  carbs: { type: Number, default: 0, min: 0 },
  fat: { type: Number, default: 0, min: 0 },
});

const NutritionLogSchema = new Schema<INutritionLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true },
    meals: {
      breakfast: { type: [MealItemSchema], default: [] },
      lunch: { type: [MealItemSchema], default: [] },
      dinner: { type: [MealItemSchema], default: [] },
      snack: { type: [MealItemSchema], default: [] },
    },
    waterIntake: { type: Number, default: 0, min: 0 },
    targetCalories: { type: Number, default: 2000, min: 0 },
    targetProtein: { type: Number, default: 120, min: 0 },
    targetCarbs: { type: Number, default: 220, min: 0 },
    targetFat: { type: Number, default: 65, min: 0 },
  },
  { timestamps: true }
);

NutritionLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.NutritionLog ||
  mongoose.model<INutritionLog>("NutritionLog", NutritionLogSchema);
