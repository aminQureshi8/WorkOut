import mongoose, { Schema } from "mongoose";
import { IWorkoutDay } from "@/types/workout";

const WorkoutDaySchema = new Schema<IWorkoutDay>(
  {
    planId: { type: Schema.Types.ObjectId, ref: "WorkoutPlan", required: true },
    dayName: { type: String, required: true },
    muscleGroup: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.WorkoutDay ||
  mongoose.model<IWorkoutDay>("WorkoutDay", WorkoutDaySchema);