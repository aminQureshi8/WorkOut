import mongoose, { Schema, Document } from "mongoose";
import { IPr } from "@/types/pr";

export interface IPrDocument extends IPr, Document {}

const PrSchema = new Schema<IPrDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "Coach", default: null },
    category: { type: String, required: true },
    testName: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: Date, default: Date.now, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Pr ||
  mongoose.model<IPrDocument>("Pr", PrSchema);
