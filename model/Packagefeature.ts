import mongoose, { Schema, Document } from "mongoose";

export interface IPackageFeature extends Document {
  packageId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  included: boolean;
  sortOrder: number;
}

const PackageFeatureSchema = new Schema<IPackageFeature>({
  packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  included: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
});

export default mongoose.models.PackageFeature ||
  mongoose.model<IPackageFeature>("PackageFeature", PackageFeatureSchema);
