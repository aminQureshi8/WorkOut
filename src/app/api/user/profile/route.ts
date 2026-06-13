import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "شما وارد سیستم نشده‌اید" },
        { status: 401 },
      );
    }

    const user = await User.findById(session.user.id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "شما وارد سیستم نشده‌اید" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { username, fullName, phone, email, password } = body;

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "کاربر پیدا نشد" }, { status: 404 });
    }

    if (username && username.toLowerCase() !== user.username.toLowerCase()) {
      // Validate username format (e.g., alphanumeric, no spaces, min length 3)
      if (username.length < 3) {
        return NextResponse.json(
          { message: "نام کاربری باید حداقل ۳ کاراکتر باشد" },
          { status: 400 },
        );
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return NextResponse.json(
          { message: "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره (_) باشد" },
          { status: 400 },
        );
      }
      const existingUsername = await User.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return NextResponse.json(
          { message: "این نام کاربری قبلاً توسط کاربر دیگری ثبت شده است" },
          { status: 400 },
        );
      }
      user.username = username.toLowerCase();
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return NextResponse.json(
          { message: "این ایمیل قبلاً توسط کاربر دیگری ثبت شده است" },
          { status: 400 },
        );
      }
      user.email = email.toLowerCase();
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
