import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutPlan extends Document {
  packageId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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