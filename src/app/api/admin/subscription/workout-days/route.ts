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
  } catch (error) {
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
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
