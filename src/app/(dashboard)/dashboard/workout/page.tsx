import React from "react";
import WorkoutView from "@/modules/dashboard/workout/WorkoutView";
import dbConnect from "@/lib/dbConnect";
import registerModels from "@/lib/registerModels";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Subscription from "@/model/Subscription";

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

  const subscription = await Subscription.findOne(
    { userId: session.user.id },
    "packageId",
  )
    .populate("packageId", "tagline isActive name")
    .lean();

  const plainSubscription = subscription
    ? JSON.parse(JSON.stringify(subscription))
    : null;

  return <WorkoutView subscription={plainSubscription} userId={session.user.id} />;
}
