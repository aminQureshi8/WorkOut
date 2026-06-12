import dbConnect from "@/lib/dbConnect";
import WorkoutExercise from "@/model/WorkoutExercise";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const exercises = await WorkoutExercise.insertMany(items);
    return NextResponse.json({ exercises }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const dayId = searchParams.get("dayId");

    if (!dayId)
      return NextResponse.json(
        { message: "dayId الزامی است" },
        { status: 400 },
      );

    const exercises = await WorkoutExercise.find({ dayId })
      .populate("videoId", "url thumbnailUrl title")
      .sort({ sortOrder: 1 });

    return NextResponse.json({ exercises });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
