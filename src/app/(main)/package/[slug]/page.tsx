import PackageDetails from "@/modules/packages/packageDetails/PackageDetails";

export default async function page({ params }) {
  const { slug } = await params;

  return <PackageDetails slug={slug} />;
}
