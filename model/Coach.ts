import mongoose, { Schema } from "mongoose";
import { ICoach } from "@/types/coach";

const CoachSchema = new Schema<ICoach>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    bio: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    specialties: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    sessionCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Coach ||
  mongoose.model<ICoach>("Coach", CoachSchema);
