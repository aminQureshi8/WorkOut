export interface UserInfo {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
}

export interface PackageInfo {
  _id: string;
  name: string;
  slug: string;
  colorClass: string;
  price?: {
    monthly: number;
  };
}

export interface SubscriptionItem {
  _id: string;
  userId: UserInfo | null;
  packageId: PackageInfo | null;
  status: "trial" | "active" | "expired" | "cancelled";
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

export interface WorkoutPlan {
  _id: string;
  packageId: string;
  title: string;
  description?: string;
  isActive: boolean;
}

export interface WorkoutDay {
  _id: string;
  planId: string;
  dayName: string;
  muscleGroup: string;
  sortOrder: number;
}

export interface VideoInfo {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  level?: string;
  durationSec?: number;
  tags?: string[];
  createdAt?: string;
}

export interface WorkoutExercise {
  _id: string;
  dayId: string;
  videoId?: VideoInfo | null;
  videoId2?: VideoInfo | null;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  sortOrder: number;
}

export interface ExerciseItem {
  _id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  videoId?: VideoInfo | null;
  videoId2?: VideoInfo | null;
}

export interface DayItem {
  _id: string;
  dayName: string;
  muscleGroup: string;
  exercises: ExerciseItem[];
}

export interface WorkoutPlanProps {
  plan: {
    _id: string;
    title: string;
    description?: string;
  } | null;
  days: DayItem[];
}
