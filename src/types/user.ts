import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
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
