import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { blogId, name, text } = body;

    if (!blogId || !name || !text) {
      return NextResponse.json(
        { message: "پر کردن تمامی فیلدهای الزامی است." },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      blogId,
      name,
      text,
      likes: 0,
    });

    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
