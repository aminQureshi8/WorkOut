import React from "react";
import WorkoutView from "@/modules/dashboard/workout/WorkoutView";
import dbConnect from "@/lib/dbConnect";
import registerModels from "@/lib/registerModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Subscription from "@/model/Subscription";
import Workoutmonth from "@/model/Workoutmonth";
import WorkoutDay from "@/model/WorkoutDay";
import WorkoutExercise from "@/model/WorkoutExercise";

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
  let workoutDays: any[] = [];

  if (subscription) {
    const rawPlan = await Workoutmonth.findOne({
      packageId: subscription.packageId?._id,
    }).lean();

    if (rawPlan) {
      workoutPlan = JSON.parse(JSON.stringify(rawPlan));

      const days = await WorkoutDay.find({ planId: rawPlan._id })
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

  console.log(workoutDays);
  console.log(workoutPlan);

  return <WorkoutView workoutDays={workoutDays} workoutPlan={workoutPlan} />;
}
