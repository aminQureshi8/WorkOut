import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; page: string }> },
) {
  try {
    await dbConnect();

    const { role } = await req.json();

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!["user", "admin", "coach"].includes(role)) {
      return NextResponse.json({ error: "Invalid role value" });
    }

    const user = await User.findById(id);
    if (!user) {
      NextResponse.json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    NextResponse.json({ error: "Internal server error" });
  }
}
