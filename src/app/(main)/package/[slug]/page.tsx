import Package from "@/model/Package";
import Packagefeature from "@/model/Packagefeature";
import PackageDetails from "@/modules/packages/packageDetails/PackageDetails";

export default async function page({ params }) {
  const { slug } = await params;

  const packageFind = await Package.findOne({ slug }).lean();
  const features = await Packagefeature.find({
    packageId: packageFind._id,
  }).lean();

  return (
    <PackageDetails
      package={JSON.parse(JSON.stringify(packageFind))}
      features={JSON.parse(JSON.stringify(features))}
    />
  );
}
