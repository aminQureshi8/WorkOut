import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutDay extends Document {
  planId: mongoose.Types.ObjectId;
  dayName: string;
  muscleGroup: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

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