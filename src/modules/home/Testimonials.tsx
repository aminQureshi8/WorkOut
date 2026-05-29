import { BiStar } from "react-icons/bi";

export default function Testimonials() {
  const testimonials = [
    {
      name: "رضا کاظمی",
      role: "مهندس نرم‌افزار",
      text: "با برنامه‌های اختصاصی فیت‌کوچ توانستم در ۶ ماه ۱۵ کیلو وزن کم کنم و عضله‌سازی قابل توجهی داشته باشم. مربیگری آنلاین و پشتیبانی ۲۴ساعته فوق‌العاده است!",
      rating: 5,
      image: "👨",
    },
    {
      name: "نیلوفر امینی",
      role: "معلم",
      text: "همیشه فکر می‌کردم بدنسازی برای خانم‌ها سخت است، اما با راهنمایی سارا خانم و برنامه‌های شخصی‌سازی شده، الان در بهترین فرم زندگیم هستم!",
      rating: 5,
      image: "👩",
    },
    {
      name: "امیر حسینی",
      role: "دانشجو",
      text: "قیمت‌ها منصفانه و کیفیت خدمات عالی. برنامه تمرینی من دقیقاً متناسب با سطح و زمان‌بندی من طراحی شده. پیشرفت‌های چشمگیری داشتم.",
      rating: 5,
      image: "🧑",
    },
  ];

  return (
    <section className="py-20 bg-black/20 font-danaMed">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            نظرات کاربران ما
          </h2>
          <p className="text-white/70 text-lg">داستان موفقیت از زبان خودشان</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <BiStar
                    key={i}
                    className="w-5 h-5 fill-orange-500 text-orange-500"
                  />
                ))}
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {testimonial.name}
                  </div>
                  <div className="text-white/60 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
