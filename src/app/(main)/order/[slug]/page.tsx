import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";
import OrderPage from "@/modules/order/OrderPage";
import { OrderPackageInfo } from "@/types/order";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  await dbConnect();

  const slugPackage = await Package.findOne({ slug, isActive: true }).lean();

  if (!slugPackage) {
    notFound();
  }

  const safePackageData: OrderPackageInfo = {
    _id: String(slugPackage._id),
    name: slugPackage.name,
    slug: slugPackage.slug,
    tagline: slugPackage.tagline || "",
    description: slugPackage.description || "",
    price: {
      monthly: slugPackage.price?.monthly || 0,
      quarterly: slugPackage.price?.quarterly || 0,
      biannual: slugPackage.price?.biannual || 0,
    },
    isActive: Boolean(slugPackage.isActive),
  };

  return (
    <OrderPage
      packageData={safePackageData}
      userId={session.user.id}
      email={session.user.email}
    />
  );
}
