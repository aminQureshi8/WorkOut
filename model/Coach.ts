import mongoose, { Schema, Document } from "mongoose";

export interface ICoach extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  bio?: string;
  avatarUrl?: string;
  specialties: string[];
  rating: number;
  sessionCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
