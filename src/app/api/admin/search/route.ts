import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const query = req.nextUrl.searchParams.get("query");

    const userFind = await User.find({
      $or: [
        { email: { $regex: query, $options: "i" } },
        { username: { $regex: query, $options: "i" } },
      ],
    }).limit(7);

    return NextResponse.json({ userFind });
  } catch (error) {}
}
