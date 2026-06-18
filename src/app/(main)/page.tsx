import dbConnect from "@/lib/dbConnect";
import BlogModel from "@/model/Blog";
import UserModel from "@/model/User";
import HomeTemplate from "../../templates/HomeTemplate";

export const dynamic = "force-dynamic";

export default async function Home() {
  await dbConnect();

  const latestBlogs = await BlogModel.find({ status: "published" })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate("authorId")
    .lean();

  const articles = latestBlogs.map((blog: any) => {
    const authorName =
      blog.authorId?.fullName || blog.authorId?.username || "نویسنده مهمان";
    const authorInitial = authorName.substring(0, 1);
    const publishDateString = new Intl.DateTimeFormat("fa-IR", {
      month: "long",
      day: "numeric",
    }).format(new Date(blog.createdAt));

    const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt:
        blog.excerpt ||
        (blog.content ? blog.content.substring(0, 100) + "..." : ""),
      image: blog.image || "",
      category: blog.category,
      readingTime: `${readingTime} دقیقه مطالعه`,
      authorName,
      authorInitial,
      publishDate: publishDateString,
    };
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);

  const [todayCount, yesterdayCount] = await Promise.all([
    UserModel.countDocuments({ createdAt: { $gte: startOfToday } }),
    UserModel.countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    }),
  ]);

  const formatPersianNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  let trendText = "";
  if (yesterdayCount === 0) {
    if (todayCount > 0) {
      trendText = `+${formatPersianNumber(100)}% نسبت به دیروز`;
    } else {
      trendText = `${formatPersianNumber(0)}% نسبت به دیروز`;
    }
  } else {
    const percentage = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    const formattedPercent = new Intl.NumberFormat("fa-IR", {
      signDisplay: "exceptZero",
    }).format(Math.round(percentage));
    trendText = `${formattedPercent}% نسبت به دیروز`;
  }

  const stats = {
    todayUsersCount: formatPersianNumber(todayCount),
    trendText,
  };

  return <HomeTemplate articles={articles} stats={stats} />;
}
