import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email?: string;
  username: string;
  password: string;
  role: "user" | "admin" | "coach";
  fullName: string;
  phone: string;
  status: "active" | "expired" | "blocked";
  wishlist?: mongoose.Types.ObjectId[];
  lastLogin?: Date;
  createdAt: Date;
}

export interface IAdminUser {
  _id: string;
  username: string;
  email?: string;
  phone?: string;
  role: "user" | "admin" | "coach";
  status: string;
  package?: string;
  avatar?: string;
  lastLogin?: string;
  totalPayments?: number;
  createdAt: string;
}

export type { IOtp } from "./otp";
