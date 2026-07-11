import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/Subscription";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search");

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

    const subscriptions = await Subscription.find({
      userId: { $in: userIds },
      status: { $in: ["active", "trial"] },
    })
      .populate("packageId", "name")
      .lean();

    return NextResponse.json(subscriptions);
  } catch (error) {}
}
