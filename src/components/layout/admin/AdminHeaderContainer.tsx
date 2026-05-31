import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminHeader from "./AdminHeader";

export default async function AdminHeaderContainer() {
  const session = await getServerSession(authOptions);

  return (
    <AdminHeader username={session.user.username} role={session.user.role} />
  );
}
