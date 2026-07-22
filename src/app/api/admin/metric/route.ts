import dbConnect from "@/lib/dbConnect";
import TestMetric from "@/model/TestMetric";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const metrics = await TestMetric.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ metrics });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, category, unit, description, coachId } = body;

    if (!name || !category || !unit) {
      return NextResponse.json(
        { message: "نام متس، دسته‌بندی و واحد اندازه‌گیری الزامی هستند" },
        { status: 400 },
      );
    }

    const newMetric = await TestMetric.create({
      coachId: coachId || null,
      name,
      category,
      unit,
      description: description || "",
    });

    return NextResponse.json({ success: true, metric: newMetric }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create metric" },
      { status: 500 },
    );
  }
}
