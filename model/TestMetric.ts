import mongoose, { Schema, Document } from "mongoose";

export interface ITestMetricDocument extends Document {
  coachId?: Schema.Types.ObjectId | null;
  name: string;
  unit: string;
  category?: string;
  description?: string;
  assignedUserIds?: Schema.Types.ObjectId[];
}

const TestMetricSchema = new Schema<ITestMetricDocument>(
  {
    coachId: { type: Schema.Types.ObjectId, ref: "User", default: null, required: false },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    category: { type: String, default: "عام" },
    description: { type: String, default: "" },
    assignedUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

export default mongoose.models.TestMetric ||
  mongoose.model<ITestMetricDocument>("TestMetric", TestMetricSchema);
