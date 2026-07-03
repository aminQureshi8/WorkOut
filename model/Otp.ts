import mongoose, { Schema } from "mongoose";
import { IOtp } from "@/types/user";

const OtpSchema = new Schema<IOtp>({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120,
  },
});

export default mongoose.models.Otp ||
  mongoose.model<IOtp>("Otp", OtpSchema);
