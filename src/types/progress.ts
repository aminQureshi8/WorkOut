import type { Document, Types } from "mongoose";

export interface IExerciseProgress {
  userId: Types.ObjectId | string;
  exerciseId: Types.ObjectId | string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExerciseProgressDocument extends IExerciseProgress, Document {}
