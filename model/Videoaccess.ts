import mongoose, { Schema, Document } from "mongoose";

export interface IVideoAccess extends Document {
  packageId: mongoose.Types.ObjectId;
  videoId: mongoose.Types.ObjectId;
}

const VideoAccessSchema = new Schema<IVideoAccess>({
  packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },
  videoId: { type: Schema.Types.ObjectId, ref: "Video", required: true },
});

export default mongoose.models.VideoAccess ||
  mongoose.model<IVideoAccess>("VideoAccess", VideoAccessSchema);
