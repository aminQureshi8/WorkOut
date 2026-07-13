import mongoose, { Schema } from "mongoose";
import { IWorkoutmonth } from "@/types/workout";

const WorkoutmonthSchema = new Schema<IWorkoutmonth>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkoutmonthSchema.virtual("workoutweeks", {
  ref: "Workoutweek",
  localField: "_id",
  foreignField: "monthId",
});

export default mongoose.models.Workoutmonth ||
  mongoose.model<IWorkoutmonth>("Workoutmonth", WorkoutmonthSchema);
