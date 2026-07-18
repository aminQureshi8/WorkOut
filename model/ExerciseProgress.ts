import mongoose, { Schema } from "mongoose";
import { IExerciseProgressDocument } from "@/types/progress";

const ExerciseProgressSchema = new Schema<IExerciseProgressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "WorkoutExercise",
      required: true,
    },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.ExerciseProgress ||
  mongoose.model<IExerciseProgressDocument>(
    "ExerciseProgress",
    ExerciseProgressSchema,
  );
