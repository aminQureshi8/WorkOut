import type { Document, Types } from "mongoose";

export interface IWorkoutSessionFeedback {
  userId: Types.ObjectId | string;
  dayId: Types.ObjectId | string;
  difficulty: number;
  energyLevel: number;
  hasPain: boolean;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWorkoutSessionFeedbackDocument extends IWorkoutSessionFeedback, Document {}

export interface ExerciseFeedbackFormProps {
  userId: string;
  dayId: string;
  exerciseId: string;
  onClose: () => void;
}
