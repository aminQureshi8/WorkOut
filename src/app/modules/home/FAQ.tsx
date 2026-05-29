export default function FAQ() {
  const faqs = [
    {
      question: "آیا برای شروع نیاز به تجربه قبلی دارم؟",
      answer:
        "خیر، برنامه‌های ما برای تمام سطوح از مبتدی تا حرفه‌ای طراحی شده‌اند. مربیان ما برنامه را متناسب با سطح شما تنظیم می‌کنند.",
    },
    {
      question: "چقدر طول می‌کشد تا نتیجه ببینم؟",
      answer:
        "معمولاً پس از ۴-۶ هفته تمرین منظم، تغییرات قابل توجهی خواهید دید. البته این بستگی به تعهد، تغذیه و استراحت شما دارد.",
    },
    {
      question: "آیا برنامه غذایی هم ارائه می‌شود؟",
      answer:
        "بله، در پکیج‌های حرفه‌ای و VIP، برنامه تغذیه شخصی‌سازی شده توسط متخصص تغذیه ما طراحی می‌شود.",
    },
    {
      question: "امکان تغییر برنامه در طول دوره وجود دارد؟",
      answer:
        "بله، برنامه شما به صورت دوره‌ای بازبینی و بر اساس پیشرفت‌تان به‌روز می‌شود. همچنین می‌توانید در هر زمان درخواست تغییر دهید.",
    },
  ];
  return (
    <section className="py-20 bg-black/20 font-danaMed">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            سوالات متداول
          </h2>
          <p className="text-white/70 text-lg">پاسخ سوالات رایج شما</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
            >
              <details className="group">
                <summary className="p-6 cursor-pointer list-none flex justify-between items-center">
                  <h3 className="text-lg font-medium text-white">
                    {faq.question}
                  </h3>
                  <div className="text-orange-500 group-open:rotate-180 transition-transform">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-white/70">{faq.answer}</div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
