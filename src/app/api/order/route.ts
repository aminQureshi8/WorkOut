import dbConnect from "@/lib/dbConnect";
import Order from "@/model/Order";
import User from "@/model/User";
import Package from "@/model/Package";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }

    const { fullName, phone, packageId, billingCycle, discountCode } =
      await req.json();

    if (!fullName || !phone || !packageId || !billingCycle) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        phone,
      },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg) {
      return NextResponse.json(
        { message: "Package not found" },
        { status: 404 },
      );
    }

    const originalAmount = pkg.price[billingCycle];

    let discountPercent = 0;

    if (discountCode === "FIT2024") {
      discountPercent = 15;
    }

    const amountPaid =
      originalAmount - (originalAmount * discountPercent) / 100;

    const order = await Order.create({
      userId,
      packageId,
      billingCycle,
      originalAmount,
      discountPercent,
      amountPaid,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Order created",
        orderId: order._id,
        amount: amountPaid,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Order API Error:", error);

    return NextResponse.json(
      { message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
