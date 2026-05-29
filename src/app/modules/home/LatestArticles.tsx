import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";

export default function LatestArticles() {
  return (
    <section className="py-20 bg-black/20">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              جدیدترین مقالات
            </h2>
            <p className="text-white/70">آخرین نکات و راهنماهای تمرینی</p>
          </div>
          <Link
            href="/articles"
            className="text-orange-500 hover:text-orange-400 flex items-center gap-2"
          >
            <span>مشاهده همه</span>
            <BsArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center text-6xl">
              🏋️
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                  بدنسازی
                </span>
                <span className="text-xs text-white/50">۵ دقیقه مطالعه</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-3 line-clamp-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                ۱۰ نکته طلایی برای افزایش حجم عضلانی
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4">
                برای رشد عضلات، تنها تمرین کافی نیست. در این مقاله به نکات کلیدی
                تغذیه و استراحت می‌پردازیم...
              </p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-sm">
                  ع
                </div>
                <span>علی محمدی</span>
                <span className="text-white/40">•</span>
                <span>۱۵ اردیبهشت</span>
              </div>
            </div>
          </article>

          <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-6xl">
              🥗
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                  تغذیه
                </span>
                <span className="text-xs text-white/50">۸ دقیقه مطالعه</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-3 line-clamp-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                راهنمای کامل تغذیه ورزشی
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4">
                تغذیه صحیح ۷۰٪ موفقیت شما را تشکیل می‌دهد. بیاموزید چگونه برنامه
                غذایی خود را بهینه کنید...
              </p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-sm">
                  س
                </div>
                <span>سارا احمدی</span>
                <span className="text-white/40">•</span>
                <span>۱۲ اردیبهشت</span>
              </div>
            </div>
          </article>

          <article className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
            <div className="aspect-video bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center text-6xl">
              🏃
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  کاهش وزن
                </span>
                <span className="text-xs text-white/50">۶ دقیقه مطالعه</span>
              </div>
              <h3
                className="text-xl font-bold text-white mb-3 line-clamp-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                بهترین تمرینات برای کاهش وزن
              </h3>
              <p className="text-white/70 text-sm line-clamp-2 mb-4">
                ترکیبی از تمرینات کاردیو و قدرتی می‌تواند بهترین نتیجه را برای
                کاهش وزن به شما بدهد...
              </p>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm">
                  م
                </div>
                <span>محمد رضایی</span>
                <span className="text-white/40">•</span>
                <span>۱۰ اردیبهشت</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
