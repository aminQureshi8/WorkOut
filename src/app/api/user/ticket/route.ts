import dbConnect from "@/lib/dbConnect";
import Ticket from "@/model/Ticket";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadFileToS3 } from "@/lib/arvan";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز. لطفا وارد شوید." },
        { status: 401 },
      );
    }

    const tickets = await Ticket.find({ userId: session.user.id })
      .populate("userId", "username fullName email avatar role")
      .populate("messages.senderId", "username fullName email avatar role")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ tickets });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز. لطفا وارد شوید." },
        { status: 401 },
      );
    }

    let subject = "";
    let description = "";
    let category = "";
    let file: File | null = null;

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      subject = (formData.get("subject") as string) || "";
      description = (formData.get("description") as string) || "";
      category = (formData.get("category") as string) || "";
      file = formData.get("file") as File | null;
    } else {
      const body = await req.json();
      subject = body.subject || "";
      description = body.description || "";
      category = body.category || "";
    }

    if (!subject || !description || !category) {
      return NextResponse.json(
        { message: "پر کردن موضوع، شرح پیام و دسته‌بندی الزامی است." },
        { status: 400 },
      );
    }

    const validCategories = [
      "workout",
      "nutrition",
      "form_check",
      "injury",
      "technical",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { message: "دسته‌بندی نامعتبر است." },
        { status: 400 },
      );
    }

    let videoUrl = "";
    if (file && file instanceof File && file.size > 0) {
      videoUrl = await uploadFileToS3(file, "tickets");
    }

    const ticket = await Ticket.create({
      userId: session.user.id,
      subject: subject.trim(),
      description: description.trim(),
      category,
      videoUrl: videoUrl || undefined,
      status: "pending",
      messages: [],
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate("userId", "username fullName email avatar role")
      .lean();

    return NextResponse.json(
      { success: true, ticket: populatedTicket },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    // Session Check
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "دسترسی غیرمجاز. لطفا وارد شوید." },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { id, messageText } = body;

    if (!id || !messageText || !messageText.trim()) {
      return NextResponse.json(
        { message: "شناسه تیکت و متن پیام الزامی است." },
        { status: 400 },
      );
    }

    // Verify ownership: users can only update/reply to their own tickets
    const ticket = await Ticket.findOne({ _id: id, userId: session.user.id });
    if (!ticket) {
      return NextResponse.json(
        { message: "تیکت یافت نشد یا دسترسی غیرمجاز است." },
        { status: 404 },
      );
    }

    if (ticket.status === "closed") {
      return NextResponse.json(
        { message: "این تیکت بسته شده است و امکان ارسال پیام وجود ندارد." },
        { status: 400 },
      );
    }

    const dbUser = await User.findById(session.user.id);
    const senderName =
      dbUser?.fullName ||
      dbUser?.username ||
      session.user.username ||
      "کاربر فیت‌کوچ";

    ticket.messages.push({
      senderId: session.user.id,
      senderName,
      text: messageText.trim(),
      createdAt: new Date(),
    });

    // Reset status to pending so it flags the support team
    ticket.status = "pending";

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate("userId", "username fullName email avatar role")
      .populate("messages.senderId", "username fullName email avatar role")
      .lean();

    return NextResponse.json({ success: true, ticket: updatedTicket });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
