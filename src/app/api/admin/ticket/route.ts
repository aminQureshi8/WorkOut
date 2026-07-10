import dbConnect from "@/lib/dbConnect";
import Ticket from "@/model/Ticket";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "coach")
    ) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

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
      const matchedUsers = await User.find({
        $or: [
          { username: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const userIds = matchedUsers.map((u) => u._id);

      query.$or = [
        { subject: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { userId: { $in: userIds } },
      ];
    }

    const tickets = await Ticket.find(query)
      .select("userId subject description status category createdAt updatedAt")
      .populate("userId", "username fullName email avatar role")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Ticket.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    const totalCount = await Ticket.countDocuments({});
    const pendingCount = await Ticket.countDocuments({ status: "pending" });
    const answeredCount = await Ticket.countDocuments({ status: "answered" });
    const closedCount = await Ticket.countDocuments({ status: "closed" });

    return NextResponse.json({
      tickets,
      total,
      totalPages,
      stats: {
        totalCount,
        pendingCount,
        answeredCount,
        closedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
