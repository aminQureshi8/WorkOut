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
  metricId?: string;
  category: string;
  testName: string;
  value: number;
  unit: string;
  date: string;
  notes: string;
}

export interface CreateMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface MetricFormInput {
  name: string;
  category: string;
  unit: string;
  description?: string;
}

export interface TestMetricItem {
  _id: string;
  name: string;
  category: string;
  unit: string;
  description?: string;
  createdAt?: string;
}

export interface PRChartProps {
  userId?: string;
}

export interface PRRecordItem {
  _id: string;
  userId: string;
  coachId?: string;
  category: string;
  testName: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  createdAt?: string;
}

export interface PRHistoryTableProps {
  sortedRecords: PRRecordItem[];
}
