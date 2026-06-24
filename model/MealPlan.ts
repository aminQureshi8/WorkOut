import mongoose, { Schema } from "mongoose";
import { IMealPlan } from "@/types/nutrition";

const MealPlanItemSchema = new Schema(
  {
    foodId: { type: Schema.Types.ObjectId, ref: "Food", required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true, default: "گرم" },
  },
  { _id: false }
);

const MealPlanSchema = new Schema<IMealPlan>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    breakfast: { type: [MealPlanItemSchema], default: [] },
    lunch: { type: [MealPlanItemSchema], default: [] },
    dinner: { type: [MealPlanItemSchema], default: [] },
    snack: { type: [MealPlanItemSchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
