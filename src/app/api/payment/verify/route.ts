import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/model/Order";
import Subscription from "@/model/Subscription";
import { VerifyPaymentPayload } from "@/types/order";
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

    const body: VerifyPaymentPayload = await req.json();
    const { orderId, paymentRef } = body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: "شناسه سفارش نامعتبر است" }, { status: 400 });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ message: "سفارش پیدا نشد" }, { status: 404 });
    }

    if (String(order.userId) !== String(session.user.id)) {
      return NextResponse.json({ message: "دسترسی غیرمجاز به سفارش" }, { status: 403 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ message: "این سفارش قبلاً پرداخت شده است" }, { status: 400 });
    }

    order.status = "paid";
    order.paymentRef = paymentRef || "direct-verify";
    await order.save();

    const durationMap: Record<string, number> = {
      monthly: 30,
      quarterly: 90,
      biannual: 180,
    };

    const days = durationMap[order.billingCycle] || 30;
    const startsAt = new Date();
    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + days);

    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const subscription = await Subscription.create({
      orderId: order._id,
      userId: order.userId,
      packageId: order.packageId,
      status: "trial",
      startsAt,
      endsAt,
      trialEndsAt,
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "خطای سرور";

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
