"use client";
import {
  Dumbbell,
  MessageSquare,
  BookOpen,
  Clock,
  Award,
  ChevronLeft,
  Flame,
  Target,
  Activity,
  CheckCircle,
  AlertCircle,
  Play,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserDashboardProps } from "@/types/user-dashboard";
import DashboardBanner from "./DashboardBanner";
import WeeklyWorkouts from "./WeeklyWorkouts";

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

export default function UserDashboard({
  initialUser,
  initialSubscription,
  initialWorkouts,
  initialTickets,
  initialWishlist = [],
}: UserDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const user = initialUser;
  const subscription = initialSubscription;
  const recentWorkouts = initialWorkouts;
  const recentTickets = initialTickets;
  const wishlist = initialWishlist;

  const progressPercent = subscription
    ? Math.round(
        ((subscription.totalDays - subscription.daysRemaining) /
          subscription.totalDays) *
          100,
      )
    : 0;

  const weekDaysFa = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنج‌شنبه",
    "جمعه",
    "شنبه",
  ];
  const todayNameFa = weekDaysFa[new Date().getDay()];
  const todayWorkout =
    recentWorkouts.find((w) => w.day.includes(todayNameFa)) || null;

  return (
    <div
      className="min-h-screen bg-gray-950 text-white"
      style={{ fontFamily: "Dana, Marbuta, sans-serif", direction: "rtl" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="transition-all duration-300">
        <main className="p-4 md:p-6 space-y-6">
          <DashboardBanner userName={user.name} todayWorkout={todayWorkout} />

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
            <div
              className="lg:col-span-1 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white">اشتراک فعال</h3>
                {subscription && (
                  <Link
                    href="/dashboard/subscription"
                    className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
                  >
                    جزئیات <ChevronLeft size={14} />
                  </Link>
                )}
              </div>
              {subscription ? (
                <>
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
                          background:
                            "linear-gradient(90deg, #7c3aed, #ec4899)",
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
                </>
              ) : (
                <div className="text-center py-6 text-white/40 text-xs">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p>اشتراک فعالی برای شما ثبت نشده است</p>
                </div>
              )}
              <Link
                href="/packages"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-purple-300 border border-purple-500/30 hover:border-purple-500/60 transition-all"
              >
                <Zap size={14} />
                ارتقا یا خرید پکیج
              </Link>
            </div>

            <WeeklyWorkouts recentWorkouts={recentWorkouts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  href="/dashboard/tickets"
                  className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
                >
                  همه تیکت‌ها <ChevronLeft size={14} />
                </Link>
              </div>
              {recentTickets.length > 0 ? (
                <div className="space-y-3">
                  {recentTickets.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-all"
                      style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          t.rawStatus === "answered"
                            ? "bg-green-500/20"
                            : t.rawStatus === "closed"
                              ? "bg-gray-500/20"
                              : "bg-yellow-500/20"
                        }`}
                      >
                        {t.rawStatus === "answered" ? (
                          <CheckCircle size={14} className="text-green-400" />
                        ) : t.rawStatus === "closed" ? (
                          <CheckCircle size={14} className="text-gray-400" />
                        ) : (
                          <AlertCircle size={14} className="text-yellow-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">
                          {t.subject}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">{t.time}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                          t.rawStatus === "answered"
                            ? "bg-green-500/20 text-green-400"
                            : t.rawStatus === "closed"
                              ? "bg-gray-500/20 text-gray-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-white/40 text-xs">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-white/20" />
                  <p>تیکتی ثبت نکرده‌اید</p>
                </div>
              )}
              <Link
                href="/dashboard/tickets"
                className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
              >
                <MessageSquare size={14} />
                ارسال تیکت جدید
              </Link>
            </div>
          </div>

          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">علاقه‌مندی‌های شما</h3>
              <Link
                href="/articles"
                className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
              >
                مشاهده همه مقالات <ChevronLeft size={14} />
              </Link>
            </div>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {wishlist.map((a) => (
                  <Link
                    key={a.id}
                    href={`/article/${a.slug}`}
                    className="rounded-xl p-4 cursor-pointer hover:border-purple-500/40 transition-all group block bg-white/[0.03] border border-white/[0.07]"
                  >
                    {a.image ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={a.image}
                          alt={a.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-video bg-white/5 rounded-lg flex items-center justify-center text-3xl mb-3">
                        📚
                      </div>
                    )}
                    <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block bg-purple-500/20 text-purple-300">
                      {a.category}
                    </span>
                    <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/40 text-xs bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/20" />
                <p className="mb-2">لیست علاقه‌مندی‌های شما خالی است</p>
                <Link
                  href="/articles"
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  مشاهده و نشانه‌گذاری مقالات علمی
                </Link>
              </div>
            )}
          </div>

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
