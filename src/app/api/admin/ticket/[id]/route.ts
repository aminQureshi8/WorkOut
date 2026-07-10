import dbConnect from "@/lib/dbConnect";
import Ticket from "@/model/Ticket";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "coach")) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه تیکت نامعتبر است" }, { status: 400 });
    }

    const ticket = await Ticket.findById(id, "-__v")
      .populate("userId", "username fullName email avatar role")
      .populate("messages.senderId", "username fullName email avatar role")
      .lean();

    if (!ticket) {
      return NextResponse.json({ message: "تیکت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "خطای سرور در دریافت جزئیات تیکت" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "coach")) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه تیکت نامعتبر است" }, { status: 400 });
    }

    const body = await req.json();
    const { status, messageText } = body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return NextResponse.json({ message: "تیکت یافت نشد" }, { status: 404 });
    }

    if (status) {
      ticket.status = status;
    }

    if (messageText && messageText.trim()) {
      const dbAdmin = await User.findById(session.user.id);
      const senderName = dbAdmin?.fullName || dbAdmin?.username || session.user.username || "پشتیبان فیت‌کوچ";

      ticket.messages.push({
        senderId: session.user.id,
        senderName,
        text: messageText.trim(),
        createdAt: new Date(),
      });

      if (!status) {
        ticket.status = "answered";
      }
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("userId", "username fullName email avatar role")
      .populate("messages.senderId", "username fullName email avatar role")
      .lean();

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "admin" && session.user.role !== "coach")) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "شناسه تیکت نامعتبر است" }, { status: 400 });
    }

    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) {
      return NextResponse.json({ message: "تیکت یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تیکت با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || "خطای سرور" }, { status: 500 });
  }
}
