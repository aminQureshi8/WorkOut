export interface BreadcrumbProps {
  packageName: string;
}

export interface FeatureItem {
  name: string;
  description?: string;
  included: boolean;
}

export interface PackageFeaturesProps {
  features: FeatureItem[];
}

export interface PricePriceObj {
  monthly: number;
  quarterly: number;
  biannual: number;
}

export interface PriceCardProps {
  price: PricePriceObj;
  originalPrice: PricePriceObj;
}

export interface PackageStatsProps {
  studentCount: number;
  rating: number;
  reviewCount: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
