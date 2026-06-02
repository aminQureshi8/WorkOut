import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  durationMonths?: number;
  isVerified: boolean;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
    rating: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
    text: { type: String, required: true },
    durationMonths: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
