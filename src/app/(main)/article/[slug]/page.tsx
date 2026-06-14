import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import ArticleDetail from "@/modules/article/ArticleDetail";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;

  await dbConnect();

  const decodedSlug = decodeURIComponent(slug);

  // Fetch current article by slug
  const blog = await Blog.findOne({ slug: decodedSlug, status: "published" })
    .populate("authorId", "username fullName email role")
    .lean();

  if (!blog) {
    notFound();
  }

  // Fetch related articles in same category (excluding current article)
  const relatedBlogs = await Blog.find({
    category: blog.category,
    status: "published",
    _id: { $ne: blog._id },
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();


  const serializedArticle = JSON.parse(JSON.stringify(blog));
  const serializedRelated = JSON.parse(JSON.stringify(relatedBlogs));

  return (
    <ArticleDetail
      article={serializedArticle}
      relatedArticles={serializedRelated}
    />
  );
}
