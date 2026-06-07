import dbConnect from "@/lib/dbConnect";
import Videoaccess from "@/model/Videoaccess";
import { NextResponse } from "next/server";

// app/api/admin/video-access/route.ts
export async function POST(req: NextResponse) {
  await dbConnect();
  const { packageId, videoId } = await req.json();

  const access = await Videoaccess.create({ packageId, videoId });

  return NextResponse.json({ access }, { status: 201 });
}