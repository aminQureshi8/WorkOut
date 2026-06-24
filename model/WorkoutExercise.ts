import mongoose, { Schema } from "mongoose";
import { IWorkoutExercise } from "@/types/workout";

const WorkoutExerciseSchema = new Schema<IWorkoutExercise>(
  {
    dayId: { type: Schema.Types.ObjectId, ref: "WorkoutDay", required: true },
    videoId: { type: Schema.Types.ObjectId, ref: "Video", default: null },
    videoId2: { type: Schema.Types.ObjectId, ref: "Video", default: null },
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    restSec: { type: Number, default: 60 },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.WorkoutExercise ||
  mongoose.model<IWorkoutExercise>("WorkoutExercise", WorkoutExerciseSchema);
