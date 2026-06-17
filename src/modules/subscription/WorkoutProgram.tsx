import {
  Dumbbell,
  Calendar,
  CheckCircle,
  PlayCircle,
  Download,
  Clock,
} from "lucide-react";

export default function WorkoutProgram({
  plan,
  days,
}: {
  plan: any;
  days: any;
}) {
  return (
    <div
      className="min-h-screen bg-gradient-to-br font-danaMed from-gray-900 via-gray-800 to-gray-900"
      dir="rtl"
    >
      <section className="py-12 bg-black/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {plan.title}
              </h1>
              <p className="text-white/70">{plan.description} - ۳ ماهه</p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                دانلود PDF
              </button>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-lg transition-colors">
                <PlayCircle className="w-5 h-5" />
                ویدیوها
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-white/60 mb-2">هفته جاری</div>
              <div className="text-3xl font-bold text-white">۴ / ۱۲</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-white/60 mb-2">تمرینات انجام شده</div>
              <div className="text-3xl font-bold text-orange-500">۱۸</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-white/60 mb-2">میانگین مدت تمرین</div>
              <div className="text-3xl font-bold text-white">۶۵ دقیقه</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <div className="text-white/60 mb-2">پیشرفت کلی</div>
              <div className="text-3xl font-bold text-green-500">۷۵٪</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            برنامه هفتگی
          </h2>

          <div className="space-y-6">
            {days.map((day: any, index: number) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg ss02 border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 p-6 border-b border-white/10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {day.dayName}
                        </h3>
                        <p className="text-white/70">{day.muscleGroup}</p>
                      </div>
                    </div>
                    {day.exercises.length > 0 && (
                      <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                        <CheckCircle className="w-5 h-5" />
                        تمرین انجام شد
                      </button>
                    )}
                  </div>
                </div>

                {day.exercises.length > 0 ? (
                  <div className="p-6">
                    <div className="space-y-4">
                      {day.exercises.map((exercise: any, exIndex: number) => (
                        <div
                          key={exIndex}
                          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">
                              {exercise.name}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Dumbbell className="w-4 h-4" />
                                {exercise.sets}
                              </span>
                              <span>{exercise.reps}</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                استراحت: {exercise.restSec}
                              </span>
                            </div>
                          </div>
                          <button className="flex items-center gap-2 text-orange-500 hover:text-orange-400">
                            <PlayCircle className="w-5 h-5" />
                            <span className="text-sm">تماشای ویدیو</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-white/60">
                    امروز روز استراحت است. می‌توانید کاردیوی سبک انجام دهید.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
