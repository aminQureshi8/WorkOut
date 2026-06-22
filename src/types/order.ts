import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Order {
  _id: string;
  userId: string;
  packageId: string;
  billingCycle: "monthly" | "quarterly" | "biannual";
  amountPaid: number;
  originalAmount: number;
  discountPercent: number;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentRef?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IOrder extends Omit<Order, "_id" | "userId" | "packageId" | "createdAt" | "updatedAt">, Document {
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
