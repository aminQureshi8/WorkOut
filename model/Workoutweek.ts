import mongoose, { Schema } from "mongoose";
import { IWorkoutweek } from "@/types/workout";

const WorkoutweekSchema = new Schema<IWorkoutweek>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    title: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

WorkoutweekSchema.pre("save", async function () {
  if (!this.title) {
    const count = await (this.constructor as any).countDocuments({
      packageId: this.packageId,
    });
    const persianWords = [
      "اول",
      "دوم",
      "سوم",
      "چهارم",
      "پنجم",
      "ششم",
      "هفتم",
      "هشتم",
      "نهم",
      "دهم",
    ];
    const ordinal = persianWords[count] || `${count + 1}`;
    this.title = `هفته ${ordinal}`;
  }
});

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
