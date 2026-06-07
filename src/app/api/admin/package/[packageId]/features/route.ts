import dbConnect from "@/lib/dbConnect";
import Packagefeature from "@/model/Packagefeature";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> },
) {
  await dbConnect();
  const { name, description, included, sortOrder } = await req.json();

  const resolvedParams = await params;
  const packageId = resolvedParams.packageId;

  const feature = await Packagefeature.create({
    packageId,
    name,
    description,
    included,
    sortOrder,
  });

  return NextResponse.json({ feature }, { status: 201 });
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
