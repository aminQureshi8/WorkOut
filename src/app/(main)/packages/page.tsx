import dbConnect from "@/lib/dbConnect";
import Package from "@/model/Package";
import Packagefeature from "@/model/Packagefeature";
import SubscriptionPackages from "@/modules/packages/SubscriptionPackages";

export default async function page() {
  await dbConnect();
  const packages = await Package.find({ isActive: true }).lean();
  const features = await Packagefeature.find().lean();

  const packagesWithFeatures = packages.map((pkg) => ({
    ...pkg,
    _id: pkg._id.toString(),
    price: pkg.price.monthly,
    features: features
      .filter((f) => f.packageId.toString() === pkg._id.toString())
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((f) => ({
        _id: f._id.toString(),
        packageId: f.packageId.toString(),
        name: f.name,
        description: f.description,
        included: f.included,
        sortOrder: f.sortOrder,
      })),
  }));

  return <SubscriptionPackages packages={packagesWithFeatures} />;
}
