"use client";

import FAQ from "@/modules/home/FAQ";
import Testimonials from "@/modules/home/Testimonials";
import {
  Dumbbell,
  Check,
  X,
  Star,
  Users,
  Clock,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  MessageCircle,
  Video,
  FileText,
  Headphones,
  Sparkles,
  ArrowLeft,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PackageDetails({ slug }) {
  const id = 3;
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "quarterly" | "biannual"
  >("monthly");

  const packages = {
    "1": {
      id: 1,
      name: "بسته پایه",
      slug: "basic",
      tagline: "شروع مسیر تحول",
      description:
        "بهترین انتخاب برای کسانی که می‌خواهند تمرینات خود را با یک برنامه ساختاریافته شروع کنند.",
      price: { monthly: "500000", quarterly: "1350000", biannual: "2700000" },
      originalPrice: {
        monthly: "700000",
        quarterly: "1800000",
        biannual: "3600000",
      },
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      icon: "💪",
      rating: 4.5,
      reviews: 234,
      students: 856,
      features: [
        {
          name: "برنامه تمرینی عمومی",
          included: true,
          description: "برنامه‌های از پیش طراحی شده برای سطوح مختلف",
        },
        {
          name: "دسترسی به ویدیوهای آموزشی",
          included: true,
          description: "بیش از ۲۰۰ ویدیوی آموزشی با کیفیت HD",
        },
        {
          name: "پشتیبانی ایمیلی",
          included: true,
          description: "پاسخ در کمتر از ۲۴ ساعت",
        },
        {
          name: "گزارش پیشرفت ماهانه",
          included: true,
          description: "آمار و نمودارهای پیشرفت شما",
        },
        { name: "برنامه تغذیه شخصی", included: false },
        { name: "مربیگری آنلاین", included: false },
        { name: "جلسات ویدیویی", included: false },
        { name: "پشتیبانی ۲۴/۷", included: false },
      ],
      highlights: [
        "مناسب برای مبتدیان",
        "بدون نیاز به تجربه قبلی",
        "برنامه‌های کامل و ساختاریافته",
        "قابل ارتقا به پکیج‌های بالاتر",
      ],
      whatYouGet: [
        {
          icon: Video,
          title: "۲۰۰+ ویدیوی آموزشی",
          description: "آموزش تصویری تمام حرکات",
        },
        {
          icon: FileText,
          title: "برنامه تمرینی PDF",
          description: "قابل چاپ و دانلود",
        },
        {
          icon: TrendingUp,
          title: "ردیابی پیشرفت",
          description: "نمودارها و آمار دقیق",
        },
        {
          icon: Headphones,
          title: "پشتیبانی ایمیلی",
          description: "پاسخ‌گویی در کمتر از ۲۴ ساعت",
        },
      ],
    },
    "2": {
      id: 2,
      name: "بسته حرفه‌ای",
      slug: "professional",
      tagline: "محبوب‌ترین انتخاب",
      description:
        "برای افرادی که جدی هستند و می‌خواهند با مربیگری تخصصی به نتایج سریع‌تری برسند.",
      price: { monthly: "450000", quarterly: "1200000", biannual: "2300000" },
      originalPrice: {
        monthly: "600000",
        quarterly: "1600000",
        biannual: "3200000",
      },
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-500/20 to-red-500/20",
      icon: "🔥",
      popular: true,
      rating: 4.9,
      reviews: 1247,
      students: 3421,
      features: [
        {
          name: "برنامه تمرینی اختصاصی",
          included: true,
          description: "طراحی شده کاملاً برای شما",
        },
        {
          name: "برنامه تغذیه شخصی",
          included: true,
          description: "توسط متخصص تغذیه تنظیم می‌شود",
        },
        {
          name: "مربیگری آنلاین",
          included: true,
          description: "ارتباط مستقیم با مربی اختصاصی",
        },
        {
          name: "پشتیبانی ۲۴/۷",
          included: true,
          description: "پاسخ فوری در هر زمان",
        },
        {
          name: "گزارش پیشرفت هفتگی",
          included: true,
          description: "بررسی و تحلیل هفتگی",
        },
        {
          name: "مشاوره تخصصی",
          included: true,
          description: "مشاوره ماهانه با مربی ارشد",
        },
        {
          name: "دسترسی به تمام ویدیوها",
          included: true,
          description: "بیش از ۵۰۰ ویدیوی آموزشی",
        },
        { name: "جلسات ویدیویی اختصاصی", included: false },
      ],
      highlights: [
        "مناسب برای سطح متوسط تا پیشرفته",
        "نتایج ۳ برابر سریع‌تر",
        "پشتیبانی تخصصی ۲۴/۷",
        "برنامه‌های کاملاً شخصی‌سازی شده",
      ],
      whatYouGet: [
        {
          icon: Award,
          title: "مربی اختصاصی",
          description: "پشتیبانی و راهنمایی مستمر",
        },
        {
          icon: FileText,
          title: "برنامه تمرینی شخصی",
          description: "متناسب با هدف و سطح شما",
        },
        {
          icon: Sparkles,
          title: "برنامه تغذیه",
          description: "رژیم غذایی اختصاصی",
        },
        {
          icon: MessageCircle,
          title: "چت اختصاصی",
          description: "ارتباط مستقیم با مربی",
        },
        {
          icon: TrendingUp,
          title: "گزارش هفتگی",
          description: "آنالیز دقیق پیشرفت",
        },
        {
          icon: Video,
          title: "۵۰۰+ ویدیوی آموزشی",
          description: "کتابخانه کامل تمرینات",
        },
      ],
    },
    "3": {
      id: 3,
      name: "بسته VIP",
      slug: "vip",
      tagline: "تجربه لوکس فیتنس",
      description:
        "برای کسانی که به دنبال بهترین‌ها هستند. تمام امکانات به اضافه جلسات آنلاین اختصاصی.",
      price: { monthly: "450000", quarterly: "1200000", biannual: "2500000" },
      originalPrice: {
        monthly: "700000",
        quarterly: "1800000",
        biannual: "4000000",
      },
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      icon: "👑",
      rating: 5.0,
      reviews: 542,
      students: 1123,
      features: [
        {
          name: "تمام امکانات بسته حرفه‌ای",
          included: true,
          description: "همه ویژگی‌های پکیج حرفه‌ای",
        },
        {
          name: "برنامه مکمل‌های ورزشی",
          included: true,
          description: "راهنمای استفاده از مکمل‌ها",
        },
        {
          name: "جلسات آنلاین اختصاصی",
          included: true,
          description: "۴ جلسه ویدیویی در ماه",
        },
        {
          name: "پیگیری روزانه",
          included: true,
          description: "بررسی روزانه عملکرد شما",
        },
        {
          name: "دسترسی به دوره‌های تخصصی",
          included: true,
          description: "دوره‌های پیشرفته و تکمیلی",
        },
        {
          name: "بیمه بدنسازی",
          included: true,
          description: "پوشش بیمه‌ای تمرینات",
        },
        {
          name: "تخفیف در محصولات مکمل",
          included: true,
          description: "۲۰٪ تخفیف در خرید مکمل",
        },
        {
          name: "اولویت در پشتیبانی",
          included: true,
          description: "پاسخ‌گویی فوری",
        },
      ],
      highlights: [
        "مناسب برای حرفه‌ای‌ها و VIP",
        "جلسات ویدیویی هفتگی",
        "پیگیری روزانه توسط مربی",
        "دسترسی آفلاین به تمام محتوا",
      ],
      whatYouGet: [
        {
          icon: Video,
          title: "جلسات ویدیویی زنده",
          description: "۴ جلسه ۶۰ دقیقه‌ای در ماه",
        },
        {
          icon: Award,
          title: "مربی VIP اختصاصی",
          description: "مربی ارشد و با تجربه",
        },
        {
          icon: Sparkles,
          title: "برنامه مکمل‌ها",
          description: "راهنمای کامل مصرف مکمل",
        },
        {
          icon: Shield,
          title: "بیمه ورزشی",
          description: "پوشش بیمه‌ای تمرینات",
        },
        {
          icon: TrendingUp,
          title: "پیگیری روزانه",
          description: "بررسی و فیدبک روزانه",
        },
        {
          icon: FileText,
          title: "دوره‌های اختصاصی",
          description: "دسترسی به محتوای پریمیوم",
        },
      ],
    },
  };

  const currentPackage = packages[id as keyof typeof packages] || packages["2"];

  const testimonials = [
    {
      name: "رضا احمدی",
      role: "کارمند اداری",
      package: currentPackage.name,
      text: "با این پکیج تونستم در ۳ ماه ۱۲ کیلو کم کنم. مربیگری حرفه‌ای و برنامه‌های دقیق واقعاً تفاوت ایجاد می‌کنه.",
      rating: 5,
      image: "👨",
      duration: "۳ ماه",
    },
    {
      name: "سارا کریمی",
      role: "معلم",
      package: currentPackage.name,
      text: "عالی بود! مربی من همیشه در دسترس بود و برنامه غذایی شخصی‌سازی شده خیلی کمک کرد.",
      rating: 5,
      image: "👩",
      duration: "۴ ماه",
    },
    {
      name: "علی محمدی",
      role: "دانشجو",
      package: currentPackage.name,
      text: "قیمت عالی، کیفیت عالی، پشتیبانی عالی. واقعاً ارزش هر ریالش رو داره.",
      rating: 5,
      image: "🧑",
      duration: "۲ ماه",
    },
  ];

  const faqs = [
    {
      question: `آیا می‌توانم ${currentPackage.name} را ارتقا دهم؟`,
      answer:
        "بله، شما می‌توانید در هر زمان پکیج خود را ارتقا دهید. هزینه پرداخت شده قبلی از مبلغ جدید کسر می‌شود.",
    },
    {
      question: "آیا امکان لغو اشتراک وجود دارد؟",
      answer:
        "بله، شما می‌توانید اشتراک خود را در هر زمان لغو کنید. در صورت لغو در ۷ روز اول، کل هزینه بازگردانده می‌شود.",
    },
    {
      question: "چگونه با مربی خود در ارتباط هستم؟",
      answer:
        "از طریق پنل کاربری، چت آنلاین، ایمیل و در پکیج VIP از طریق جلسات ویدیویی زنده با مربی خود در ارتباط خواهید بود.",
    },
    {
      question: "آیا برنامه تمرینی قابل تغییر است؟",
      answer:
        "بله، برنامه شما هر ۲ هفته یکبار بر اساس پیشرفت‌تان بازبینی و در صورت نیاز تغییر می‌یابد.",
    },
  ];

  const getPriceForCycle = (cycle: typeof billingCycle) => {
    return currentPackage.price[cycle];
  };

  const getOriginalPriceForCycle = (cycle: typeof billingCycle) => {
    return currentPackage.originalPrice[cycle];
  };

  const calculateDiscount = () => {
    const original = parseInt(getOriginalPriceForCycle(billingCycle));
    const current = parseInt(getPriceForCycle(billingCycle));
    return Math.round(((original - current) / original) * 100);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      dir="rtl"
    >
      {/* Breadcrumb */}
      <section className="py-6 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-orange-500">
              خانه
            </Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-orange-500">
              پکیج‌ها
            </Link>
            <span>/</span>
            <span className="text-white">{currentPackage.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Infohref */}
            <div className="space-y-8">
              {currentPackage.popular && (
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentPackage.tagline}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${currentPackage.color} rounded-2xl flex items-center justify-center text-4xl`}
                  >
                    {currentPackage.icon}
                  </div>
                  <div>
                    <h1
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                      style={{ fontFamily: "Marbeh, sans-serif" }}
                    >
                      {currentPackage.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(currentPackage.rating)
                              ? "fill-orange-500 text-orange-500"
                              : "text-white/20"
                              }`}
                          />
                        ))}
                        <span className="text-white/80 mr-2">
                          {currentPackage.rating}
                        </span>
                        <span className="text-white/50 text-sm">
                          ({currentPackage.reviews} نظر)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xl text-white/80 leading-relaxed">
                  {currentPackage.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-orange-500" />
                    <div>
                      <div
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {currentPackage.students.toLocaleString("fa-IR")}
                      </div>
                      <div className="text-white/60 text-sm">دانشجو فعال</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Star className="w-8 h-8 text-orange-500" />
                    <div>
                      <div
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {currentPackage.rating}
                      </div>
                      <div className="text-white/60 text-sm">رتبه از ۵</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3
                  className="text-xl font-bold text-white mb-4"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  نکات کلیدی
                </h3>
                <ul className="space-y-3">
                  {currentPackage.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-orange-500" />
                      </div>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column - Purchase Card */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 space-y-6">
                {/* Video Preview */}
                <div className="relative aspect-video bg-gradient-to-br from-orange-500/30 to-purple-500/30 rounded-xl overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white mr-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm">
                    پیش‌نمایش پکیج
                  </div>
                </div>

                {/* Billing Cycle */}
                <div>
                  <label className="block text-white/80 mb-3 text-sm">
                    دوره پرداخت
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={`py-2 rounded-lg text-sm transition-colors ${billingCycle === "monthly"
                        ? "bg-orange-500 text-white"
                        : "text-white/60 hover:text-white"
                        }`}
                    >
                      ماهانه
                    </button>
                    <button
                      onClick={() => setBillingCycle("quarterly")}
                      className={`py-2 rounded-lg text-sm transition-colors ${billingCycle === "quarterly"
                        ? "bg-orange-500 text-white"
                        : "text-white/60 hover:text-white"
                        }`}
                    >
                      ۳ ماهه
                    </button>
                    <button
                      onClick={() => setBillingCycle("biannual")}
                      className={`py-2 rounded-lg text-sm transition-colors ${billingCycle === "biannual"
                        ? "bg-orange-500 text-white"
                        : "text-white/60 hover:text-white"
                        }`}
                    >
                      ۶ ماهه
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div
                        className="text-4xl font-bold text-white"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {parseInt(
                          getPriceForCycle(billingCycle),
                        ).toLocaleString("fa-IR")}
                        <span className="text-lg text-white/60 mr-2">
                          تومان
                        </span>
                      </div>
                      <div className="text-sm text-white/50 mt-1 line-through">
                        {parseInt(
                          getOriginalPriceForCycle(billingCycle),
                        ).toLocaleString("fa-IR")}{" "}
                        تومان
                      </div>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg">
                      <span className="font-bold">{calculateDiscount()}٪</span>
                      <span className="text-sm mr-1">تخفیف</span>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-lg transition-all font-medium text-lg">
                    شروع رایگان ۷ روزه
                  </button>
                  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg transition-colors">
                    مشاوره رایگان
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>پرداخت کاملاً ایمن</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <Award className="w-5 h-5 text-green-500" />
                    <span>۷ روز ضمانت بازگشت وجه</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/70 text-sm">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span>فعال‌سازی آنی پس از خرید</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              در این پکیج چه چیزهایی دریافت می‌کنید؟
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPackage.whatYouGet.map((item, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-7 h-7 text-orange-500" />
                </div>
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p className="text-white/70 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              لیست کامل امکانات
            </h2>
          </div>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {currentPackage.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${feature.included ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                      >
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium mb-1">
                          {feature.name}
                        </div>
                        {feature.description && (
                          <div className="text-white/60 text-sm">
                            {feature.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      <FAQ />
    </div>
  );
}
