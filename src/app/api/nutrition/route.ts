import dbConnect from "@/lib/dbConnect";
import NutritionLog from "@/model/NutritionLog";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "شناسه کاربر معتبر نمی‌باشد یا ارسال نشده است." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      date,
      meals,
      waterIntake,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
    } = body;

    if (!date) {
      return NextResponse.json(
        { message: "ارسال تاریخ الزامی است." },
        { status: 400 }
      );
    }

    const updateFields: any = {};
    if (meals !== undefined) updateFields.meals = meals;
    if (waterIntake !== undefined) updateFields.waterIntake = waterIntake;
    if (targetCalories !== undefined) updateFields.targetCalories = targetCalories;
    if (targetProtein !== undefined) updateFields.targetProtein = targetProtein;
    if (targetCarbs !== undefined) updateFields.targetCarbs = targetCarbs;
    if (targetFat !== undefined) updateFields.targetFat = targetFat;

    const log = await NutritionLog.findOneAndUpdate(
      { userId, date },
      updateFields,
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(log, { status: 200 });
  } catch (error: any) {
    console.error("Nutrition API POST Error:", error);
    return NextResponse.json(
      { message: error.message || "خطای سرور در ثبت اطلاعات تغذیه." },
      { status: 500 }
    );
  }
}