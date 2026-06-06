import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    const pkg = await Package.create({
      ...data,
    });
    return NextResponse.json({ success: true, package: pkg }, { status: 201 });
  } catch (error) {
    const message = error?.message || "Failed to create package";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
