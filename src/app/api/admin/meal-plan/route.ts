import dbConnect from "@/lib/dbConnect";
import MealPlan from "@/model/MealPlan";
import Food from "@/model/Food";
import Package from "@/model/Package";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const plans = await MealPlan.find({})
      .populate("packageId")
      .populate("breakfast.foodId")
      .populate("lunch.foodId")
      .populate("dinner.foodId")
      .populate("snack.foodId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ plans }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const { packageId, title, description, breakfast, lunch, dinner, snack, isActive } = body;

    if (!packageId || !title) {
      return NextResponse.json(
        { error: "پکیج و عنوان برنامه غذایی الزامی هستند." },
        { status: 400 }
      );
    }

    const newPlan = await MealPlan.create({
      packageId,
      title,
      description: description || "",
      breakfast: breakfast || [],
      lunch: lunch || [],
      dinner: dinner || [],
      snack: snack || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, plan: newPlan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create meal plan" },
      { status: 500 }
    );
  }
}
