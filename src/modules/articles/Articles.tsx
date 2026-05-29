import Link from "next/link";
import { BiDumbbell, BiSearch, BiUser } from "react-icons/bi";
import { CiLock } from "react-icons/ci";

export default function Articles() {
  const articles = [
    {
      id: 1,
      title: "۱۰ نکته طلایی برای افزایش حجم عضلانی",
      excerpt:
        "برای رشد عضلات، تنها تمرین کافی نیست. در این مقاله به نکات کلیدی تغذیه و استراحت می‌پردازیم...",
      author: "علی محمدی",
      date: "۱۵ اردیبهشت ۱۴۰۳",
      readTime: "۵ دقیقه",
      category: "بدنسازی",
      image: "🏋️",
    },
    {
      id: 2,
      title: "راهنمای کامل تغذیه ورزشی",
      excerpt:
        "تغذیه صحیح ۷۰٪ موفقیت شما را تشکیل می‌دهد. بیاموزید چگونه برنامه غذایی خود را بهینه کنید...",
      author: "سارا احمدی",
      date: "۱۲ اردیبهشت ۱۴۰۳",
      readTime: "۸ دقیقه",
      category: "تغذیه",
      image: "🥗",
    },
    {
      id: 3,
      title: "بهترین تمرینات برای کاهش وزن",
      excerpt:
        "ترکیبی از تمرینات کاردیو و قدرتی می‌تواند بهترین نتیجه را برای کاهش وزن به شما بدهد...",
      author: "محمد رضایی",
      date: "۱۰ اردیبهشت ۱۴۰۳",
      readTime: "۶ دقیقه",
      category: "کاهش وزن",
      image: "🏃",
    },
    {
      id: 4,
      title: "اهمیت استراحت در ورزش",
      excerpt:
        "بسیاری از ورزشکاران اهمیت استراحت را نادیده می‌گیرند. بدانید چرا استراحت به اندازه تمرین مهم است...",
      author: "فاطمه کریمی",
      date: "۸ اردیبهشت ۱۴۰۳",
      readTime: "۴ دقیقه",
      category: "سلامت",
      image: "😴",
    },
    {
      id: 5,
      title: "مکمل‌های ضروری برای بدنسازان",
      excerpt:
        "آیا واقعاً به مکمل نیاز دارید؟ کدام مکمل‌ها واقعاً کارآمد هستند و کدام‌ها فقط تبلیغ...",
      author: "حسین نوری",
      date: "۵ اردیبهشت ۱۴۰۳",
      readTime: "۷ دقیقه",
      category: "مکمل",
      image: "💊",
    },
    {
      id: 6,
      title: "تکنیک‌های پیشرفته اسکات",
      excerpt:
        "اسکات پادشاه تمرینات پا است. یاد بگیرید چگونه این حرکت را با فرم صحیح اجرا کنید...",
      author: "علی محمدی",
      date: "۳ اردیبهشت ۱۴۰۳",
      readTime: "۶ دقیقه",
      category: "تکنیک",
      image: "🦵",
    },
  ];

  const categories = [
    "همه",
    "بدنسازی",
    "تغذیه",
    "کاهش وزن",
    "سلامت",
    "مکمل",
    "تکنیک",
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 font-danaMed to-gray-900"
      dir="rtl"
    >
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 text-center">
            مقالات آموزشی
          </h1>
          <p className="text-xl text-white/70 text-center max-w-2xl mx-auto mb-12">
            دانش خود را در زمینه بدنسازی و تناسب اندام افزایش دهید
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو در مقالات..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-12 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500"
              />
              <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full transition-colors ${
                  cat === "همه"
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

    
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center text-6xl">
                  {article.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <CiLock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <BiUser className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <span className="text-xs text-white/50">
                      {article.date}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-3 rounded-lg transition-colors">
              مشاهده مقالات بیشتر
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
