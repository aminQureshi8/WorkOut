import React from "react";
import { ShieldCheck, CheckCircle } from "lucide-react";

export default function ActiveAccesses() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
      <h3 className="text-lg font-bold font-morabbaReg text-white mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-purple-400" />
        <span>دسترسی‌های فعال شما</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">
              برنامه تمرینی سفارشی
            </p>
            <p className="text-xs text-gray-400 mt-1">
              طراحی شده بر اساس فیزیک و اهداف شما
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">
              ویدیوهای آموزشی حرکات
            </p>
            <p className="text-xs text-gray-400 mt-1">
              اجرای اصولی تمرین‌ها با راهنمای ویدیویی
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">
              پشتیبانی مستقیم مربی
            </p>
            <p className="text-xs text-gray-400 mt-1">
              ارسال تیکت و دریافت پاسخ سوالات ورزشی
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">
              گزارش و ارزیابی پیشرفت
            </p>
            <p className="text-xs text-gray-400 mt-1">
              تحلیل تغییرات فیزیکی شما در طول دوره
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
