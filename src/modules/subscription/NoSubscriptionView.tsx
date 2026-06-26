import Link from "next/link";
import { CreditCard, Sparkles, HelpCircle } from "lucide-react";

export default function NoSubscriptionView() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-16 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
        <CreditCard className="w-10 h-10 text-purple-400 animate-pulse" />
      </div>

      <h2 className="font-morabbaReg text-xl md:text-2xl font-bold text-white mb-3">
        هیچ اشتراک فعالی ندارید!
      </h2>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto">
        در حال حاضر اشتراک فعالی برای حساب کاربری شما ثبت نشده است. برای دریافت
        برنامه ورزشی اختصاصی و مشاوره مستقیم با مربیان، یکی از پکیج‌های ما را
        تهیه کنید.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-danaDemiBold">
        <Link
          href="/packages"
          id="sub-buy-btn"
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span>مشاهده و خرید پکیج‌ها</span>
        </Link>
        <Link
          href="/dashboard/tickets"
          id="sub-support-btn"
          className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <span>ارتباط با پشتیبانی</span>
        </Link>
      </div>
    </div>
  );
}
