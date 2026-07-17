import dbConnect from "@/lib/dbConnect";
import ExerciseProgress from "@/model/ExerciseProgress";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId, exerciseId, completed } = await req.json();

    if (!userId || !exerciseId) {
      return NextResponse.json(
        { message: "شناسه کاربر و شناسه حرکت الزامی است" },
        { status: 400 }
      );
    }

    const progress = await ExerciseProgress.findOneAndUpdate(
      { userId, exerciseId },
      { $set: { completed } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ progress }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || "خطایی رخ داد" },
      { status: 500 }
    );
  }
}
