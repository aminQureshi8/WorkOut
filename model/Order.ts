import mongoose, { Schema } from "mongoose";
import { IOrder } from "@/types/order";

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
