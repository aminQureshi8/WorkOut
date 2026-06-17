import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin" | "coach";
  fullName: string;
  phone: string;
  status: "active" | "expired" | "blocked";
  wishlist?: mongoose.Types.ObjectId[];
  lastLogin?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true },
    password: { type: String, default: "" },
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "coach"], default: "user" },
    status: { type: String, enum: ["active", "expired", "blocked"], default: "active" },
    wishlist: { type: [Schema.Types.ObjectId], ref: "Blog", default: [] },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
