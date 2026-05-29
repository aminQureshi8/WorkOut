import { BiCheckCircle, BiTrendingUp } from "react-icons/bi";
import { BsClock } from "react-icons/bs";

export default function WorkoutPlans() {
  const workoutPlans = [
    {
      title: "برنامه افزایش حجم",
      description: "برای کسانی که به دنبال رشد عضلانی هستند",
      duration: "۱۲ هفته",
      level: "متوسط تا پیشرفته",
      icon: "💪",
      features: [
        "۵ روز تمرین در هفته",
        "تمرکز روی وزنه‌های آزاد",
        "برنامه غذایی پرکالری",
      ],
    },
    {
      title: "برنامه کاهش وزن",
      description: "چربی‌سوزی و لاغری با حفظ عضلات",
      duration: "۸ هفته",
      level: "همه سطوح",
      icon: "🔥",
      features: [
        "ترکیب کاردیو و قدرتی",
        "برنامه غذایی کم‌کالری",
        "تمرینات HIIT",
      ],
    },
    {
      title: "برنامه تناسب اندام",
      description: "برای تقویت عمومی بدن و سلامتی",
      duration: "۱۰ هفته",
      level: "مبتدی تا متوسط",
      icon: "⚡",
      features: [
        "۴ روز تمرین در هفته",
        "تمرینات کاربردی",
        "انعطاف‌پذیری و توازن",
      ],
    },
  ];

  return (
    <section className="py-20 font-danaMed">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            برنامه‌های تمرینی متناسب با هدف شما
          </h2>
          <p className="text-white/70 text-lg">
            برنامه خود را بر اساس هدف و سطح انتخاب کنید
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {workoutPlans.map((plan, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all hover:scale-105"
            >
              <div className="text-6xl mb-6">{plan.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {plan.title}
              </h3>
              <p className="text-white/70 mb-6">{plan.description}</p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <BsClock className="w-4 h-4 text-orange-500" />
                  <span>مدت: {plan.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <BiTrendingUp className="w-4 h-4 text-orange-500" />
                  <span>سطح: {plan.level}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-8">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-white/70 text-sm"
                  >
                    <BiCheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white border border-orange-500/50 py-3 rounded-lg transition-colors">
                مشاهده جزئیات
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
