import dbConnect from "@/lib/dbConnect";
import MealPlan from "@/model/MealPlan";
import { NextRequest, NextResponse } from "next/server";
import { validateMealPlan } from "@/validator/meal-plan";

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

    const validationResult = validateMealPlan(body);
    if (validationResult !== true) {
      return NextResponse.json(
        { error: "داده‌های ارسالی معتبر نیستند.", details: validationResult },
        { status: 400 }
      );
    }

    const { packageId, title, description, breakfast, lunch, dinner, snack, isActive } = body;

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
