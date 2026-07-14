import type { PackageFeaturesProps } from "@/types/components";
import { Check, X } from "lucide-react";

export default function PackageFeatures({ features }: PackageFeaturesProps) {
  if (!features || features.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-morabbaReg">
            لیست کامل امکانات
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mt-4" />
        </div>
        <div className="bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="divide-y divide-white/5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 hover:bg-white/5 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        feature.included
                          ? "bg-green-500/10 border border-green-500/20"
                          : "bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-base mb-1">
                        {feature.name}
                      </div>
                      {feature.description && (
                        <div className="text-white/50 text-sm">
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
  );
}
