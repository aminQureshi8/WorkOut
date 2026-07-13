import mongoose, { Document } from "mongoose";

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

export interface IWorkoutPlan extends Document {
  packageId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkoutweek extends Document {
  packageId: mongoose.Types.ObjectId;
  title?: string;
  workoutdays?: any[];
  workoutexcersice?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkoutmonth extends Document {
  packageId: mongoose.Types.ObjectId;
  workoutweeks?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkoutDay extends Document {
  planId: mongoose.Types.ObjectId;
  dayName: string;
  muscleGroup: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkoutExercise extends Document {
  dayId: mongoose.Types.ObjectId;
  videoId?: mongoose.Types.ObjectId;
  videoId2?: mongoose.Types.ObjectId;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutPlanFormInputs {
  title: string;
  description: string;
}

export interface WorkoutDayFormInputs {
  dayName: string;
  muscleGroup: string;
  sortOrder: number;
}

export interface WorkoutExerciseFormInputs {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  videoId: string;
  videoId2: string;
  sortOrder: number;
}

export interface WorkoutPlanModalProps {
  selectedPackageForPlan: PackageInfo;
  onClose: () => void;
  videos: VideoInfo[];
  setWatchingVideo: (video: VideoInfo | null) => void;
}

export interface EditSubscriptionFormInputs {
  status: SubscriptionItem["status"];
  endsAt: string;
}

export interface EditSubscriptionModalProps {
  selectedSubscription: SubscriptionItem;
  onClose: () => void;
  onSuccess: () => void;
}

export interface VideoPlayerModalProps {
  video: VideoInfo;
  onClose: () => void;
}

export interface WorkoutDayFormProps {
  editingDay: WorkoutDay | null;
  workoutPlanId: string;
  onSuccess: (updatedDay?: WorkoutDay) => void;
  onCancel: () => void;
  defaultSortOrder: number;
}

export interface SubscriptionsTableRef {
  refresh: () => void;
}

export interface SubscriptionsTableProps {
  onOpenPlanModal: (pkg: PackageInfo) => void;
  onEdit: (sub: SubscriptionItem) => void;
  onStatsUpdate: (stats: { total: number; active: number; trial: number; expired: number }) => void;
}
