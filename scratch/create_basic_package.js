const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load .env.local
const envPath = path.join(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const parts = line.split("=");
    if (parts.length === 2) {
      process.env[parts[0].trim()] = parts[1].trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/starfit";

// Define schemas inline to avoid Next.js alias imports issues in plain Node
const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    price: {
      monthly: { type: Number, required: true },
      quarterly: { type: Number, required: true },
      biannual: { type: Number, required: true },
    },
    originalPrice: {
      monthly: { type: Number, required: true },
      quarterly: { type: Number, required: true },
      biannual: { type: Number, required: true },
    },
    icon: { type: String, default: "" },
    colorClass: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    studentCount: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tier: { type: String, default: "basic" },
  },
  { timestamps: true }
);

const PackageFeatureSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  included: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
});

const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema);
const PackageFeature = mongoose.models.PackageFeature || mongoose.model("PackageFeature", PackageFeatureSchema);

async function run() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    // Check if package already exists
    const existing = await Package.findOne({ slug: "basic-package" });
    if (existing) {
      console.log("Package 'basic-package' already exists. Deleting it to recreate...");
      await Package.deleteOne({ _id: existing._id });
      await PackageFeature.deleteMany({ packageId: existing._id });
    }

    // Create Package
    const pkg = await Package.create({
      name: "بسته پایه",
      slug: "basic-package",
      tagline: "پایه",
      description: "مناسب برای مبتدیان و افرادی که تازه شروع کرده‌اند",
      price: { monthly: 200000, quarterly: 540000, biannual: 960000 },
      originalPrice: { monthly: 200000, quarterly: 540000, biannual: 960000 },
      icon: "package",
      colorClass: "bg-blue-500",
      rating: 0,
      reviewCount: 0,
      studentCount: 542,
      isPopular: false,
      isActive: true,
      tier: "basic"
    });

    console.log("Created Package:", pkg);

    // Create Features
    const features = [
      "دسترسی به برنامه تمرینی پایه",
      "گزارش پیشرفت هفتگی",
      "پشتیبانی تیکت معمولی"
    ];

    const createdFeatures = await PackageFeature.insertMany(
      features.map((featText, index) => ({
        packageId: pkg._id,
        name: featText,
        included: true,
        sortOrder: index
      }))
    );

    console.log("Created Features:", createdFeatures);

  } catch (error) {
    console.error("Error creating package:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

run();
