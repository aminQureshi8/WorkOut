import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Subscription from "@/model/Subscription";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { message: "شما مجاز به دسترسی به این بخش نیستید." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    const activeSubscription = await Subscription.findOne({
      userId: id,
      status: { $in: ["active", "trial"] },
    })
      .populate("packageId", "name slug colorClass")
      .lean();

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        activeSubscription: activeSubscription || null,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "خطا در دریافت اطلاعات کاربر";
    return NextResponse.json(
      { message: errMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "شما مجاز به دسترسی به این بخش نیستید." },
        { status: 403 }
      );
    }

    const data = await req.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (data.username !== undefined) user.username = data.username;
    if (data.email !== undefined) user.email = data.email.toLowerCase();
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.role !== undefined) {
      if (["user", "admin", "coach"].includes(data.role)) {
        user.role = data.role;
      } else {
        return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
      }
    }
    if (data.status !== undefined) {
      if (["active", "expired", "blocked"].includes(data.status)) {
        user.status = data.status;
      } else {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
