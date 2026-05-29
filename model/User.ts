import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);