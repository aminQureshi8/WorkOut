import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import BlogModel from "@/model/Blog";
import WishModel from "@/model/Wish";
import FavoritesManagement from "@/modules/dashboard/favorites/FavoritesManagement";

export const dynamic = "force-dynamic";

export default async function page() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const dbWishlist = await WishModel.find({ userId: session.user.id })
    .populate("blogId")
    .lean();

  const wishlistProps: any[] = dbWishlist
    .map((w: any) => {
      const b = w.blogId;
      if (!b) return null;
      return {
        id: b._id?.toString() || "",
        title: b.title || "",
        slug: b.slug || "",
        image: b.image || "",
        category: b.category || "",
        views: b.views || 0,
      };
    })
    .filter(Boolean);

  return <FavoritesManagement initialWishlist={wishlistProps} />;
}
