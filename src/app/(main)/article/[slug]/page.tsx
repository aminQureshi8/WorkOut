import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import ArticleDetail from "@/modules/article/ArticleDetail";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import "@/model/Comment";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function page({ params }: PageProps) {
  const { slug } = await params;

  await dbConnect();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  const decodedSlug = decodeURIComponent(slug);

  const blog = await Blog.findOne({ slug: decodedSlug, status: "published" })
    .populate("authorId", "username fullName email role")
    .populate({
      path: "comments",
      match: { isApproved: true },
      options: { sort: { createdAt: -1 } },
      strictPopulate: false,
    });

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await Blog.find({
    category: blog.category,
    status: "published",
    _id: { $ne: blog._id },
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  // let isWished = false;
  let isLiked = false;
  if (userId) {
    // const existingWish = await Wish.findOne({ userId, blogId: blog._id }).lean();
    // if (existingWish) {
    //   isWished = true;
    // }
    if (blog.likedUsers) {
      isLiked = blog.likedUsers.some(
        (id: any) => id.toString() === userId.toString()
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
      // isWished={isWished}
      isLiked={isLiked}
    />
  );
}
