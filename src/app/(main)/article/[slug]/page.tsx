import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import Wish from "@/model/Wish";
import ArticleDetail from "@/modules/article/ArticleDetail";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";
import type { ArticlePageProps } from "@/types/blog";
import "@/model/Comment";

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    return { title: "مقاله یافت نشد | فیت‌کوچ" };
  }

  await dbConnect();
  const blog = await Blog.findOne({ slug: decodedSlug, status: "published" })
    .select("title excerpt image seoTitle seoDescription")
    .lean();

  if (!blog) {
    return { title: "مقاله یافت نشد | فیت‌کوچ" };
  }

  const title = blog.seoTitle || blog.title;
  const description = blog.seoDescription || blog.excerpt || "مطالعه مقاله ورزشی و سلامتی در فیت‌کوچ";

  return {
    title: `${title} | فیت‌کوچ`,
    description,
    openGraph: {
      title,
      description,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  };
}

export default async function page({ params }: ArticlePageProps) {
  const { slug } = await params;

  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch {
    notFound();
  }

  await dbConnect();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const blog = await Blog.findOne({ slug: decodedSlug, status: "published" })
    .populate("authorId", "username fullName role")
    .lean();

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await Blog.find({
    category: blog.category,
    status: "published",
    _id: { $ne: blog._id },
  })
    .select("title slug image category content createdAt")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  let isWished = false;
  let isLiked = false;
  if (userId) {
    const existingWish = await Wish.findOne({ userId, blogId: blog._id }).lean();
    if (existingWish) {
      isWished = true;
    }
    if (Array.isArray(blog.likedUsers)) {
      isLiked = blog.likedUsers.some(
        (id: unknown) => String(id) === String(userId)
      );
    }
  }

  const serializedArticle = JSON.parse(JSON.stringify(blog));
  const serializedRelated = JSON.parse(JSON.stringify(relatedBlogs));

  return (
    <ArticleDetail
      article={serializedArticle}
      relatedArticles={serializedRelated}
      userId={userId}
      currentUser={session?.user || null}
      isWished={isWished}
      isLiked={isLiked}
    />
  );
}
