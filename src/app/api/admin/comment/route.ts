import dbConnect from "@/lib/dbConnect";
import Comment from "@/model/Comment";
import Blog from "@/model/Blog";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "coach")
    ) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = 10;
    const isApprovedStr = searchParams.get("isApproved");
    const search = searchParams.get("search");

    const skip = (Number(page) - 1) * Number(limit);

    let query: any = {};

    if (isApprovedStr === "true") {
      query.isApproved = true;
    } else if (isApprovedStr === "false") {
      query.isApproved = false;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { text: { $regex: search, $options: "i" } },
      ];
    }

    const comments = await Comment.find(query)
      .populate("blogId", "title slug")
      .populate("userId", "username fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Comment.countDocuments(query);
    const totalPages = Math.ceil(total / Number(limit));

    const totalCount = await Comment.countDocuments({});
    const approvedCount = await Comment.countDocuments({ isApproved: true });
    const pendingCount = await Comment.countDocuments({ isApproved: false });

    return NextResponse.json({
      comments,
      total,
      totalPages,
      stats: {
        totalCount,
        approvedCount,
        pendingCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "coach")
    ) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const body = await req.json();
    const { id, isApproved, text } = body;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه کامنت برای بروزرسانی الزامی است" },
        { status: 400 },
      );
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json(
        { message: "کامنت مورد نظر پیدا نشد" },
        { status: 404 },
      );
    }

    if (isApproved !== undefined) {
      comment.isApproved = isApproved;
    }

    if (text !== undefined) {
      comment.text = text;
    }

    await comment.save();

    return NextResponse.json({ success: true, comment });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "coach")
    ) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "شناسه کامنت الزامی است" },
        { status: 400 },
      );
    }

    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return NextResponse.json(
        { message: "کامنت مورد نظر پیدا نشد" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "کامنت با موفقیت حذف شد",
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
