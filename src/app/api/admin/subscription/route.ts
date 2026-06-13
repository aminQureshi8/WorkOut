import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/Subscription";
import User from "@/model/User";
import Package from "@/model/Package";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      const users = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = users.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    const subscriptions = await Subscription.find(query)
      .populate("userId", "username fullName email phone")
      .populate("packageId", "name slug colorClass price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Subscription.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    return NextResponse.json({ subscriptions, total, totalPages });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, packageId, status, startsAt, endsAt } = body;

    if (!userId || !packageId) {
      return NextResponse.json(
        { message: "کاربر و پکیج الزامی هستند" },
        { status: 400 },
      );
    }

    const subscription = await Subscription.create({
      userId,
      packageId,
      status: status || "active",
      startsAt: startsAt ? new Date(startsAt) : new Date(),
      endsAt: endsAt
        ? new Date(endsAt)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      orderId: new mongoose.Types.ObjectId(), // Generate dummy orderId for manual subscriptions
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, status, startsAt, endsAt, coachId } = body;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه اشتراک الزامی است" },
        { status: 400 },
      );
    }

    const updatedData: any = {};
    if (status) updatedData.status = status;
    if (startsAt) updatedData.startsAt = new Date(startsAt);
    if (endsAt) updatedData.endsAt = new Date(endsAt);
    if (coachId !== undefined) updatedData.coachId = coachId || null;

    const subscription = await Subscription.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!subscription) {
      return NextResponse.json({ message: "اشتراک پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "شناسه اشتراک الزامی است" },
        { status: 400 },
      );
    }

    const subscription = await Subscription.findByIdAndDelete(id);

    if (!subscription) {
      return NextResponse.json({ message: "اشتراک پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "اشتراک با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
