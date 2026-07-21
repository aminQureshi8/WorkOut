import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { toEnglishDigits } from "@/utils/numbers";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { username, phone, password, confirmPassword } = body;

    if (!username || !phone || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "همه فیلدها الزامی هستند" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "رمز عبور و تکرار آن یکسان نیستند" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "رمز عبور حداقل باید ۶ کاراکتر باشد" },
        { status: 400 },
      );
    }

    const cleanPhone = toEnglishDigits(String(phone));

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { message: "فرمت شماره تلفن معتبر نیست (مثال: 09123456789)" },
        { status: 400 },
      );
    }

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

    return NextResponse.json(
      {
        message: "ثبت نام با موفقیت انجام شد",
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { message: "این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 },
    );
  }
}
