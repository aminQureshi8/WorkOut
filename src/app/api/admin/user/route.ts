import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Subscription from "@/model/Subscription";
import Order from "@/model/Order";
import Package from "@/model/Package";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const limit = Number(req.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ status: "active" });
    const expiredUsers = await User.countDocuments({ status: "expired" });
    const blockedUsers = await User.countDocuments({ status: "blocked" });

    const totalPage = Math.ceil(totalUsers / limit);

    const userIds = users.map((u) => u._id);

    await Package.findOne({});

    const subscriptions = await Subscription.find({
      userId: { $in: userIds },
      status: { $in: ["active", "trial"] },
    })
      .populate("packageId", "name")
      .lean();

    const orders = await Order.find({
      userId: { $in: userIds },
      status: "paid",
    }).lean();

    const usersWithDetails = users.map((u) => {
      const activeSub = subscriptions.find(
        (sub) => sub.userId.toString() === u._id.toString(),
      );
      const userOrders = orders.filter(
        (ord) => ord.userId.toString() === u._id.toString(),
      );
      const totalPayments = userOrders.reduce(
        (sum, ord) => sum + (ord.amountPaid || 0),
        0,
      );

      let persianStatus = "فعال";
      if (u.status === "blocked") persianStatus = "مسدود";
      else if (u.status === "expired") persianStatus = "منقضی";

      return {
        ...u,
        package: activeSub?.packageId?.name || "—",
        status: persianStatus,
        totalPayments: totalPayments,
        lastLogin: u.lastLogin
          ? new Date(u.lastLogin).toLocaleDateString("fa-IR")
          : "—",
      };
    });

    return NextResponse.json({
      users: usersWithDetails,
      totalPage,
      totalUsers,
      activeUsers,
      expiredUsers,
      blockedUsers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 },
    );
  }
}
