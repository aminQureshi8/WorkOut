import Package from "@/model/Package";
import OrderPage from "@/modules/order/Order";

export default async function page({ params }) {
  const { slug } = await params;

  const slugPackage = await Package.findOne({slug}).lean()

  console.log(slugPackage);
  

  return <OrderPage package={slugPackage} />;
}
