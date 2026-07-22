import mongoose, { Schema, Document } from "mongoose";

export interface IPrDocument extends Document {
  userId: Schema.Types.ObjectId;
  coachId?: Schema.Types.ObjectId | null;
  testMetricId?: Schema.Types.ObjectId | null;
  category?: string;
  testName?: string;
  unit?: string;
  value: number;
  date: Date;
  notes?: string;
}

const PrSchema = new Schema<IPrDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coachId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    testMetricId: {
      type: Schema.Types.ObjectId,
      ref: "TestMetric",
      default: null,
      required: false,
    },
    category: { type: String, default: "" },
    testName: { type: String, default: "" },
    unit: { type: String, default: "" },
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Pr ||
  mongoose.model<IPrDocument>("Pr", PrSchema);
