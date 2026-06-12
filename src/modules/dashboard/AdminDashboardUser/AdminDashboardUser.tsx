"use client"
import {
  Dumbbell,
  LayoutDashboard,
  CreditCard,
  MessageSquare,
  BookOpen,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Play,
  Download,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const user = {
  name: "علی رضایی",
  avatar: "ع",
  email: "ali@example.com",
  level: "کاربر حرفه‌ای",
  joinDate: "فروردین ۱۴۰۳",
  coachName: "مربی احمد کریمی",
};

const subscription = {
  packageName: "بسته حرفه‌ای",
  status: "active",
  daysRemaining: 28,
  totalDays: 60,
  endDate: "۱ تیر ۱۴۰۳",
  nextPayment: "۱,۲۰۰,۰۰۰",
};

const stats = [
  {
    label: "روز تمرین",
    value: "۳۲",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    change: "+۴ این هفته",
  },
  {
    label: "وزن کنونی",
    value: "۷۸",
    unit: "کیلو",
    icon: Activity,
    color: "from-blue-500 to-cyan-500",
    change: "-۲ کیلو",
  },
  {
    label: "هدف هفتگی",
    value: "۵/۷",
    unit: "جلسه",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    change: "۵ جلسه تکمیل",
  },
  {
    label: "امتیاز",
    value: "۱,۲۴۰",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    change: "+۸۰ این هفته",
  },
];

const recentWorkouts = [
  {
    day: "شنبه",
    type: "سینه و سه‌سر",
    duration: "۶۵ دقیقه",
    done: true,
    sets: 18,
  },
  {
    day: "یک‌شنبه",
    type: "کمر و دوسر",
    duration: "۵۵ دقیقه",
    done: true,
    sets: 16,
  },
  { day: "دوشنبه", type: "استراحت", duration: "—", done: true, sets: 0 },
  {
    day: "سه‌شنبه",
    type: "پا و سرشانه",
    duration: "۷۰ دقیقه",
    done: true,
    sets: 20,
  },
  {
    day: "چهارشنبه",
    type: "کاردیو",
    duration: "۴۰ دقیقه",
    done: false,
    sets: 0,
  },
  { day: "پنج‌شنبه", type: "بدن کامل", duration: "—", done: false, sets: 0 },
  { day: "جمعه", type: "استراحت", duration: "—", done: false, sets: 0 },
];

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

const recentTickets = [
  {
    id: 101,
    subject: "سوال درباره برنامه تمرینی",
    status: "در حال بررسی",
    time: "۲ ساعت پیش",
  },
  {
    id: 102,
    subject: "مشکل دانلود ویدیو",
    status: "پاسخ داده شده",
    time: "۱ روز پیش",
  },
];

const recentArticles = [
  {
    title: "راهنمای تغذیه قبل از تمرین",
    category: "تغذیه",
    readTime: "۵ دقیقه",
    image: "🥗",
  },
  {
    title: "۱۰ تمرین برای تقویت عضله سینه",
    category: "تمرین",
    readTime: "۷ دقیقه",
    image: "💪",
  },
  {
    title: "اهمیت خواب در عضله‌سازی",
    category: "سلامت",
    readTime: "۴ دقیقه",
    image: "😴",
  },
];

const menuItems = [
  {
    id: "dashboard",
    label: "داشبورد",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "subscription",
    label: "اشتراک من",
    icon: CreditCard,
    path: "/my-subscription/1",
  },
  {
    id: "tickets",
    label: "تیکت‌ها",
    icon: MessageSquare,
    badge: "۲",
    path: "/tickets",
  },
  { id: "articles", label: "مقالات", icon: BookOpen, path: "/articles" },
  { id: "profile", label: "پروفایل", icon: User, path: "/dashboard" },
];

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = usePathname();

  const progressPercent = Math.round(
    ((subscription.totalDays - subscription.daysRemaining) /
      subscription.totalDays) *
      100,
  );

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{ fontFamily: "Dana, Marbuta, sans-serif", direction: "rtl" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
 

      {/* Main content */}
      <div
        className={`transition-all duration-300`}
      >
     

        <main className="p-4 md:p-6 space-y-6">
          {/* Welcome banner */}
          <div
            className="relative rounded-2xl p-6 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #4c1d95, #1e1b4b)",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-purple-500 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-pink-500 blur-2xl"></div>
            </div>
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-purple-300 text-sm mb-1">
                  سلام، {user.name} 👋
                </p>
                <h2 className="text-2xl font-bold text-white mb-2">
                  بریم تمرین کنیم!
                </h2>
                <p className="text-gray-400 text-sm">
                  تمرین امروز:{" "}
                  <span className="text-white font-semibold">
                    کاردیو ۴۰ دقیقه‌ای
                  </span>
                </p>
              </div>
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                }}
              >
                <Play size={16} />
                شروع تمرین
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${stat.color}`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-2xl font-bold text-white">
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-gray-400 text-sm mb-0.5">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                  <p className="text-green-400 text-xs mt-1">{stat.change}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Subscription card */}
            <div
              className="lg:col-span-1 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">اشتراک فعال</h3>
                <Link
                  href="/my-subscription/1"
                  className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
                >
                  جزئیات <ChevronLeft size={14} />
                </Link>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  }}
                >
                  <Award size={22} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {subscription.packageName}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                    فعال
                  </span>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>پیشرفت اشتراک</span>
                  <span>{subscription.daysRemaining} روز مانده</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #7c3aed, #ec4899)",
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">تاریخ پایان</span>
                  <span className="text-white">{subscription.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">پرداخت بعدی</span>
                  <span className="text-white">
                    {subscription.nextPayment} تومان
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">مربی</span>
                  <span className="text-purple-300">{user.coachName}</span>
                </div>
              </div>
              <Link
                href="/packages"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-purple-300 border border-purple-500/30 hover:border-purple-500/60 transition-all"
              >
                <Zap size={14} />
                ارتقا پکیج
              </Link>
            </div>

            {/* Weekly workouts */}
            <div
              className="lg:col-span-2 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">برنامه هفتگی</h3>
                <span className="text-xs text-gray-500">هفته جاری</span>
              </div>
              <div className="space-y-2">
                {recentWorkouts.map((w, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${w.done ? "opacity-100" : "opacity-60"}`}
                    style={{
                      background: w.done
                        ? "rgba(124,58,237,0.1)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${w.done ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)"}`,
                    }}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${w.done ? "bg-green-500/20" : "bg-white/10"}`}
                    >
                      {w.done ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <Clock size={14} className="text-gray-500" />
                      )}
                    </div>
                    <span className="text-gray-400 text-xs w-16 flex-shrink-0">
                      {w.day}
                    </span>
                    <span
                      className={`flex-1 text-sm ${w.done ? "text-white" : "text-gray-500"}`}
                    >
                      {w.type}
                    </span>
                    {w.duration !== "—" && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={11} /> {w.duration}
                      </span>
                    )}
                    {w.sets > 0 && (
                      <span className="text-xs text-purple-400">
                        {w.sets} ست
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming sessions */}
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

            {/* Recent tickets */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">تیکت‌های اخیر</h3>
                <Link
                  href="/tickets"
                  className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
                >
                  همه تیکت‌ها <ChevronLeft size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {recentTickets.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${t.status === "پاسخ داده شده" ? "bg-green-500/20" : "bg-yellow-500/20"}`}
                    >
                      {t.status === "پاسخ داده شده" ? (
                        <CheckCircle size={14} className="text-green-400" />
                      ) : (
                        <AlertCircle size={14} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{t.subject}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{t.time}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${t.status === "پاسخ داده شده" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
                <Link
                  href="/tickets"
                  className="flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                >
                  <MessageSquare size={14} />
                  ارسال تیکت جدید
                </Link>
              </div>
            </div>
          </div>

          {/* Recent articles */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">مقالات پیشنهادی</h3>
              <Link
                href="/articles"
                className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
              >
                همه مقالات <ChevronLeft size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentArticles.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 cursor-pointer hover:border-purple-500/40 transition-all group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="text-3xl mb-3">{a.image}</div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block"
                    style={{
                      background: "rgba(124,58,237,0.2)",
                      color: "#a78bfa",
                    }}
                  >
                    {a.category}
                  </span>
                  <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-2">
                    <Clock size={11} />
                    {a.readTime} مطالعه
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress chart placeholder */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">نمودار پیشرفت</h3>
              <div className="flex gap-2">
                {["هفته", "ماه", "۳ ماه"].map((p, i) => (
                  <button
                    key={i}
                    className={`text-xs px-3 py-1 rounded-lg transition-all ${i === 1 ? "text-white" : "text-gray-500 hover:text-white"}`}
                    style={
                      i === 1
                        ? {
                            background:
                              "linear-gradient(135deg, #7c3aed, #ec4899)",
                          }
                        : { background: "rgba(255,255,255,0.05)" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {/* Simple bar chart */}
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-lg transition-all hover:opacity-80"
                    style={{
                      height: `${h}%`,
                      background:
                        i === 5
                          ? "linear-gradient(180deg, #7c3aed, #ec4899)"
                          : "rgba(124,58,237,0.3)",
                    }}
                  ></div>
                  <span className="text-gray-600 text-xs">
                    {["ش", "ی", "د", "س", "چ", "پ", "ج"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  }}
                ></div>
                بهترین روز
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-purple-900/50"></div>
                روزهای دیگر
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
