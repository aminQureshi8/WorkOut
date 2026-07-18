import dbConnect from "@/lib/dbConnect";
import WorkoutSessionFeedback from "@/model/WorkoutSessionFeedback";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, dayId, difficulty, energyLevel, hasPain, comment } =
      await req.json();

    if (!userId || !dayId) {
      return NextResponse.json(
        { message: "شناسه کاربر و شناسه روز الزامی است" },
        { status: 400 }
      );
    }

    const feedback = await WorkoutSessionFeedback.findOneAndUpdate(
      { userId, dayId },
      { $set: { difficulty, energyLevel, hasPain, comment } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ feedback }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || "خطایی رخ داد" },
      { status: 500 }
    );
  }
}
