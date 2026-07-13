import mongoose, { Schema } from "mongoose";
import { IWorkoutweek } from "@/types/workout";

const WorkoutweekSchema = new Schema<IWorkoutweek>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkoutweekSchema.virtual("workoutdays", {
  ref: "WorkoutDay",
  localField: "_id",
  foreignField: "weekId",
});

WorkoutweekSchema.virtual("workoutexcersice", {
  ref: "WorkoutExercise",
  localField: "_id",
  foreignField: "weekId",
});

export default mongoose.models.Workoutweek ||
  mongoose.model<IWorkoutweek>("Workoutweek", WorkoutweekSchema);
