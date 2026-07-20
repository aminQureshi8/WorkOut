import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Otp from "@/model/Otp";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "شماره تلفن الزامی است" },
        { status: 400 },
      );
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { message: "فرمت شماره تلفن معتبر نیست (مثال: 09123456789)" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({ phone: phone.trim() });

    if (existingUser) {
      return NextResponse.json(
        { message: "این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const otpCode = Math.floor(10000 + Math.random() * 90000).toString();

    await Otp.deleteMany({ phone: phone.trim() });

    await Otp.create({
      phone: phone.trim(),
      code: otpCode,
    });

    return NextResponse.json(
      {
        message: "کد تایید با موفقیت ارسال شد",
        code: otpCode,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 },
    );
  }
}
