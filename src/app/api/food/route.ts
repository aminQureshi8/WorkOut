import dbConnect from "@/lib/dbConnect";
import Food from "@/model/Food";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search") || "";
    const all = req.nextUrl.searchParams.get("all") === "true";
    const isAddModal = req.nextUrl.searchParams.get("isAddModal") === "true";
    const type = req.nextUrl.searchParams.get("type") || "";
    const query: any = {};
    const limit = isAddModal ? 10 : 100;

    if (!all) {
      query.isActive = true;
    }

    if (type) {
      query.type = { $in: [type, "all"] };
    }

    if (search.trim()) {
      query.name = { $regex: search, $options: "i" };
    }

    const foods = await Food.find(query).limit(limit).sort({ name: 1 });
    return NextResponse.json(foods, { status: 200 });
  } catch (error: any) {
    console.error("Food API GET Error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const { name, calories, protein, carbs, fat, unit, isActive } = body;
    if (!name || calories === undefined) {
      return NextResponse.json(
        { message: "نام غذا و کالری الزامی است." },
        { status: 400 },
      );
    }

    const exists = await Food.findOne({ name });
    if (exists) {
      return NextResponse.json(
        { message: "غذایی با این نام قبلاً ثبت شده است." },
        { status: 400 },
      );
    }

    const newFood = await Food.create({
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      unit: unit || "گرم",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(newFood, { status: 201 });
  } catch (error: any) {
    console.error("Food API POST Error:", error);
    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
