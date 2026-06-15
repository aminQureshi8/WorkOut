import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";
import PackageFeature from "@/model/Packagefeature";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const packageId = resolvedParams.packageId;

    const data = await req.json();
    const { features, ...packageData } = data;

    const pkg = await Package.findByIdAndUpdate(
      packageId,
      { ...packageData },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (Array.isArray(features)) {
      // Clean up old features and write new ones
      await PackageFeature.deleteMany({ packageId });
      if (features.length > 0) {
        await PackageFeature.insertMany(
          features.map((featText: string, index: number) => ({
            packageId,
            name: featText.trim(),
            included: true,
            sortOrder: index,
          }))
        );
      }
    }

    const updatedFeatures = await PackageFeature.find({ packageId }).sort({ sortOrder: 1 });

    return NextResponse.json({
      success: true,
      package: {
        ...pkg.toObject(),
        features: updatedFeatures,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update package" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const packageId = resolvedParams.packageId;

    const pkg = await Package.findByIdAndDelete(packageId);
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    // Delete associated features
    await PackageFeature.deleteMany({ packageId });

    return NextResponse.json({ success: true, message: "Package deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete package" },
      { status: 500 }
    );
  }
}
