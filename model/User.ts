import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true },
    password: { type: String , default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
