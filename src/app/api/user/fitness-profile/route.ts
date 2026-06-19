import dbConnect from "@/lib/dbConnect";
import FitnessProfile from "@/model/Fitnessprofile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { arvanClient } from "@/lib/arvan";
import { PutObjectCommand } from "@aws-sdk/client-s3";

async function uploadBase64ToS3(base64Data: string): Promise<string> {
  const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("فرمت تصویر نامعتبر است");
  }

  const contentType = matches[1];
  const base64Content = matches[2];
  const buffer = Buffer.from(base64Content, "base64");
  const ext = contentType.split("/")[1] || "jpg";
  const imageKey = `fitness-profiles/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

  await arvanClient.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: imageKey,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${process.env.S3_PUBLIC_URL}/${imageKey}`;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "شما وارد سیستم نشده‌اید" },
        { status: 401 }
      );
    }

    const profile = await FitnessProfile.findOne({ userId: session.user.id });
    return NextResponse.json({ profile });
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
        { message: "شما وارد سیستم نشده‌اید" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      goal,
      sessionsPerWeek,
      equipment,
      trainingExperience,
      ageYears,
      heightCm,
      weightKg,
      bodyPhotos,
      notes,
    } = body;

    if (!goal || !sessionsPerWeek || !equipment || !trainingExperience || !ageYears || !heightCm || !weightKg) {
      return NextResponse.json(
        { message: "لطفاً تمامی فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    const uploadedPhotos: string[] = [];
    if (bodyPhotos && Array.isArray(bodyPhotos)) {
      for (const photo of bodyPhotos) {
        if (photo.startsWith("http://") || photo.startsWith("https://")) {
          uploadedPhotos.push(photo);
        } else if (photo.startsWith("data:")) {
          const s3Url = await uploadBase64ToS3(photo);
          uploadedPhotos.push(s3Url);
        }
      }
    }

    let profile = await FitnessProfile.findOne({ userId: session.user.id });

    if (profile) {
      profile.goal = goal;
      profile.sessionsPerWeek = sessionsPerWeek;
      profile.equipment = equipment;
      profile.trainingExperience = trainingExperience;
      profile.ageYears = ageYears;
      profile.heightCm = heightCm;
      profile.weightKg = weightKg;
      profile.bodyPhotos = uploadedPhotos;
      profile.notes = notes || "";
      await profile.save();
    } else {
      profile = await FitnessProfile.create({
        userId: session.user.id,
        goal,
        sessionsPerWeek,
        equipment,
        trainingExperience,
        ageYears,
        heightCm,
        weightKg,
        bodyPhotos: uploadedPhotos,
        notes: notes || "",
      });
    }

    return NextResponse.json({ message: "پروفایل ورزشی با موفقیت ثبت شد", profile });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
