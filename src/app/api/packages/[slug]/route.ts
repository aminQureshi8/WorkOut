import { json } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  await dbConnect();

  const { slug } = params;
  if (!slug) {
    return json({ error: "Package slug is required" }, { status: 400 });
  }

  try {
    const packageData = await Package.findOne({ slug }).lean();
    if (!packageData) {
      return json({ error: "Package not found" }, { status: 404 });
    }
    return json(packageData);
  } catch (error) {
    console.error("Error fetching package:", error);
    return json({ error: error.message }, { status: 500 });
  }
}
