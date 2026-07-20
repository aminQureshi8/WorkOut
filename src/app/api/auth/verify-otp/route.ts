import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Otp from "@/model/Otp";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { phone, code, username, password } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { message: "شماره تلفن و کد تایید الزامی هستند" },
        { status: 400 },
      );
    }

    const validOtp = await Otp.findOne({
      phone: phone.trim(),
      code: code.trim(),
    });

    if (!validOtp) {
      return NextResponse.json(
        { message: "کد تایید اشتباه یا منقضی شده است" },
        { status: 400 },
      );
    }

    if (username && password) {
      const existingUser = await User.findOne({ phone: phone.trim() });
      if (existingUser) {
        return NextResponse.json(
          { message: "این شماره تلفن قبلاً ثبت شده است" },
          { status: 409 },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await User.create({
        username: username.trim(),
        phone: phone.trim(),
        password: hashedPassword,
      });
    }

    await Otp.deleteMany({ phone: phone.trim() });

    return NextResponse.json(
      { message: "تایید با موفقیت انجام شد" },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 },
    );
  }
}
