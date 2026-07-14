import { Shield, Award, Clock } from "lucide-react";

export default function TrustBadges() {
  return (
    <div className="relative z-10 pt-6 border-t border-white/5 space-y-3.5">
      <div className="flex items-center gap-3 text-white/60 text-sm">
        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span>پرداخت کاملاً امن و رمزنگاری شده</span>
      </div>
      <div className="flex items-center gap-3 text-white/60 text-sm">
        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span>۷ روز ضمانت بازگشت وجه کامل</span>
      </div>
      <div className="flex items-center gap-3 text-white/60 text-sm">
        <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <span>فعال‌سازی آنی محتوای آموزشی</span>
      </div>
    </div>
  );
}
