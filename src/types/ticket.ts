import mongoose, { Document } from "mongoose";
import type { ReactNode, FormEvent } from "react";

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
  category: "workout" | "nutrition" | "form_check" | "injury" | "technical";
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
  category: "workout" | "nutrition" | "form_check" | "injury" | "technical";
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

export interface TicketStatsProps {
  stats: ITicketStats;
  formatNumber: (num: number) => string;
}

export interface TicketListProps {
  children?: ReactNode;
  tickets: IClientTicket[];
  selectedTicket: IClientTicket | null;
  setSelectedTicket: (ticket: IClientTicket | null) => void;
  setReplyText: (text: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

export interface TicketDetailsProps {
  selectedTicket: IClientTicket | null;
  replyText: string;
  setReplyText: (text: string) => void;
  sendingReply: boolean;
  onSendReply: (e: FormEvent) => void;
  onCloseTicket: (id: string) => void;
  onReopenTicket: (id: string) => void;
  onDeleteTicket: (id: string) => void;
}
