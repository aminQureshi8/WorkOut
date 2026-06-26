import dbConnect from "@/lib/dbConnect";
import registerModels from "@/lib/registerModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import SubscriptionModel from "@/model/Subscription";
import OrderModel from "@/model/Order";
import WorkoutPlanModel from "@/model/WorkoutPlan";
import WorkoutDayModel from "@/model/WorkoutDay";
import WorkoutExerciseModel from "@/model/WorkoutExercise";
import SubscriptionView from "@/modules/subscription/SubscriptionView";

export default async function SubscriptionPage() {
  registerModels();
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const subscription = await SubscriptionModel.findOne({
    userId: session.user.id,
    status: { $in: ["active", "trial"] },
    endsAt: { $gt: new Date() },
  })
    .populate("packageId")
    .populate("coachId")
    .populate("orderId");

  let workoutPlan = null;
  let workoutDays: any[] = [];

  if (subscription) {
    const rawPlan = await WorkoutPlanModel.findOne({
      packageId: subscription.packageId?._id,
      isActive: true,
    }).lean();

    if (rawPlan) {
      workoutPlan = JSON.parse(JSON.stringify(rawPlan));

      const days = await WorkoutDayModel.find({ planId: rawPlan._id })
        .sort({ sortOrder: 1 })
        .lean();

      const dayIds = days.map((d) => d._id);
      const exercises = await WorkoutExerciseModel.find({
        dayId: { $in: dayIds },
      })
        .populate("videoId")
        .populate("videoId2")
        .sort({ sortOrder: 1 })
        .lean();

      const mappedDays = days.map((day) => ({
        ...day,
        exercises: exercises.filter(
          (e) => e.dayId.toString() === day._id.toString(),
        ),
      }));

      workoutDays = JSON.parse(JSON.stringify(mappedDays));
    }
  }

  const orders = await OrderModel.find({
    userId: session.user.id,
  })
    .populate("packageId")
    .sort({ createdAt: -1 });

  return (
    <SubscriptionView
      subscription={
        subscription ? JSON.parse(JSON.stringify(subscription)) : null
      }
      workoutPlan={workoutPlan}
      workoutDays={workoutDays}
      orders={orders ? JSON.parse(JSON.stringify(orders)) : []}
    />
  );
}
