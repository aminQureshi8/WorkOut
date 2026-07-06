import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const arvanClient = new S3Client({
  region: "ir-thr-at1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(file: File, folder: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() || "jpg";
  const cleanFolder = folder.endsWith("/") ? folder : `${folder}/`;
  const fileKey = `${cleanFolder}${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;

  await arvanClient.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return `${process.env.S3_PUBLIC_URL}/${fileKey}`;
}
