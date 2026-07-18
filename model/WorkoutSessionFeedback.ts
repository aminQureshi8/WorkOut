import mongoose, { Schema } from "mongoose";
import type { IWorkoutSessionFeedbackDocument } from "@/types/feedback";

const WorkoutSessionFeedbackSchema = new Schema<IWorkoutSessionFeedbackDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dayId: { type: Schema.Types.ObjectId, ref: "WorkoutDay", required: true },
    difficulty: { type: Number, min: 1, max: 5, required: true },
    energyLevel: { type: Number, min: 1, max: 5, required: true },
    hasPain: { type: Boolean, required: true },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutSessionFeedback ||
  mongoose.model<IWorkoutSessionFeedbackDocument>("WorkoutSessionFeedback", WorkoutSessionFeedbackSchema);
