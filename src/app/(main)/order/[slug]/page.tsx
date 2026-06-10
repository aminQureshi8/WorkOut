import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Package from "@/model/Package";
import OrderPage from "@/modules/order/OrderPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function page({ params }) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  console.log(session);

  if (!session.user.id) {
    redirect("/");
  }

  const slugPackage = await Package.findOne({ slug }).lean();

  return (
    <OrderPage
      package={JSON.parse(JSON.stringify(slugPackage))}
      userId={session.user.id}
      email={session.user.email}
    />
  );
}
