import mongoose, { Schema } from "mongoose";
import { IFitnessProfile } from "@/types/fitness-profile";

const FitnessProfileSchema = new Schema<IFitnessProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    goal: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "endurance",
        "general_fitness",
        "rehabilitation",
      ],
      required: true,
    },
    sessionsPerWeek: { type: Number, required: true },
    equipment: {
      type: String,
      enum: ["none", "home_basic", "gym_full"],
      required: true,
    },
    trainingExperience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    ageYears: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    bodyPhotos: [{ type: String }],
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.FitnessProfile ||
  mongoose.model<IFitnessProfile>("FitnessProfile", FitnessProfileSchema);
