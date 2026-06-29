import mongoose, { Schema } from "mongoose";
import { IUser } from "@/types/user";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true },
    password: { type: String, default: "" },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "coach"], default: "user" },
    status: {
      type: String,
      enum: ["active", "expired", "blocked"],
      default: "active",
    },
    wishlist: { type: [Schema.Types.ObjectId], ref: "Blog", default: [] },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.virtual("nutrition", {
  ref: "NutritionLog",
  localField: "_id",
  foreignField: "userId",
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
