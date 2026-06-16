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
    const authorName = blog.authorId?.fullName || blog.authorId?.username || "نویسنده مهمان";
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
      excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 100) + "..." : ""),
      image: blog.image || "",
      category: blog.category,
      readingTime: `${readingTime} دقیقه مطالعه`,
      authorName,
      authorInitial,
      publishDate: publishDateString,
    };
  });

  return <HomeTemplate articles={articles} />;
}
