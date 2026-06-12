import dbConnect from "@/lib/dbConnect";
import WorkoutPlan from "@/model/WorkoutPlan";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { packageId, title, description } = await req.json();

    const plan = await WorkoutPlan.create({ packageId, title, description });
    return NextResponse.json({ plan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("packageId");

    const query = packageId
      ? { packageId, isActive: true }
      : { isActive: true };
    const plans = await WorkoutPlan.find(query);
    return NextResponse.json({ plans });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
