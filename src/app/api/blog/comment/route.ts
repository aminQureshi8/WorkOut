import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { blogId, name, text, userId } = body;

    if (!blogId || !name || !text) {
      return NextResponse.json(
        { message: "پر کردن تمامی فیلدهای الزامی است." },
        { status: 400 },
      );
    }

    const comment = await Comment.create({
      blogId,
      name,
      text,
      likes: 0,
      userId: userId || null,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
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
        { status: 400 },
      );
    }

    const totalCount = await Comment.countDocuments({ blogId, isApproved: true });

    const comments = await Comment.find({ blogId, isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, comments, totalCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
