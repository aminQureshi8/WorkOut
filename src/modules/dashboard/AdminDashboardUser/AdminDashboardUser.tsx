"use client";
import { useState } from "react";
import { UserDashboardProps } from "@/types/user-dashboard";
import DashboardBanner from "./DashboardBanner";
import WeeklyWorkouts from "./WeeklyWorkouts";
import DashboardStats from "./DashboardStats";
import UpcomingSessions from "./UpcomingSessions";
import RecentTickets from "./RecentTickets";
import ActiveSubscription from "./ActiveSubscription";
import WishlistArticles from "./WishlistArticles";

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

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActiveSubscription
              subscription={subscription}
              coachName={user.coachName}
            />

            <WeeklyWorkouts recentWorkouts={recentWorkouts} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UpcomingSessions />

            <RecentTickets recentTickets={recentTickets} />
          </div>

          <WishlistArticles wishlist={wishlist} />

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
