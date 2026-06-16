import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import AdminHeader from "./AdminHeader";

export default async function AdminHeaderContainer() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <AdminHeader username="کاربر" role="user" avatar="ک" />;
  }

  await dbConnect();
  const dbUser = await UserModel.findById(session.user.id).lean();

  if (!dbUser) {
    return <AdminHeader username="کاربر" role="user" avatar="ک" />;
  }

  const displayName = dbUser.fullName || dbUser.username;
  const initial = displayName.substring(0, 1);

  return (
    <AdminHeader username={displayName} role={dbUser.role} avatar={initial} />
  );
}
