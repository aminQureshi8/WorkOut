import mongoose, { Schema, Document } from "mongoose";

export interface IWish extends Document {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WishSchema = new Schema<IWish>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

WishSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default mongoose.models.Wish || mongoose.model<IWish>("Wish", WishSchema);
