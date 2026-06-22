import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Coach {
  _id: string;
  userId: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  specialties: string[];
  rating: number;
  sessionCount: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface ICoach extends Omit<Coach, "_id" | "userId" | "createdAt" | "updatedAt">, Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
