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
