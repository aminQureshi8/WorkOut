import dbConnect from "@/lib/dbConnect";
import Workoutweek from "@/model/Workoutweek";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { packageId } = await req.json();
    const week = await Workoutweek.create({ packageId });
    return NextResponse.json({ week }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const packageId = searchParams.get("packageId");
    const query = packageId ? { packageId } : {};
    const weeks = await Workoutweek.find(query);
    return NextResponse.json({ weeks });
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
      return NextResponse.json({ message: "شناسه الزامی است" }, { status: 400 });
    }
    const week = await Workoutweek.findByIdAndDelete(id);
    if (!week) {
      return NextResponse.json({ message: "یافت نشد" }, { status: 404 });
    }
    return NextResponse.json({ message: "با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
