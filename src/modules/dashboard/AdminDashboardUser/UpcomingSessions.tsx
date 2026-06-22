const upcomingSessions = [
  {
    title: "جلسه مشاوره آنلاین",
    time: "امروز، ساعت ۱۸:۰۰",
    type: "مشاوره",
    icon: "💬",
  },
  {
    title: "ارزیابی پیشرفت ماهانه",
    time: "پنج‌شنبه، ۱۵ خرداد",
    type: "ارزیابی",
    icon: "📊",
  },
  { title: "تجدید اشتراک", time: "۱ تیر ۱۴۰۳", type: "مالی", icon: "💳" },
];

export default function UpcomingSessions() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h3 className="font-bold text-white mb-4">رویدادهای پیش رو</h3>
      <div className="space-y-3">
        {upcomingSessions.map((s, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "rgba(124,58,237,0.15)" }}
            >
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">
                {s.title}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{s.time}</p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                background: "rgba(124,58,237,0.2)",
                color: "#a78bfa",
              }}
            >
              {s.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
