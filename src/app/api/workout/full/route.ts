import dbConnect from "@/lib/dbConnect";
import WorkoutPlan from "@/model/WorkoutPlan";
import WorkoutDay from "@/model/WorkoutDay";
import WorkoutExercise from "@/model/WorkoutExercise";
import Subscription from "@/model/Subscription";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import "@/model/Video"

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ message: "لاگین نیستی" }, { status: 401 });

    const subscription = await Subscription.findOne({
      userId: session.user.id,
      status: { $in: ["active", "trial"] },
      endsAt: { $gt: new Date() },
    });

    if (!subscription)
      return NextResponse.json(
        { message: "اشتراک فعال نداری" },
        { status: 403 },
      );

    const plan = await WorkoutPlan.findOne({
      packageId: subscription.packageId,
      isActive: true,
    });

    if (!plan)
      return NextResponse.json(
        { message: "برنامه تمرینی پیدا نشد" },
        { status: 404 },
      );

    const days = await WorkoutDay.find({ planId: plan._id }).sort({
      sortOrder: 1,
    });

    const dayIds = days.map((d) => d._id);
    const exercises = await WorkoutExercise.find({ dayId: { $in: dayIds } })
      .populate("videoId", "url thumbnailUrl title")
      .populate("videoId2", "url thumbnailUrl title")
      .sort({ sortOrder: 1 });

    const daysWithExercises = days.map((day) => ({
      _id: day._id,
      dayName: day.dayName,
      muscleGroup: day.muscleGroup,
      sortOrder: day.sortOrder,
      exercises: exercises.filter(
        (e) => e.dayId.toString() === day._id.toString(),
      ),
    }));

    return NextResponse.json({
      plan: {
        _id: plan._id,
        title: plan.title,
        description: plan.description,
      },
      days: daysWithExercises,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
