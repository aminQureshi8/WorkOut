import React from "react";
import WorkoutView from "@/modules/dashboard/workout/WorkoutView";
import dbConnect from "@/lib/dbConnect";
import registerModels from "@/lib/registerModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Subscription from "@/model/Subscription";
import Workoutmonth from "@/model/Workoutmonth";
import Workoutweek from "@/model/Workoutweek";
import WorkoutDay from "@/model/WorkoutDay";
import WorkoutExercise from "@/model/WorkoutExercise";
import type { DayItem } from "@/types/workout";

export const metadata = {
  title: "استار فیت | برنامه تمرینی من",
  description:
    "مشاهده برنامه تمرینی اختصاصی، آموزش حرکات و ثبت رکوردها در استار فیت",
};

export default async function page() {
  registerModels();
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const subscription = await Subscription.findOne({
    userId: session.user.id,
    status: { $in: ["active", "trial"] },
    endsAt: { $gt: new Date() },
  })
    .populate("packageId")
    .populate("coachId")
    .populate("orderId");

  let workoutPlan = null;
  let workoutDays: DayItem[] = [];

  if (subscription) {
    const rawPlan = await Workoutmonth.findOne({
      packageId: subscription.packageId?._id,
    }).lean();

    if (rawPlan) {
      workoutPlan = {
        _id: rawPlan._id.toString(),
        packageId: rawPlan.packageId.toString(),
        title: rawPlan.title || subscription.packageId?.name || "برنامه تمرینی من",
        description: rawPlan.description || subscription.packageId?.tagline || "",
        isActive: true,
      };

      const weeks = await Workoutweek.find({
        packageId: subscription.packageId?._id,
      }).sort({ createdAt: 1 }).lean();

      if (weeks && weeks.length > 0) {
        const activeWeek = weeks[0];
        const days = await WorkoutDay.find({ planId: activeWeek._id })
          .sort({ sortOrder: 1 })
          .lean();

        const dayIds = days.map((d) => d._id);
        const exercises = await WorkoutExercise.find({
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
  }

  console.log(workoutDays);
  console.log(workoutPlan);

  return <WorkoutView workoutDays={workoutDays} workoutPlan={workoutPlan} />;
}
