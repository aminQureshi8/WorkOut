import Link from "next/link";
import { BiCheck, BiDumbbell } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";

export default function SubscriptionPackages() {
  const packages = [
    {
      id: 1,
      name: "بسته پایه",
      price: "۵۰۰,۰۰۰",
      duration: "یک ماهه",
      color: "from-blue-500 to-cyan-500",
      features: [
        "برنامه تمرینی عمومی",
        "دسترسی به ویدیوهای آموزشی",
        "پشتیبانی ایمیلی",
        "گزارش پیشرفت ماهانه",
      ],
    },
    {
      id: 2,
      name: "بسته حرفه‌ای",
      price: "۱,۲۰۰,۰۰۰",
      duration: "سه ماهه",
      color: "from-orange-500 to-red-500",
      popular: true,
      features: [
        "برنامه تمرینی اختصاصی",
        "برنامه تغذیه شخصی",
        "مربیگری آنلاین",
        "پشتیبانی ۲۴/۷",
        "گزارش پیشرفت هفتگی",
        "مشاوره تخصصی",
      ],
    },
    {
      id: 3,
      name: "بسته VIP",
      price: "۲,۵۰۰,۰۰۰",
      duration: "شش ماهه",
      color: "from-purple-500 to-pink-500",
      features: [
        "تمام امکانات بسته حرفه‌ای",
        "برنامه مکمل‌های ورزشی",
        "جلسات آنلاین اختصاصی",
        "پیگیری روزانه",
        "دسترسی به دوره‌های تخصصی",
        "بیمه بدنسازی",
        "تخفیف در محصولات مکمل",
      ],
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{ fontFamily: "Dana, sans-serif" }}
      dir="rtl"
    >
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            پکیج‌های اشتراک
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            بهترین پکیج را برای دستیابی به اهداف خود انتخاب کنید
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative bg-white/5 backdrop-blur-lg border ${pkg.popular ? "border-orange-500 scale-105" : "border-white/10"} rounded-2xl p-8 hover:bg-white/10 transition-all`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-full text-sm font-bold">
                    محبوب‌ترین
                  </div>
                )}

                <div
                  className={`w-16 h-16 bg-gradient-to-br ${pkg.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  <BiDumbbell className="w-8 h-8 text-white" />
                </div>

                <h3
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  {pkg.name}
                </h3>
                <div className="mb-6">
                  <span
                    className="text-3xl font-bold text-orange-500"
                    style={{ fontFamily: "Marbeh, sans-serif" }}
                  >
                    {pkg.price}
                  </span>
                  <span className="text-white/60 mr-2">تومان</span>
                  <div className="text-white/50 text-sm mt-1">
                    {pkg.duration}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-white/80"
                    >
                      <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BiCheck className="w-3 h-3 text-orange-500" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/subscription/${pkg.id}`}
                  className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  <span>انتخاب پکیج</span>
                  <BsArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مطمئن نیستید کدام پکیج مناسب شماست؟
          </h2>
          <p className="text-xl text-white/70 mb-8">
            با مشاوران ما تماس بگیرید تا بهترین برنامه را برای شما پیشنهاد دهیم
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg transition-colors">
            درخواست مشاوره رایگان
          </button>
        </div>
      </section>
    </div>
  );
}
