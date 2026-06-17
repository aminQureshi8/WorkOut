import dbConnect from "@/lib/dbConnect";
import Wish from "@/model/Wish";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { blogId } = await req.json();
    if (!blogId) {
      return NextResponse.json({ message: "شناسه مقاله یافت نشد" }, { status: 400 });
    }

    const existingWish = await Wish.findOne({ userId, blogId });

    if (existingWish) {
      await Wish.findByIdAndDelete(existingWish._id);
      return NextResponse.json({ wished: false });
    } else {
      await Wish.create({ userId, blogId });
      return NextResponse.json({ wished: true });
    }
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
