import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcrypt";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../model/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
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

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "فرمت ایمیل معتبر نیست" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "ثبت نام با موفقیت انجام شد",
      },
      { status: 201 },
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 },
    );
  }
}
