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
        { status: 400 },
      );
    }

    await ExerciseProgress.findOneAndUpdate(
      { userId, exerciseId },
      { $set: { completed } },
      { new: true, upsert: true },
    );

    return NextResponse.json({ message: "ساخته شد" }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || "خطایی رخ داد" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get("userid");

    if (!userId) {
      return NextResponse.json(
        { message: "شناسه کاربر الزامی است" },
        { status: 400 },
      );
    }

    const progressList = await ExerciseProgress.find({ userId }, "completed exerciseId");
    return NextResponse.json({ progress: progressList }, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { message: err.message || "خطایی رخ داد" },
      { status: 500 },
    );
  }
}
