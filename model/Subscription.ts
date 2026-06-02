import mongoose, { Schema, Document } from "mongoose";

export interface ISubscription extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  coachId?: mongoose.Types.ObjectId;
  status: "trial" | "active" | "expired" | "cancelled";
  startsAt: Date;
  endsAt: Date;
  trialEndsAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
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
  { timestamps: true },
);

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
