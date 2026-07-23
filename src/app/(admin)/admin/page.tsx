import dbConnect from "@/lib/dbConnect";
import Blog from "@/model/Blog";
import Ticket from "@/model/Ticket";
import User from "@/model/User";
import AdminDashboardAdmin from "@/modules/admin/dashboard/AdminDashboardAdmin";

export default async function page() {
  await dbConnect();

  const [usersCount, publishedBlogsCount, openTicketsCount] = await Promise.all([
    User.countDocuments({}),
    Blog.countDocuments({ status: "published" }),
    Ticket.countDocuments({ status: { $ne: "closed" } }),
  ]);

  return (
    <AdminDashboardAdmin
      usersCount={usersCount}
      publishedBlogsCount={publishedBlogsCount}
      openTicketsCount={openTicketsCount}
    />
  );
}

