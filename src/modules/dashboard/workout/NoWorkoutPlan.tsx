import { Dumbbell } from "lucide-react";

export default function NoWorkoutPlan() {
  return (
    <div className="min-h-screen text-white font-danaMed pb-12 bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-purple-900/10 via-transparent to-transparent -z-10" />
      <div className="text-center space-y-6 max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl" />
        <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
          <Dumbbell className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold font-morabbaReg">
            برنامه تمرینی یافت نشد
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            هیچ برنامه تمرینی فعالی برای اشتراک شما ثبت نشده است. پس از تایید
            مربی و طراحی برنامه، جزئیات آن در این بخش نمایش داده خواهد شد.
          </p>
        </div>
      </div>
    </div>
  );
}
