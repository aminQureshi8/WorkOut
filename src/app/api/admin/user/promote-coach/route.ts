import dbConnect from "@/lib/dbConnect";
import Coach from "@/model/Coach";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { userId } = await req.json();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ error: "یوزر پیدا نشد" }, { status: 404 });
    if (user.role === "coach")
      return NextResponse.json({ error: "قبلاً مربی شده" }, { status: 400 });

    user.role = "coach";
    user.save();

    const coach = await Coach.create({
      userId: user._id,
      name: user.name,
      specialties: [],
    });

    return NextResponse.json({ success: true, coach }, { status: 201 });
  } catch (error) {}
}
