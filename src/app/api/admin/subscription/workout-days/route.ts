import dbConnect from "@/lib/dbConnect";
import WorkoutDay from "@/model/WorkoutDay";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const days = await WorkoutDay.insertMany(items);
    return NextResponse.json({ days }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId)
      return NextResponse.json(
        { message: "planId الزامی است" },
        { status: 400 },
      );

    const days = await WorkoutDay.find({ planId }).sort({ sortOrder: 1 });
    return NextResponse.json({ days });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, dayName, muscleGroup, sortOrder } = body;

    if (!id) {
      return NextResponse.json({ message: "شناسه روز تمرینی الزامی است" }, { status: 400 });
    }

    const updatedData: any = {};
    if (dayName !== undefined) updatedData.dayName = dayName;
    if (muscleGroup !== undefined) updatedData.muscleGroup = muscleGroup;
    if (sortOrder !== undefined) updatedData.sortOrder = sortOrder;

    const day = await WorkoutDay.findByIdAndUpdate(id, updatedData, { new: true });

    if (!day) {
      return NextResponse.json({ message: "روز تمرینی پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ day });
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
      return NextResponse.json({ message: "شناسه روز تمرینی الزامی است" }, { status: 400 });
    }

    const day = await WorkoutDay.findByIdAndDelete(id);

    if (!day) {
      return NextResponse.json({ message: "روز تمرینی پیدا نشد" }, { status: 404 });
    }

    const WorkoutExercise = (await import("@/model/WorkoutExercise")).default;
    await WorkoutExercise.deleteMany({ dayId: id });

    return NextResponse.json({ message: "روز تمرینی و حرکات آن با موفقیت حذف شدند" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

