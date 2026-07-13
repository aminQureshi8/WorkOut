import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Manually parse .env file to extract MONGODB_URI without external dependencies
let MONGODB_URI = "mongodb://127.0.0.1/starfit";
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/MONGODB_URI\s*=\s*(.*)/);
    if (match && match[1]) {
      MONGODB_URI = match[1].trim();
    }
  }
} catch (err) {
  console.warn("Could not read .env file, using fallback database URI:", err);
}

// Define inline schemas to avoid import alias compilation issues during direct execution
const PackageSchema = new mongoose.Schema({
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
  hasMealPlan: { type: Boolean, default: false },
}, { timestamps: true });

const PackageFeatureSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  included: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
});

const WorkoutPlanSchema = new mongoose.Schema({
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const WorkoutDaySchema = new mongoose.Schema({
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutPlan", required: true },
  dayName: { type: String, required: true },
  muscleGroup: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const WorkoutExerciseSchema = new mongoose.Schema({
  dayId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkoutDay", required: true },
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: "Video", default: null },
  videoId2: { type: mongoose.Schema.Types.ObjectId, ref: "Video", default: null },
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  restSec: { type: Number, default: 60 },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  url: { type: String, required: true },
  thumbnailUrl: { type: String, default: "" },
  durationSec: { type: Number, default: 0 },
  level: { type: String, default: "beginner" },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Register models if they don't already exist on mongoose
const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema);
const PackageFeature = mongoose.models.PackageFeature || mongoose.model("PackageFeature", PackageFeatureSchema);
const WorkoutPlan = mongoose.models.WorkoutPlan || mongoose.model("WorkoutPlan", WorkoutPlanSchema);
const WorkoutDay = mongoose.models.WorkoutDay || mongoose.model("WorkoutDay", WorkoutDaySchema);
const WorkoutExercise = mongoose.models.WorkoutExercise || mongoose.model("WorkoutExercise", WorkoutExerciseSchema);
const Video = mongoose.models.Video || mongoose.model("Video", VideoSchema);

async function run() {
  console.log("Connecting to Database:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  const slug = "footballers";

  // 1. Delete existing package and related items if they exist to keep it clean
  const existingPkg = await Package.findOne({ slug });
  if (existingPkg) {
    console.log("Found existing package for footballers. Deleting to re-create...");
    await PackageFeature.deleteMany({ packageId: existingPkg._id });
    const plans = await WorkoutPlan.find({ packageId: existingPkg._id });
    for (const plan of plans) {
      const days = await WorkoutDay.find({ planId: plan._id });
      for (const day of days) {
        await WorkoutExercise.deleteMany({ dayId: day._id });
      }
      await WorkoutDay.deleteMany({ planId: plan._id });
    }
    await WorkoutPlan.deleteMany({ packageId: existingPkg._id });
    await Package.deleteOne({ _id: existingPkg._id });
    console.log("Existing package cleanup completed.");
  }

  // 2. Create mock videos if none exist
  let video1 = await Video.findOne({ title: "نرم‌دوی و آماده‌سازی پویا (وارم‌آپ فوتبال)" });
  if (!video1) {
    video1 = await Video.create({
      title: "نرم‌دوی و آماده‌سازی پویا (وارم‌آپ فوتبال)",
      description: "آموزش اصول گرم کردن پویا مخصوص بازیکنان فوتبال قبل از شروع تمرینات اصلی جهت پیشگیری از آسیب همسترینگ و کشاله ران.",
      url: "https://workout.s3.ir-thr-at1.arvanstorage.ir/videos/warmup.mp4",
      thumbnailUrl: "",
      durationSec: 320,
      level: "beginner",
      tags: ["فوتبال", "گرم_کردن", "چابکی"],
    });
    console.log("Mock Video 1 created.");
  }

  let video2 = await Video.findOne({ title: "تمرینات چابکی با نردبان چابکی (Agility Ladder)" });
  if (!video2) {
    video2 = await Video.create({
      title: "تمرینات چابکی با نردبان چابکی (Agility Ladder)",
      description: "تمرینات شتاب‌گیری و افزایش سرعت گام‌ها با نردبان چابکی برای بالا بردن هماهنگی عصب و عضله فوتبالیست‌ها.",
      url: "https://workout.s3.ir-thr-at1.arvanstorage.ir/videos/ladder.mp4",
      thumbnailUrl: "",
      durationSec: 450,
      level: "intermediate",
      tags: ["چابکی", "سرعت", "فوتبال"],
    });
    console.log("Mock Video 2 created.");
  }

  // 3. Create Package
  console.log("Creating Footballer Package...");
  const pkg = await Package.create({
    name: "پکیج اختصاصی آمادگی جسمانی فوتبالیست‌ها",
    slug,
    tagline: "افزایش چابکی، سرعت انفجاری، استقامت و توان هوازی مخصوص بازیکنان فوتبال",
    description: "این پکیج به طور ویژه برای بازیکنان فوتبال در تمام سطوح طراحی شده است تا قدرت عضلانی پاها، چابکی در تغییر مسیرها، شتاب انفجاری و استقامت بدنی ۹۰ دقیقه‌ای آنها را ارتقا دهد.",
    price: {
      monthly: 450000,
      quarterly: 1200000,
      biannual: 2200000,
    },
    originalPrice: {
      monthly: 600000,
      quarterly: 1500000,
      biannual: 2800000,
    },
    icon: "Activity",
    colorClass: "from-green-500 to-emerald-700",
    rating: 4.9,
    reviewCount: 42,
    studentCount: 156,
    isPopular: true,
    isActive: true,
    hasMealPlan: true,
  });
  console.log("Package created successfully. ID:", pkg._id);

  // 4. Create Features
  console.log("Creating Package Features...");
  const features = [
    "برنامه تمرینی تخصصی شبیه‌ساز ۹۰ دقیقه فوتبال",
    "برنامه غذایی اختصاصی فاز مسابقات / پیش‌فصل",
    "پشتیبانی و گفتگو مستقیم با مربی اختصاصی شما",
    "آنالیز هفتگی ترکیب بدنی و ثبت رکوردهای آمادگی جسمانی",
  ];
  await PackageFeature.insertMany(
    features.map((featText, index) => ({
      packageId: pkg._id,
      name: featText,
      included: true,
      sortOrder: index,
    }))
  );
  console.log("Features created successfully.");

  // 5. Create WorkoutPlan
  console.log("Creating Workout Plan...");
  const plan = await WorkoutPlan.create({
    packageId: pkg._id,
    title: "برنامه تمرینی آماده‌سازی بدنی فوتبالیست‌ها (فاز پیش‌فصل)",
    description: "این برنامه بر روی فاکتورهای کلیدی آمادگی جسمانی فوتبال از جمله چابکی، سرعت انفجاری، استقامت هوازی و بی هوازی و پیشگیری از مصدومیت تمرکز دارد.",
    isActive: true,
  });
  console.log("Workout Plan created. ID:", plan._id);

  // 6. Create WorkoutDays
  console.log("Creating Workout Days...");
  const daysData = [
    { dayName: "شنبه", muscleGroup: "چابکی و سرعت انفجاری (Agility & Speed)", sortOrder: 0 },
    { dayName: "یکشنبه", muscleGroup: "استقامت و استقامت عضلانی عمومی (Endurance)", sortOrder: 1 },
    { dayName: "دوشنبه", muscleGroup: "استراحت و ریکاوری فعال (هوازی سبک)", sortOrder: 2 },
    { dayName: "سه‌شنبه", muscleGroup: "پلیومتریک و قدرت انفجاری پایین‌تنه (Power)", sortOrder: 3 },
    { dayName: "چهارشنبه", muscleGroup: "ثبات میان‌تنه (Core) و بالاتنه", sortOrder: 4 },
    { dayName: "پنج‌شنبه", muscleGroup: "ریکاوری و کشش پویا", sortOrder: 5 },
    { dayName: "جمعه", muscleGroup: "استراحت کامل", sortOrder: 6 },
  ];

  const createdDays = [];
  for (const d of daysData) {
    const day = await WorkoutDay.create({
      planId: plan._id,
      dayName: d.dayName,
      muscleGroup: d.muscleGroup,
      sortOrder: d.sortOrder,
    });
    createdDays.push(day);
  }
  console.log("Workout Days created.");

  // 7. Create WorkoutExercises
  console.log("Creating Workout Exercises...");

  // Saturday Exercises (Agility)
  const satDay = createdDays.find(d => d.dayName === "شنبه")!;
  await WorkoutExercise.create([
    {
      dayId: satDay._id,
      videoId: video2._id,
      name: "تمرین نردبان چابکی (حرکت ۲ گام داخل / ۲ گام بیرون)",
      sets: 4,
      reps: "۶ تکرار طول نردبان",
      restSec: 60,
      sortOrder: 0,
    },
    {
      dayId: satDay._id,
      name: "شاتل ران (Shuttle Run) ۵*۱۰ متر",
      sets: 5,
      reps: "۵ ست با تمام سرعت و تمرکز روی ترمز سریع",
      restSec: 90,
      sortOrder: 1,
    },
    {
      dayId: satDay._id,
      name: "پرش جفت پا روی جعبه (Box Jump)",
      sets: 4,
      reps: "۸ تکرار",
      restSec: 75,
      sortOrder: 2,
    },
  ]);

  // Sunday Exercises (Endurance)
  const sunDay = createdDays.find(d => d.dayName === "یکشنبه")!;
  await WorkoutExercise.create([
    {
      dayId: sunDay._id,
      name: "دویدن اینتروال (HIIT) روی زمین چمن",
      sets: 1,
      reps: "۱۵ دقیقه (۱ دقیقه استارت سریع، ۱ دقیقه نرم‌دوی)",
      restSec: 0,
      sortOrder: 0,
    },
    {
      dayId: sunDay._id,
      name: "لانج متناوب با وزن بدن (تمرکز بر زانوها)",
      sets: 4,
      reps: "۱۵ تکرار برای هر پا",
      restSec: 60,
      sortOrder: 1,
    },
  ]);

  // Tuesday Exercises (Plyo / Leg Strength)
  const tueDay = createdDays.find(d => d.dayName === "سه‌شنبه")!;
  await WorkoutExercise.create([
    {
      dayId: tueDay._id,
      name: "اسکوات پرشی هالتر سبک",
      sets: 4,
      reps: "۸ تکرار انفجاری",
      restSec: 90,
      sortOrder: 0,
    },
    {
      dayId: tueDay._id,
      name: "پل باسن تک پا (Single-Leg Glute Bridge)",
      sets: 3,
      reps: "۱۲ تکرار هر پا",
      restSec: 60,
      sortOrder: 1,
    },
    {
      dayId: tueDay._id,
      name: "ساق پا ایستاده لبه پله",
      sets: 4,
      reps: "۲۰ تکرار (۱۰ ثانیه انقباض در ست آخر)",
      restSec: 45,
      sortOrder: 2,
    },
  ]);

  // Wednesday Exercises (Core & Upper body)
  const wedDay = createdDays.find(d => d.dayName === "چهارشنبه")!;
  await WorkoutExercise.create([
    {
      dayId: wedDay._id,
      name: "پلانک روی آرنج (تمرکز روی عضلات شکم و باسن)",
      sets: 4,
      reps: "۶۰ ثانیه",
      restSec: 45,
      sortOrder: 0,
    },
    {
      dayId: wedDay._id,
      name: "شنا سوئدی با شیب منفی (پا روی نیمکت)",
      sets: 4,
      reps: "۱۲ - ۱۵ تکرار",
      restSec: 60,
      sortOrder: 1,
    },
    {
      dayId: wedDay._id,
      name: "کرانچ شکم دوچرخه (Bicycle Crunch)",
      sets: 3,
      reps: "۲۰ تکرار کل",
      restSec: 45,
      sortOrder: 2,
    },
  ]);

  console.log("All Workout Exercises created successfully!");

  await mongoose.disconnect();
  console.log("Disconnected from database. Seeding process complete!");
}

run().catch(err => {
  console.error("Error during seeding:", err);
  process.exit(1);
});
