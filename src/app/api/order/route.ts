import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/model/Order";
import Package from "@/model/Package";
import User from "@/model/User";
import { CreateOrderPayload } from "@/types/order";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "لطفاً ابتدا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "شناسه کاربر نامعتبر است" }, { status: 400 });
    }

    const body: CreateOrderPayload = await req.json();
    const { fullName, phone, packageId, billingCycle, discountCode } = body;

    if (!fullName || !phone || !packageId || !billingCycle) {
      return NextResponse.json(
        { message: "لطفاً تمام فیلدهای الزامی را تکمیل کنید" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return NextResponse.json({ message: "شناسه پکیج نامعتبر است" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { fullName, phone },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    const pkg = await Package.findById(packageId);

    if (!pkg || !pkg.isActive) {
      return NextResponse.json(
        { message: "پکیج انتخاب شده معتبر یا فعال نیست" },
        { status: 404 }
      );
    }

    if (pkg.slug === "footballers" && billingCycle !== "monthly") {
      return NextResponse.json(
        { message: "برای این پکیج فقط دوره پرداخت یک ماهه امکان‌پذیر است" },
        { status: 400 }
      );
    }

    const originalAmount = pkg.price[billingCycle];

    if (typeof originalAmount !== "number" || originalAmount <= 0) {
      return NextResponse.json(
        { message: "قیمت پکیج نامعتبر است" },
        { status: 400 }
      );
    }

    let discountPercent = 0;

    if (discountCode && discountCode.trim().toUpperCase() === "FIT2024") {
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
        message: "سفارش با موفقیت ایجاد شد",
        orderId: String(order._id),
        amount: amountPaid,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "خطای سرور";

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
