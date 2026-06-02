import mongoose, { Schema, Document } from "mongoose";

export interface IPackage extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  originalPrice: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  icon: string;
  colorClass: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
