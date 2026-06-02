import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  billingCycle: "monthly" | "quarterly" | "biannual";
  amountPaid: number;
  originalAmount: number;
  discountPercent: number;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    billingCycle: {
      type: String,
      enum: ["monthly", "quarterly", "biannual"],
      required: true,
    },
    amountPaid: { type: Number, required: true },
    originalAmount: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentRef: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
