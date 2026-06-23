import mongoose, { Schema } from "mongoose";
import { IFood } from "@/types/nutrition";

const FoodSchema = new Schema<IFood>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, default: 0, min: 0 },
    carbs: { type: Number, required: true, default: 0, min: 0 },
    fat: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, required: true, default: "گرم" },
    isActive: { type: Boolean, default: true },
    type: {
      type: String,
      default: "all",
      enum: ["breakfast", "lunch", "dinner", "snack", "all"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema);
