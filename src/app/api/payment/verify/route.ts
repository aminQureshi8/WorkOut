import dbConnect from "@/lib/dbConnect";
import Order from "@/model/Order";
import Subscription from "@/model/Subscription";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const { orderId, paymentRef } = await req.json();

  const order = await Order.findById(orderId);
  if (!order)
    return NextResponse.json({ message: "سفارش پیدا نشد" }, { status: 404 });
  if (order.status === "paid")
    return NextResponse.json({ message: "قبلاً پرداخت شده" }, { status: 400 });

  order.status = "paid";
  order.paymentRef = paymentRef;
  await order.save();

  const durationMap: Record<string, number> = { monthly: 30, quarterly: 90, biannual: 180 };
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
}
