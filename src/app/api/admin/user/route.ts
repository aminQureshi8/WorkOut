import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const page = req.nextUrl.searchParams.get("page") || 1;
    const limit = 6;
    const skip = (Number(page) - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit).lean();

    const totalUsers = await User.countDocuments({});
    const totalPage = Math.ceil(totalUsers / limit);

    return NextResponse.json({ users, totalPage , totalUsers });
  } catch (error) {}
}
