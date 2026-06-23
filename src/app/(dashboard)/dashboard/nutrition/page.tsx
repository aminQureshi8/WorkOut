import NutritionTracker from "@/modules/dashboard/nutrition/NutritionTracker";
import NutritionLock from "@/modules/dashboard/nutrition/NutritionLock";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SubscriptionModel from "@/model/Subscription";
import { redirect } from "next/navigation";

export const metadata = {
  title: "فیت‌کوچ | مدیریت تغذیه و کالری‌شمار روزانه",
  description:
    "ثبت روزانه وعده‌های غذایی، کنترل کالری دریافتی، پروتئین و هیدراتاسیون بدن در فیت‌کوچ",
};

export default async function NutritionPage() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const subscription = await SubscriptionModel.findOne({
    userId: session.user.id,
    status: { $in: ["active", "trial"] },
    endsAt: { $gt: new Date() },
  });

  if (!subscription) {
    return <NutritionLock />;
  }

  return <NutritionTracker />;
}
