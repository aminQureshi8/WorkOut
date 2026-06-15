import mongoose, { Document } from "mongoose";

// Mongoose / DB Schema Types
export interface IMessage {
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  text: string;
  createdAt: Date;
}

export interface ITicket extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  description: string;
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Client-Side Populated Types
export interface IClientUser {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface IClientMessage {
  _id: string;
  senderId: IClientUser | string;
  senderName: string;
  text: string;
  createdAt: string;
}

export interface IClientTicket {
  _id: string;
  userId: IClientUser;
  subject: string;
  description: string;
  status: "pending" | "answered" | "closed";
  priority: "low" | "medium" | "high";
  messages: IClientMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ITicketStats {
  totalCount: number;
  pendingCount: number;
  answeredCount: number;
  closedCount: number;
}
