import dbConnect from "@/lib/dbConnect";
import Video from "@/model/Video";
import { arvanClient } from "@/lib/arvan";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

export async function GET() {
  try {
    await dbConnect();
    const videos = await Video.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه ویدیو الزامی است" }, { status: 400 });
    }

    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json({ message: "ویدیو پیدا نشد" }, { status: 404 });
    }

    // Try to delete files from S3 if key can be extracted
    try {
      if (video.url && video.url.includes(process.env.S3_PUBLIC_URL!)) {
        const videoKey = video.url.split(`${process.env.S3_PUBLIC_URL!}/`)[1];
        if (videoKey) {
          await arvanClient.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: videoKey
          }));
        }
      }

      if (video.thumbnailUrl && video.thumbnailUrl.includes(process.env.S3_PUBLIC_URL!)) {
        const thumbKey = video.thumbnailUrl.split(`${process.env.S3_PUBLIC_URL!}/`)[1];
        if (thumbKey) {
          await arvanClient.send(new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: thumbKey
          }));
        }
      }
    } catch (s3Err) {
      console.error("Failed to delete from S3:", s3Err);
    }

    await Video.findByIdAndDelete(id);
    return NextResponse.json({ message: "ویدیو با موفقیت حذف شد" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}


