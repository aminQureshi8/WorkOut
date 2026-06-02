import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  subscriptionId: mongoose.Types.ObjectId;
  coachId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  durationMin: number;
  status: "scheduled" | "completed" | "cancelled" | "no_show";
  meetLink?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    scheduledAt: { type: Date, required: true },
    durationMin: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no_show"],
      default: "scheduled",
    },
    meetLink: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Session ||
  mongoose.model<ISession>("Session", SessionSchema);
