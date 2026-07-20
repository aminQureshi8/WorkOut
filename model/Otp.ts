import mongoose, { Schema } from "mongoose";
import type { IOtp } from "@/types/otp";

const OtpSchema = new Schema<IOtp>({
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    default: "",
    lowercase: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

export default mongoose.models.Otp ||
  mongoose.model<IOtp>("Otp", OtpSchema);
