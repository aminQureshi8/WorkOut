import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Otp from "@/model/Otp";
import { toEnglishDigits } from "@/utils/numbers";

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

    const cleanPhone = toEnglishDigits(String(phone));
    const cleanCode = toEnglishDigits(String(code));

    const validOtp = await Otp.findOne({
      $or: [{ phone: cleanPhone }, { phone: cleanPhone.replace(/^0/, "") }],
      code: cleanCode,
    });

    if (!validOtp) {
      return NextResponse.json(
        { message: "کد تایید اشتباه یا منقضی شده است" },
        { status: 400 },
      );
    }

    if (username && password) {
      const existingUser = await User.findOne({
        $or: [
          { phone: cleanPhone },
          { phone: cleanPhone.replace(/^0/, "") },
          { phone: `0${cleanPhone}` },
        ],
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "این شماره تلفن قبلاً ثبت شده است" },
          { status: 409 },
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await User.create({
        username: username.trim(),
        phone: cleanPhone,
        password: hashedPassword,
      });
    }

    await Otp.deleteMany({
      $or: [{ phone: cleanPhone }, { phone: cleanPhone.replace(/^0/, "") }],
    });

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
