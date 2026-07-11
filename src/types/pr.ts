import mongoose from "mongoose";

export interface IPr {
  userId: mongoose.Types.ObjectId;
  coachId?: mongoose.Types.ObjectId;
  category: string;
  testName: string;
  value: number;
  unit: string;
  date: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
