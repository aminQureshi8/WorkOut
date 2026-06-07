"use client";

import FAQ from "@/modules/home/FAQ";
import Testimonials from "@/modules/home/Testimonials";
import {
  Check,
  X,
  Star,
  Users,
  Clock,
  Shield,
  Award,
  TrendingUp,
  MessageCircle,
  Video,
  FileText,
  Headphones,
  Sparkles,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// map icon string names (stored in DB) to actual Lucide components
const iconMap: Record<string, React.ElementType> = {
  Video,
  FileText,
  TrendingUp,
  Headphones,
  Award,
  Sparkles,
  MessageCircle,
  Shield,
  Users,
  Clock,
  Check,
  Star,
};

export default function PackageDetails({
  package: packageData,
  features,
}: {
  package: any;
  features: any[];
}) {
  const [billingCycle, setBillingCycle] = useState<
    "monthly" | "quarterly" | "biannual"
  >("monthly");

  const getPriceForCycle = (cycle: typeof billingCycle) => {
    return packageData.price[cycle];
  };

  const getOriginalPriceForCycle = (cycle: typeof billingCycle) => {
    return packageData.originalPrice[cycle];
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
            <span className="text-white">{packageData.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column */}
            <div className="space-y-8">
              {packageData.popular && (
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/50 text-orange-400 px-4 py-2 rounded-full">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {packageData.tagline}
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${packageData.color} rounded-2xl flex items-center justify-center text-4xl`}
                  >
                    {packageData.icon}
                  </div>
                  <div>
                    <h1
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                      style={{ fontFamily: "Marbeh, sans-serif" }}
                    >
                      {packageData.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(packageData.rating)
                                ? "fill-orange-500 text-orange-500"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                        <span className="text-white/80 mr-2">
                          {packageData.rating}
                        </span>
                        <span className="text-white/50 text-sm">
                          ({packageData.reviews} نظر)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xl text-white/80 leading-relaxed">
                  {packageData.description}
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
                        {(packageData.studentCount ?? 0).toLocaleString(
                          "fa-IR",
                        )}
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
                        {packageData.rating}
                      </div>
                      <div className="text-white/60 text-sm">رتبه از ۵</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {packageData.highlights?.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h3
                    className="text-xl font-bold text-white mb-4"
                    style={{ fontFamily: "Marbeh, sans-serif" }}
                  >
                    نکات کلیدی
                  </h3>
                  <ul className="space-y-3">
                    {packageData.highlights.map(
                      (highlight: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-white/80"
                        >
                          <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-orange-500" />
                          </div>
                          <span>{highlight}</span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
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
                    {(
                      [
                        { key: "monthly", label: "ماهانه" },
                        { key: "quarterly", label: "۳ ماهه" },
                        { key: "biannual", label: "۶ ماهه" },
                      ] as const
                    ).map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => setBillingCycle(key)}
                        className={`py-2 rounded-lg text-sm transition-colors ${
                          billingCycle === key
                            ? "bg-orange-500 text-white"
                            : "text-white/60 hover:text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
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
      {packageData.whatYouGet?.length > 0 && (
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
              {packageData.whatYouGet.map(
                (
                  item: { icon: string; title: string; description: string },
                  index: number,
                ) => {
                  const IconComponent = iconMap[item.icon];
                  return (
                    <div
                      key={index}
                      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="w-14 h-14 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                        {IconComponent ? (
                          <IconComponent className="w-7 h-7 text-orange-500" />
                        ) : (
                          <Sparkles className="w-7 h-7 text-orange-500" />
                        )}
                      </div>
                      <h3
                        className="text-lg font-bold text-white mb-2"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {item.description}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </section>
      )}

      {/* Detailed Features */}
      {features?.length > 0 && (
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
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-6 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            feature.included
                              ? "bg-green-500/20"
                              : "bg-red-500/20"
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
      )}

      {/* Testimonials */}
      <Testimonials />

      <FAQ />
    </div>
  );
}
