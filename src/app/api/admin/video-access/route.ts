import dbConnect from "@/lib/dbConnect";
import Videoaccess from "@/model/Videoaccess";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { packageId, videoId } = await req.json();

    const exists = await Videoaccess.findOne({ packageId, videoId });
    if (exists) {
      return NextResponse.json({ message: "قبلاً اضافه شده" }, { status: 400 });
    }

    const access = await Videoaccess.create({ packageId, videoId });
    return NextResponse.json({ access }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
