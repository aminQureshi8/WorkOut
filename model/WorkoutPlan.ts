import mongoose, { Schema } from "mongoose";
import { IWorkoutPlan } from "@/types/workout";

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>("WorkoutPlan", WorkoutPlanSchema);