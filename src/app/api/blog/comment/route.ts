import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "جهت ثبت نظر ابتدا وارد حساب کاربری خود شوید." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { blogId, text } = body;

    if (!blogId || !text || !text.trim()) {
      return NextResponse.json(
        { message: "پر کردن تمامی فیلدهای الزامی است." },
        { status: 400 }
      );
    }

    const commenterName = session.user.fullName || session.user.username || "کاربر فیت‌کوچ";

    const comment = await Comment.create({
      blogId,
      name: commenterName,
      text: text.trim(),
      likes: 0,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "خطای سرور";
    return NextResponse.json({ message: errMessage }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const blogId = searchParams.get("blogId");

    const page = req.nextUrl.searchParams.get("page") || 1;
    const limit = 6;
    const skip = (Number(page) - 1) * limit;

    if (!blogId) {
      return NextResponse.json(
        { message: "شناسه مقاله الزامی است." },
        { status: 400 }
      );
    }

    const totalCount = await Comment.countDocuments({ blogId, isApproved: true });

    const comments = await Comment.find({ blogId, isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, comments, totalCount }, { status: 200 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "خطای سرور";
    return NextResponse.json({ message: errMessage }, { status: 500 });
  }
}
