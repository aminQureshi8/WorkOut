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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, name, sets, reps, restSec, videoId, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ message: "شناسه حرکت الزامی است" }, { status: 400 });
    }

    const updatedData: any = {};
    if (name !== undefined) updatedData.name = name;
    if (sets !== undefined) updatedData.sets = sets;
    if (reps !== undefined) updatedData.reps = reps;
    if (restSec !== undefined) updatedData.restSec = restSec;
    if (videoId !== undefined) updatedData.videoId = videoId || null;
    if (sortOrder !== undefined) updatedData.sortOrder = sortOrder;

    const exercise = await WorkoutExercise.findByIdAndUpdate(id, updatedData, { new: true });

    if (!exercise) {
      return NextResponse.json({ message: "حرکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ exercise });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه حرکت الزامی است" }, { status: 400 });
    }

    const exercise = await WorkoutExercise.findByIdAndDelete(id);

    if (!exercise) {
      return NextResponse.json({ message: "حرکت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "حرکت با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

