import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { blogId } = await req.json();

    if (!blogId) {
      return NextResponse.json({ message: "شناسه مقاله یافت نشد" }, { status: 400 });
    }

    const cookieName = `viewed_blog_${blogId}`;
    const cookieStore = await cookies();
    const hasCookie = cookieStore.get(cookieName);

    if (hasCookie) {
      return NextResponse.json({ incremented: false });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "مقاله یافت نشد" }, { status: 404 });
    }

    let finalViews = blog.views || 0;

    if (userId) {
      const alreadyViewed = blog.viewedUsers?.some(
        (id: any) => id.toString() === userId.toString()
      );

      if (alreadyViewed) {
        cookieStore.set(cookieName, "true", {
          maxAge: 365 * 24 * 60 * 60,
          path: "/",
        });
        return NextResponse.json({ incremented: false });
      }

      const updated = await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: { views: 1 },
          $addToSet: { viewedUsers: userId }
        },
        { new: true }
      );
      finalViews = updated?.views || (finalViews + 1);
    } else {
      const updated = await Blog.findByIdAndUpdate(
        blogId,
        {
          $inc: { views: 1 }
        },
        { new: true }
      );
      finalViews = updated?.views || (finalViews + 1);
    }

    cookieStore.set(cookieName, "true", {
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });

    return NextResponse.json({ incremented: true, views: finalViews });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
