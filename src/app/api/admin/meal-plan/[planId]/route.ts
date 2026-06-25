import dbConnect from "@/lib/dbConnect";
import MealPlan from "@/model/MealPlan";
import { NextRequest, NextResponse } from "next/server";
import { validateMealPlanUpdate } from "@/validator/meal-plan";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const planId = resolvedParams.planId;

    const data = await req.json();

    const validationResult = validateMealPlanUpdate(data);
    if (validationResult !== true) {
      return NextResponse.json(
        { error: "داده‌های ارسالی معتبر نیستند.", details: validationResult },
        { status: 400 }
      );
    }

    const updatedPlan = await MealPlan.findByIdAndUpdate(
      planId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, plan: updatedPlan }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update meal plan" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const planId = resolvedParams.planId;

    const deletedPlan = await MealPlan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Meal plan deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete meal plan" },
      { status: 500 }
    );
  }
}
