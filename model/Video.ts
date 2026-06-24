import mongoose, { Schema } from "mongoose";
import { IVideo } from "@/types/video";

const VideoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    thumbnailUrl: { type: String, default: "" },
    durationSec: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Video ||
  mongoose.model<IVideo>("Video", VideoSchema);
