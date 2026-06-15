import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const data = await req.json();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update allowable fields
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
  } catch (error: any) {
    console.error("PATCH error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
