import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/Subscription";
import User from "@/model/User";
import Pr from "@/model/Pr";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search");
    if (!search || !search.trim()) {
      return NextResponse.json([]);
    }

    const findUsers = await User.find(
      {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      },
      "fullName username",
    );

    const userIds = findUsers.map((user) => user._id);

    const subscriptions = await Subscription.find(
      {
        userId: { $in: userIds },
        status: { $in: ["active", "trial"] },
      },
      "userId",
    )

      .populate("userId", "username fullName email")
      .lean();

    return NextResponse.json(subscriptions);
  } catch (error) {}
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, category, testName, value, unit, date, notes } = body;

    if (!userId || !category || !testName || value === undefined || !unit) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی ناقص است" },
        { status: 400 },
      );
    }

    const parsedDate = date ? new Date(date) : new Date();

    const newPr = await Pr.create({
      userId,
      category,
      testName,
      value: Number(value),
      unit,
      date: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
      notes: notes || "",
    });

    return NextResponse.json({ success: true, pr: newPr });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create PR record" },
      { status: 500 },
    );
  }
}
