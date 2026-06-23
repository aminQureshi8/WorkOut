import React from "react";
import Link from "next/link";
import { Lock, Sparkles, Check, Salad } from "lucide-react";

export default function NutritionLock() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-danaMed flex items-center justify-center p-4 md:p-8" dir="rtl">
      <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

        {/* Lock & Salad Icon Group */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 rotate-6 transition-transform animate-pulse"></div>
          <div className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10 -rotate-3 transition-transform"></div>
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-lg flex items-center justify-center text-white z-10">
            <Salad className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-lg bg-gray-900 border border-white/15 flex items-center justify-center text-emerald-400 shadow-md z-20 animate-bounce">
            <Lock className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-morabbaReg text-xl md:text-2xl font-bold text-white mb-3">
          بخش کالری‌شمار و مدیریت تغذیه غیرفعال است!
        </h2>
        
        {/* Subtitle */}
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
          دسترسی به بخش مدیریت تغذیه فیت‌کوچ فقط مخصوص کاربران دارای اشتراک فعال می‌باشد. برای استفاده از تمامی امکانات، یکی از پکیج‌های ما را تهیه کنید.
        </p>

        {/* Features List */}
        <div className="bg-white/3 border border-white/5 rounded-2xl p-4 mb-8 text-right space-y-3">
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-300">ثبت روزانه وعده‌های غذایی و میان‌وعده‌ها</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-300">کالری‌شمار هوشمند و تفکیک درشت‌مغذی‌ها</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-300">رهگیری روزانه میزان آب مصرفی و هیدراتاسیون</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span className="text-xs md:text-sm text-gray-300">تنظیم و نظارت بر اهداف تغذیه‌ای اختصاصی</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center font-danaDemiBold">
          <Link
            href="/packages"
            id="nutrition-lock-buy-btn"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>خرید و فعال‌سازی اشتراک فیت‌کوچ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
