import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Order from "@/model/Order";
import Package from "@/model/Package";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, ShieldCheck, Zap, Calendar } from "lucide-react";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    redirect("/");
  }

  if (!orderId) {
    redirect("/");
  }

  await dbConnect();

  const order = await Order.findOne({
    _id: orderId,
    userId: session.user.id,
    status: "paid",
  }).lean();

  if (!order) {
    redirect("/");
  }

  const orderPackage = await Package.findById(order.packageId).lean();

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-12 px-4"
      style={{ fontFamily: "Dana, sans-serif" }}
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
        
        <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <CheckCircle className="w-12 h-12 text-emerald-400 animate-pulse" />
        </div>

        <h1
          className="text-3xl font-extrabold text-white mb-3 tracking-tight"
          style={{ fontFamily: "Marbeh, sans-serif" }}
        >
          پرداخت موفقیت‌آمیز
        </h1>
        
        <p className="text-white/70 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          اشتراک شما با موفقیت فعال گردید. اکنون می‌توانید به برنامه هفتگی و تمرین‌های خود دسترسی داشته باشید.
        </p>

        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-8 space-y-4 text-right">
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
            <span className="text-white/40">نام پکیج</span>
            <span className="text-white font-medium">
              {orderPackage?.name || "پکیج تمرینی"}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
            <span className="text-white/40">وضعیت پرداخت</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              موفق و تایید شده
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm border-b border-white/5 pb-3">
            <span className="text-white/40">نوع فعال‌سازی</span>
            <span className="text-white/80 font-medium flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-400" />
              آنـی و خودکار
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-white/40">پشتیبانی</span>
            <span className="text-white/80 font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              ۲۴ ساعته فعال
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 text-center"
          >
            ورود به پنل کاربری
          </Link>
          
          <Link
            href="/dashboard/subscription"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium py-3.5 rounded-xl transition-all duration-300 text-center flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-orange-400" />
            مشاهده برنامه تمرینی
          </Link>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors mt-8 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
