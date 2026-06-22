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
  tier?: string;
  features?: string[] | { name: string }[];
  createdAt?: string;
  updatedAt?: string;
}

// Mongoose / DB Schema Types
export interface IPackage extends Omit<Package, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Component Types
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

// Component Props Types
export interface PackageStatsProps {
  stats: PackageStats;
  formatNumber: (num: number) => string;
}

export interface PackageListProps {
  packages: Package[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPackages: string[];
  handleSelectPackage: (id: string) => void;
  handleBulkDelete: () => void;
  handleEditClick: (pkg: Package) => void;
  handleDeletePackage: (id: string) => void;
  formatNumber: (num: number) => string;
  isLoading: boolean;
  error: string | null;
}

export interface PackageModalProps {
  isOpen: boolean;
  editingPackage: Package | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
  isSubmitting: boolean;
  setValue: any;
}
