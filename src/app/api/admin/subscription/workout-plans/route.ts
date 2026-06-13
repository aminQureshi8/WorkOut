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

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, title, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ message: "شناسه برنامه الزامی است" }, { status: 400 });
    }

    const updatedData: any = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description;
    if (isActive !== undefined) updatedData.isActive = isActive;

    const plan = await WorkoutPlan.findByIdAndUpdate(id, updatedData, { new: true });

    if (!plan) {
      return NextResponse.json({ message: "برنامه پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ plan });
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
      return NextResponse.json({ message: "شناسه برنامه الزامی است" }, { status: 400 });
    }

    const plan = await WorkoutPlan.findByIdAndDelete(id);

    if (!plan) {
      return NextResponse.json({ message: "برنامه پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "برنامه با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

