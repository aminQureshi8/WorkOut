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

export interface PersonalRecordsProps {
  userId?: string;
}

export interface CreatePRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId?: string;
}

export interface PRFormInput {
  category: string;
  testName: string;
  value: number;
  unit: string;
  date: string;
  notes: string;
}
