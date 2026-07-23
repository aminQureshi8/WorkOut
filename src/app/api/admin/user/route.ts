import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Subscription from "@/model/Subscription";
import Order from "@/model/Order";
import Package from "@/model/Package";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "شما مجاز به دسترسی به این بخش نیستید." },
        { status: 403 }
      );
    }

    const page = Number(req.nextUrl.searchParams.get("page") || "1");
    const limit = Number(req.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [users, totalUsers, activeUsers, expiredUsers, blockedUsers] =
      await Promise.all([
        User.find({}).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        User.countDocuments({}),
        User.countDocuments({ status: "active" }),
        User.countDocuments({ status: "expired" }),
        User.countDocuments({ status: "blocked" }),
      ]);

    const totalPage = Math.ceil(totalUsers / limit);
    const userIds = users.map((u) => u._id);

    await Package.findOne({});

    const [subscriptions, orders] = await Promise.all([
      Subscription.find({
        userId: { $in: userIds },
        status: { $in: ["active", "trial"] },
      })
        .populate("packageId", "name")
        .lean(),
      Order.find({
        userId: { $in: userIds },
        status: "paid",
      }).lean(),
    ]);

    const usersWithDetails = users.map((u) => {
      const activeSub = subscriptions.find(
        (sub) => sub.userId.toString() === u._id.toString()
      );
      const userOrders = orders.filter(
        (ord) => ord.userId.toString() === u._id.toString()
      );
      const totalPayments = userOrders.reduce(
        (sum, ord) => sum + (ord.amountPaid || 0),
        0
      );

      let persianStatus = "فعال";
      if (u.status === "blocked") persianStatus = "مسدود";
      else if (u.status === "expired") persianStatus = "منقضی";

      return {
        ...u,
        package: activeSub?.packageId?.name || "—",
        status: persianStatus,
        totalPayments,
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
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json(
      { message: errMessage },
      { status: 500 }
    );
  }
}
