export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-black/30! font-danaMed">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            چرا فیت‌کوچ را انتخاب کنیم؟
          </h2>
          <p className="text-white/70 text-lg">تفاوت‌های کلیدی ما با رقبا</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-lg font-bold text-white mb-2">
                برنامه شخصی‌سازی شده
              </h3>
              <p className="text-white/70 text-sm">
                برنامه‌ای کاملاً اختصاصی بر اساس سطح، هدف و زمان‌بندی شما
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">
                پشتیبانی ۲۴/۷
              </h3>
              <p className="text-white/70 text-sm">
                مربیان ما همیشه در دسترس شما هستند برای پاسخگویی
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-2">پیگیری دقیق</h3>
              <p className="text-white/70 text-sm">
                نمودارها و گزارش‌های کامل از پیشرفت روزانه شما
              </p>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">قیمت مناسب</h3>
              <p className="text-white/70 text-sm">
                بهترین کیفیت با مقرون‌به‌صرفه‌ترین قیمت‌ها
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
