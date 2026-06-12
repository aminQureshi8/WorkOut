import dbConnect from "@/lib/dbConnect";
import Video from "@/model/Video";
import { arvanClient } from "@/lib/arvan";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const formData = await req.formData();
    const videoFile = formData.get("videoFile") as File;
    const thumbnailFile = formData.get("thumbnailFile") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const level = formData.get("level") as string;
    const durationSec = Number(formData.get("durationSec"));
    const tags = JSON.parse((formData.get("tags") as string) || "[]");

    const videoBuffer = Buffer.from(await videoFile.arrayBuffer());
    const videoKey = `videos/${Date.now()}-${videoFile.name}`;
    await arvanClient.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: videoKey,
        Body: videoBuffer,
        ContentType: videoFile.type,
      }),
    );

    const thumbBuffer = Buffer.from(await thumbnailFile.arrayBuffer());
    const thumbKey = `thumbnails/${Date.now()}-${thumbnailFile.name}`;
    await arvanClient.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: thumbKey,
        Body: thumbBuffer,
        ContentType: thumbnailFile.type,
      }),
    );

    const videoUrl = `${process.env.S3_PUBLIC_URL}/${videoKey}`;
    const thumbnailUrl = `${process.env.S3_PUBLIC_URL}/${thumbKey}`;

    const video = await Video.create({
      title,
      description,
      url: videoUrl,
      thumbnailUrl,
      durationSec,
      level,
      tags,
    });

    return NextResponse.json({ video }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
