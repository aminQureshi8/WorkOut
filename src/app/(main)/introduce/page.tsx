import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Dumbbell,
  Video,
  Activity,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "چرا استار فیت؟ | برتری‌ها و امکانات مربیگری اختصاصی",
  description:
    "چرا باید استار فیت را انتخاب کنیم؟ معرفی مزایا، مربیگری هوشمند، سیستم نظارتی پیشرفته، برنامه‌های ویدیویی و پیگیری زنده روند رشد ورزشی شما.",
};

export default function IntroducePage() {
  return (
    <div className="min-h-screen select-none bg-neutral-950 text-white font-danaMed relative overflow-hidden pb-20">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-3 relative z-10 space-y-20">
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            انتخابی هوشمندانه برای تناسب اندام
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-morabbaBold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
            چرا باید استار فیت را انتخاب کنیم؟
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            استار فیت فراتر از یک برنامه‌ تمرینی ساده است. ما یک اکوسیستم هوشمند و
            پویا برای مربیگری اختصاصی، پایش سلامتی و رشد مداوم شما طراحی کرده‌ایم.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-morabbaBold text-white">
              برنامه تمرینی ۱۰۰٪ اختصاصی
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
              هیچ برنامه تمرینی کپی یا عمومی وجود ندارد. مربیان ما براساس اهداف،
              تیپ بدنی، سطح تجربه و آسیب‌دیدگی‌های شما، برنامه را طراحی می‌کنند.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-morabbaBold text-white">
              آموزش ویدیویی تمام حرکات
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
              دیگر نیازی به جستجوی نحوه اجرای درست حرکات نیست. در کنار تک‌تک تمرین‌ها،
              ویدیوهای باکیفیت آموزشی و نکات مربی قرار داده شده است.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-morabbaBold text-white">
              سیستم پایش جلسه تمرین
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm leading-relaxed">
              با ثبت سختی، میزان انرژی، وجود درد و نظر خود پس از هر جلسه، وضعیت بدنی
              خود را مستقیماً به اطلاع مربی می‌رسانید تا برنامه بهینه شود.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] p-8 md:p-12 shadow-2xl">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-purple-600/10 to-pink-500/10 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold font-morabbaBold leading-tight">
                تفاوت استار فیت با فایل‌های PDF قدیمی چیست؟
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed">
                در روش‌های سنتی، شما یک فایل PDF بی‌روح دریافت می‌کنید که تعاملی با شما
                ندارد. در استار فیت، تمرینات زنده، قابل تیک زدن و ردیابی هستند و مربی از
                روند پیشرفت شما آگاه است.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>ردیابی درصد پیشرفت و تکمیل جلسات به صورت آنلاین</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>تغییرپذیری و بهینه‌سازی سریع برنامه توسط مربی</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MessageSquare className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>ثبت بازخورد زنده، خستگی، درد و چالش‌های مفصلی</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center space-y-2">
                <TrendingUp className="w-8 h-8 mx-auto text-purple-400" />
                <span className="text-2xl font-extrabold block">٪۸۵</span>
                <span className="text-neutral-400 text-xs block">
                  افزایش تعهد به تمرین
                </span>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center space-y-2">
                <Zap className="w-8 h-8 mx-auto text-pink-400" />
                <span className="text-2xl font-extrabold block">۳ برابر</span>
                <span className="text-neutral-400 text-xs block">
                  کاهش احتمال آسیب‌دیدگی
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-10 space-y-6">
          <h2 className="text-xl md:text-2xl font-bold font-morabbaBold">
            آماده‌اید تغییر واقعی را شروع کنید؟
          </h2>
          <p className="text-neutral-400 text-sm max-w-lg mx-auto">
            به خانواده استار فیت بپیوندید و با برنامه‌ریزی کاملاً علمی و تحت نظارت مستقیم،
            سفر تناسب اندام خود را آغاز کنید.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              id="cta-packages-link"
              href="/packages"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-purple-500/20 hover:-translate-y-0.5"
            >
              <span>مشاهده و خرید پکیج‌ها</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
