import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  await dbConnect();

  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: "Package slug is required" }, { status: 400 });
  }

  try {
    const packageData = await Package.findOne({ slug }).lean();
    if (!packageData) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json(packageData);
  } catch (error: any) {
    console.error("Error fetching package:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

