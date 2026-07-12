import mongoose, { Schema, Document } from "mongoose";
import { ISubscription } from "@/types/subscription";

export interface ISubscriptionDocument extends ISubscription, Document {}

const SubscriptionSchema = new Schema<ISubscriptionDocument>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach", default: null },
    status: {
      type: String,
      enum: ["trial", "active", "expired", "cancelled"],
      default: "trial",
    },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    trialEndsAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

SubscriptionSchema.virtual("pr", {
  ref: "Pr",
  localField: "userId",
  foreignField: "userId",
  justOne: false,
});

export default mongoose.models.Subscription ||
  mongoose.model<ISubscriptionDocument>("Subscription", SubscriptionSchema);
