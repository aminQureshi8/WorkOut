import mongoose, { Schema } from "mongoose";
import { IUser } from "@/types/user";

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true },
    username: { type: String, required: true },
    password: { type: String, default: "" },
    fullName: { type: String, default: "" },
    phone: { type: String, unique: true, sparse: true },
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

const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

if (mongoose.connection?.readyState === 1) {
  UserModel.collection.dropIndex("email_1").catch(() => {});
}

export default UserModel;
