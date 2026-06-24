import dbConnect from "@/lib/dbConnect";
import Food from "@/model/Food";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ foodId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const foodId = resolvedParams.foodId;

    const data = await req.json();

    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedFood) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFood, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update food" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ foodId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const foodId = resolvedParams.foodId;

    const deletedFood = await Food.findByIdAndDelete(foodId);

    if (!deletedFood) {
      return NextResponse.json({ message: "Food not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Food deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete food" },
      { status: 500 }
    );
  }
}
