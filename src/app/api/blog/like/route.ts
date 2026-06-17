import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ message: "وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { blogId } = await req.json();
    if (!blogId) {
      return NextResponse.json({ message: "شناسه مقاله یافت نشد" }, { status: 400 });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ message: "مقاله یافت نشد" }, { status: 404 });
    }

    const likedUsers = blog.likedUsers || [];
    const isLiked = likedUsers.some((id: any) => id.toString() === userId.toString());

    let liked = false;
    let updatedBlog = null;

    if (isLiked) {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likedUsers: userId },
          $inc: { likes: -1 }
        },
        { new: true }
      );
    } else {
      updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $addToSet: { likedUsers: userId },
          $inc: { likes: 1 }
        },
        { new: true }
      );
      liked = true;
    }

    const finalLikes = updatedBlog?.likedUsers?.length || 0;
    await Blog.findByIdAndUpdate(blogId, { $set: { likes: finalLikes } });

    return NextResponse.json({ liked, likes: finalLikes });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
