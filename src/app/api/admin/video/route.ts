import dbConnect from "@/lib/dbConnect";
import Video from "@/model/Video";
import { NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export async function POST(req: NextRequestWithAuth) {
  await dbConnect();
  const { title, description, url, thumbnailUrl, durationSec, level, tags } =
    await req.json();

  const video = await Video.create({
    title,
    url,
    description,
    thumbnailUrl,
    durationSec,
    level,
    tags,
  });

  return NextResponse.json({ video }, { status: 201 });
}
