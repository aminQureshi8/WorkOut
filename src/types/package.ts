import mongoose, { Document } from "mongoose";

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
  hasMealPlan: boolean;
  tier?: string;
  features?: string[] | { name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPackage extends Omit<Package, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}

export type PackageFormData = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  colorClass: string;
  tier: string;
  isPopular: boolean;
  isActive: boolean;
  price: {
    monthly: string;
    quarterly: string;
    biannual: string;
  };
  originalPrice: {
    monthly: string;
    quarterly: string;
    biannual: string;
  };
  featuresText: string;
};

export interface PackageStats {
  totalCount: number;
  activeCount: number;
  totalUsers: number;
  totalRevenue: number;
  mostPopularName: string;
  mostPopularCount: number;
}

export interface PackageStatsProps {
  packages: Package[];
  formatNumber: (num: number) => string;
}

export interface PackageListProps {
  packages: Package[];
  fetchPackages: () => Promise<void> | void;
  setEditingPackage: (pkg: Package | null) => void;
  setShowCreateModal: (show: boolean) => void;
  reset: (values: any) => void;
  formatNumber: (num: number) => string;
}

export interface PackageModalProps {
  isOpen: boolean;
  setShowCreateModal: (show: boolean) => void;
  editingPackage: Package | null;
  setEditingPackage: (pkg: Package | null) => void;
  reset: (values: any) => void;
  handleSubmit: any;
  fetchPackages: () => void;
  register: any;
  errors: any;
  isSubmitting: boolean;
  setValue: any;
}
