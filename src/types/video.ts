import { Document } from "mongoose";

export interface IVideo extends Document {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  durationSec: number;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
