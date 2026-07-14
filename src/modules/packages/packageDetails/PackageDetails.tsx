import FAQ from "@/modules/home/FAQ";
import Testimonials from "@/modules/home/Testimonials";
import Breadcrumb from "./Breadcrumb";
import PackageFeatures from "./PackageFeatures";
import PriceCard from "./PriceCard";
import TrustBadges from "./TrustBadges";
import PackageStats from "./PackageStats";
import { Check, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { iconMap } from "@/utils/icons";

export default function PackageDetails({
  package: packageData,
  features,
}: {
  package: any;
  features: any[];
}) {
  const PackageIcon = iconMap[packageData.icon] || Sparkles;

  return (
    <div
      className="min-h-screen bg-[#0B0F19] text-gray-100 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <Breadcrumb packageName={packageData.name} />

      <section className="py-12 lg:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-10">
              {packageData.popular && (
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md shadow-[0_2px_12px_rgba(249,115,22,0.1)]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>{packageData.tagline}</span>
                </div>
              )}

              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${packageData.color || packageData.colorClass || "from-orange-500 to-red-500"} rounded-2xl flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.3)] border border-white/10 transform hover:scale-105 transition-transform duration-300`}
                  >
                    <PackageIcon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 mb-3 font-morabbaReg leading-tight">
                      {packageData.name}
                    </h1>
                    <div className="flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full border border-white/5 w-fit">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(packageData.rating)
                                ? "fill-orange-500 text-orange-500"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/90 text-xs font-bold mr-1">
                        {packageData.rating}
                      </span>
                      <span className="text-white/40 text-xs">•</span>
                      <span className="text-white/60 text-xs font-medium">
                        {(
                          packageData.reviewCount ||
                          packageData.reviews ||
                          0
                        ).toLocaleString("fa-IR")}{" "}
                        نظر
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-white/70 leading-relaxed max-w-3xl">
                  {packageData.description}
                </p>
              </div>

              <PackageStats
                studentCount={packageData.studentCount ?? 0}
                rating={packageData.rating}
                reviewCount={
                  packageData.reviewCount ?? packageData.reviews ?? 0
                }
              />

              {packageData.highlights?.length > 0 && (
                <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-2xl" />
                  <h3 className="text-xl font-bold text-white mb-6 font-morabbaReg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span>نکات کلیدی پکیج</span>
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {packageData.highlights.map(
                      (highlight: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-white/80 group"
                        >
                          <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                            <Check className="w-4 h-4 text-orange-500" />
                          </div>
                          <span className="text-sm font-medium">
                            {highlight}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6 relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />

                <PriceCard
                  price={packageData.price}
                  originalPrice={packageData.originalPrice}
                />

                <div className="relative z-10 pt-2">
                  <Link
                    href={`/order/${packageData.slug}`}
                    className="block w-full text-center bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-2xl transition-all duration-300 font-semibold text-lg shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] hover:scale-[1.02] transform active:scale-[0.98]"
                  >
                    خرید پکیج
                  </Link>
                </div>

                <TrustBadges />
              </div>
            </div>
          </div>
        </div>
      </section>

      <PackageFeatures features={features} />

      <Testimonials />

      <FAQ />
    </div>
  );
}
