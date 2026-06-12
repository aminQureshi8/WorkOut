import dbConnect from "@/lib/dbConnect";
import Packagefeature from "@/model/Packagefeature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> },
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const packageId = resolvedParams.packageId;

    const body = await req.json();
    const items = Array.isArray(body) ? body : [body];

    const features = await Packagefeature.insertMany(
      items.map((item) => ({ ...item, packageId })),
    );

    return NextResponse.json({ features }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> },
) {
  await dbConnect();
  const resolvedParams = await params;
  const packageId = resolvedParams.packageId;
  const features = await Packagefeature.find({
    packageId,
  }).sort({ sortOrder: 1 });
  return NextResponse.json({ features });
}
