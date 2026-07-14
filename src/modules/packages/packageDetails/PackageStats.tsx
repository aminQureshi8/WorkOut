import type { PackageStatsProps } from "@/types/components";
import { Users, Star, MessageCircle } from "lucide-react";

export default function PackageStats({ studentCount, rating, reviewCount }: PackageStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 rounded-2xl p-5 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.1)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-white font-morabbaReg">
            {studentCount.toLocaleString("fa-IR")}
          </div>
          <div className="text-white/50 text-xs mt-1">
            دانشجو فعال
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 rounded-2xl p-5 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.1)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
            <Star className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-white font-morabbaReg">
            {rating}
          </div>
          <div className="text-white/50 text-xs mt-1">
            امتیاز پکیج
          </div>
        </div>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-orange-500/20 transition-all duration-300 rounded-2xl p-5 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_30px_rgba(249,115,22,0.1)]">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-3">
            <MessageCircle className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-white font-morabbaReg">
            {reviewCount.toLocaleString("fa-IR")}
          </div>
          <div className="text-white/50 text-xs mt-1">
            تعداد نظرات
          </div>
        </div>
      </div>
    </div>
  );
}
