import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import Otp from "@/model/Otp";
import { toEnglishDigits } from "@/utils/numbers";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { phone, type } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "شماره تلفن الزامی است" },
        { status: 400 }
      );
    }

    const cleanPhone = toEnglishDigits(String(phone));

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { message: "فرمت شماره تلفن معتبر نیست (مثال: 09123456789)" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: cleanPhone.replace(/^0/, "") },
        { phone: `0${cleanPhone}` },
      ],
    });

    if (type === "login" && !existingUser) {
      return NextResponse.json(
        { message: "حساب کاربری با این شماره یافت نشد" },
        { status: 404 }
      );
    }

    if (type === "register" && existingUser) {
      return NextResponse.json(
        { message: "این شماره تلفن قبلاً ثبت شده است" },
        { status: 409 }
      );
    }

    const otpCode = Math.floor(10000 + Math.random() * 90000).toString();

    await Otp.deleteMany({
      $or: [{ phone: cleanPhone }, { phone: cleanPhone.replace(/^0/, "") }],
    });

    await Otp.create({
      phone: cleanPhone,
      code: otpCode,
    });

    const smsUsername = process.env.SMS_IR_USERNAME;
    const smsPassword = process.env.SMS_IR_PASSWORD;
    const smsLine = process.env.SMS_IR_LINE;

    if (smsUsername && smsPassword && smsLine) {
      const smsText = encodeURIComponent(`کد ورود شما : ${otpCode}`);
      await fetch(
        `https://api.sms.ir/v1/send?username=${smsUsername}&password=${smsPassword}&mobile=${cleanPhone}&line=${smsLine}&text=${smsText}`,
        {
          method: "POST",
          headers: {
            Accept: "text/plain",
          },
        }
      ).catch(() => {});
    }

    return NextResponse.json(
      { message: "کد تایید با موفقیت ارسال شد" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "خطای سرور، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
