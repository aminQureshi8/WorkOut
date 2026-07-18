import { Award, Flame, TrendingUp } from "lucide-react";

export default function WorkoutAchievements() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
      <h3 className="font-bold font-morabbaReg text-white text-base flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-500" />
        <span>افتخارات ورزشی شما</span>
      </h3>

      <div className="space-y-3">
        <div className="flex items-center gap-3 bg-white/3 p-3 rounded-xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">تمرین مداوم هفتگی</h4>
            <p className="text-[10px] text-gray-500">
              ادامه دهید! ریتم فوق‌العاده‌ای دارید
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/3 p-3 rounded-xl border border-white/5">
          <div className="w-9 h-9 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">تعهد و انضباط</h4>
            <p className="text-[10px] text-gray-500">
              پیشرفت چشمگیر در ثبت تمرینات روزانه
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
