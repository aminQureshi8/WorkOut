import mongoose, { Document } from "mongoose";

// Client-Side Types
export interface Package {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  originalPrice: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  icon: string;
  colorClass: string;
  rating: number;
  reviewCount: number;
  studentCount: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IPackage extends Omit<Package, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}
