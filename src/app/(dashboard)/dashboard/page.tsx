import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SubscriptionModel from "@/model/Subscription";
import UserModel from "@/model/User";
import WorkoutPlanModel from "@/model/WorkoutPlan";
import WorkoutDayModel from "@/model/WorkoutDay";
import WorkoutExerciseModel from "@/model/WorkoutExercise";
import PackageModel from "@/model/Package";
import CoachModel from "@/model/Coach";
import VideoModel from "@/model/Video";
import OrderModel from "@/model/Order";
import AdminDashboardUser from "@/modules/dashboard/AdminDashboardUser/AdminDashboardUser";

const registerModels = () => {
  return [
    SubscriptionModel,
    UserModel,
    WorkoutPlanModel,
    WorkoutDayModel,
    WorkoutExerciseModel,
    PackageModel,
    CoachModel,
    VideoModel,
    OrderModel
  ];
};


export default async function page() {
  registerModels();
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const dbUser = await UserModel.findById(session.user.id).lean();
  if (!dbUser) {
    redirect("/login");
  }

  const activeSubscription = await SubscriptionModel.findOne({
    userId: session.user.id,
    status: { $in: ["active", "trial"] },
    endsAt: { $gt: new Date() },
  })
    .populate("packageId")
    .populate("coachId")
    .lean();

  let subscriptionProps = null;
  let workoutDaysProps: any[] = [];

  if (activeSubscription) {
    const startsAt = new Date(activeSubscription.startsAt);
    const endsAt = new Date(activeSubscription.endsAt);
    const now = new Date();
    const totalTime = endsAt.getTime() - startsAt.getTime();
    const remainingTime = endsAt.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
    const totalDays = Math.max(1, Math.ceil(totalTime / (1000 * 60 * 60 * 24)));
    const endDateString = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(endsAt);

    const priceNum = activeSubscription.packageId?.price || 0;
    const formattedPrice = new Intl.NumberFormat("fa-IR").format(priceNum);

    subscriptionProps = {
      packageName: activeSubscription.packageId?.name || "پکیج اختصاصی",
      status: activeSubscription.status,
      daysRemaining,
      totalDays,
      endDate: endDateString,
      nextPayment: formattedPrice,
    };

    const workoutPlan = await WorkoutPlanModel.findOne({
      packageId: activeSubscription.packageId?._id,
      isActive: true,
    }).lean();

    if (workoutPlan) {
      const days = await WorkoutDayModel.find({ planId: workoutPlan._id })
        .sort({ sortOrder: 1 })
        .lean();

      const dayIds = days.map(d => d._id);
      const exercises = await WorkoutExerciseModel.find({ dayId: { $in: dayIds } })
        .sort({ sortOrder: 1 })
        .lean();

      workoutDaysProps = days.map(day => {
        const dayExercises = exercises.filter(e => e.dayId.toString() === day._id.toString());
        const totalSets = dayExercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
        return {
          day: day.dayName,
          type: day.muscleGroup,
          duration: `${dayExercises.length * 10} دقیقه`,
          done: false,
          sets: totalSets,
        };
      });
    }
  }

  const joinDateString = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
  }).format(new Date(dbUser.createdAt || new Date()));

  const userProps = {
    name: dbUser.fullName || dbUser.username,
    avatar: (dbUser.fullName || dbUser.username).substring(0, 1),
    email: dbUser.email,
    level: dbUser.role === "admin" ? "مدیر سیستم" : "کاربر ورزشکار",
    joinDate: joinDateString,
    coachName: activeSubscription?.coachId?.fullName || "بدون مربی اختصاصی",
  };

  return (
    <AdminDashboardUser 
      initialUser={userProps}
      initialSubscription={subscriptionProps}
      initialWorkouts={workoutDaysProps}
    />
  );
}
