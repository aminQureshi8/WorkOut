import mongoose, { Schema } from "mongoose";
import { IPackage } from "@/types/package";

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    price: {
      monthly: { type: Number, required: true },
      quarterly: { type: Number, required: true },
      biannual: { type: Number, required: true },
    },
    originalPrice: {
      monthly: { type: Number, required: true },
      quarterly: { type: Number, required: true },
      biannual: { type: Number, required: true },
    },
    icon: { type: String, default: "" },
    colorClass: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Package ||
  mongoose.model<IPackage>("Package", PackageSchema);
