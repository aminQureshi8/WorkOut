import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Subscription from "@/model/Subscription";
import Blog from "@/model/Blog";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const usersCount = await User.countDocuments({});
    const subscriptionsCount = await Subscription.countDocuments({});
    const articlesCount = await Blog.countDocuments({});

    return NextResponse.json({
      usersCount,
      subscriptionsCount,
      articlesCount,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
