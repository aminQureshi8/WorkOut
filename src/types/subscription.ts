import mongoose from "mongoose";

export interface ISubscription {
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

export interface OrderItem {
  _id: string;
  packageId?: {
    name: string;
  } | null;
  billingCycle: string;
  amountPaid: number;
  createdAt: string | Date;
  paymentRef?: string;
  status: string;
}

export interface PurchaseHistoryProps {
  orders: OrderItem[];
}

export interface SubscriptionViewProps {
  subscription: any;
  workoutPlan: any;
  workoutDays: any[];
  orders: OrderItem[];
}
