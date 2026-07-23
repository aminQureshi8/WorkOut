export type BillingCycle = "monthly" | "quarterly" | "biannual";

export type PaymentMethod = "gateway" | "card_to_card";

export interface BankOption {
  id: string;
  name: string;
  logo: string;
}

export interface OrderPackageInfo {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  price: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  isActive: boolean;
}

export interface OrderPageProps {
  packageData: OrderPackageInfo;
  userId: string;
  email?: string | null;
}

export interface OrderFormData {
  selectedPackage: string;
  billingCycle: BillingCycle;
  paymentMethod: PaymentMethod;
  selectedBank: string;
  discountCode: string;
  agreedToTerms: boolean;
  fullName: string;
  email: string;
  phone: string;
}

export interface CreateOrderPayload {
  fullName: string;
  phone: string;
  packageId: string;
  billingCycle: BillingCycle;
  discountCode?: string | null;
}

export interface CreateOrderResponse {
  message: string;
  orderId?: string;
  amount?: number;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentRef: string;
}

export interface VerifyPaymentResponse {
  subscription?: unknown;
  message?: string;
}

export interface OrderModelData {
  userId: unknown;
  packageId: unknown;
  billingCycle: BillingCycle;
  amountPaid: number;
  originalAmount: number;
  discountPercent: number;
  status: "pending" | "paid" | "failed" | "refunded";
  paymentRef?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder extends OrderModelData, Document {
  createdAt: Date;
  updatedAt: Date;
}

