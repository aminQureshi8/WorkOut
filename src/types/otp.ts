import { Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  email?: string;
  code: string;
  createdAt: Date;
}
