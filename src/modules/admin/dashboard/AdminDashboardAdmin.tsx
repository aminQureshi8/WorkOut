import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import {
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Search,
  MoreVertical,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { AdminDashboardAdminProps } from "@/types/admin";
import RecentComments from "./RecentComments";

const gradients = [
  "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30",
  "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
  "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
  "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30",
  "from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/30",
];

const statusMap: Record<string, { text: string; bg: string; dot: string }> = {
  active: {
    text: "فعال",
    bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400 animate-pulse",
  },
  expired: {
    text: "منقضی شده",
    bg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  blocked: {
    text: "مسدود شده",
    bg: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    dot: "bg-rose-400",
  },
};

const roleMap: Record<string, { text: string; bg: string }> = {
  admin: {
    text: "مدیر",
    bg: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
  },
  coach: {
    text: "مربی",
    bg: "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20",
  },
};



export default async function AdminDashboardAdmin({
  usersCount = 0,
  publishedBlogsCount = 0,
  openTicketsCount = 0,
}: AdminDashboardAdminProps) {
  await dbConnect();

  const users = await User.find({}, "username email fullName role status createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 font-morabbaReg">
            {usersCount.toLocaleString("fa-IR")}
          </div>
          <div className="text-white/60 text-xs sm:text-sm">کاربران فعال</div>
          <div className="text-green-400 text-xs mt-1 sm:mt-2 hidden sm:block">
            +۱۲% نسبت به ماه قبل
          </div>
          <div className="text-green-400 text-xs mt-1 sm:hidden">+۱۲%</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 font-morabbaReg">
            ۱۲۵ <span className="text-base sm:text-xl">م</span>
          </div>
          <div className="text-white/60 text-xs sm:text-sm">درآمد ماهانه</div>
          <div className="text-green-400 text-xs mt-1 sm:mt-2 hidden sm:block">
            +۸% نسبت به ماه قبل
          </div>
          <div className="text-green-400 text-xs mt-1 sm:hidden">+۸%</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 font-morabbaReg">
            {publishedBlogsCount.toLocaleString("fa-IR")}
          </div>
          <div className="text-white/60 text-xs sm:text-sm">
            مقالات منتشر شده
          </div>
          <div className="text-green-400 text-xs mt-1 sm:mt-2 hidden sm:block">
            +۴ مقاله این ماه
          </div>
          <div className="text-green-400 text-xs mt-1 sm:hidden">+۴ مقاله</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-white/10 rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <span className="text-orange-400 text-xs bg-orange-500/20 px-2 py-1 rounded-full">
              ۳ جدید
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2 font-morabbaReg">
            {openTicketsCount.toLocaleString("fa-IR")}
          </div>
          <div className="text-white/60 text-xs sm:text-sm">تیکت‌های باز</div>
          <div className="text-white/40 text-xs mt-1 sm:mt-2 hidden sm:block">
            نیاز به پاسخگویی
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 min-w-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white font-morabbaReg">
                کاربران اخیر
              </h2>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="جستجو..."
                    className="w-full sm:w-auto bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <Link
                  href="/admin/users"
                  className="text-orange-500 hover:text-orange-400 text-sm whitespace-nowrap"
                >
                  مشاهده همه
                </Link>
              </div>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="space-y-2 sm:space-y-4">
              {users.map((user, index) => {
                const displayName = user.fullName || user.username || "?";
                const initial = displayName.charAt(0).toUpperCase();
                const dateStr = new Date(user.createdAt).toLocaleDateString("fa-IR", {
                  day: "numeric",
                  month: "long",
                });
                const statusInfo = statusMap[user.status] || {
                  text: "نامشخص",
                  bg: "bg-white/5 text-white/60 border border-white/10",
                  dot: "bg-white/40",
                };
                const roleInfo = roleMap[user.role];
                const gradientClass = gradients[index % gradients.length];

                return (
                  <div
                    key={user._id.toString()}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-white/[0.03] to-white/[0.01] hover:from-white/[0.08] hover:to-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-orange-500/[0.02]"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br border rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 shadow-inner ${gradientClass}`}>
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
                          <span className="text-white font-semibold text-sm sm:text-base truncate">
                            {displayName}
                          </span>
                          {roleInfo && (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium leading-none ${roleInfo.bg}`}>
                              {roleInfo.text}
                            </span>
                          )}
                        </div>
                        <div className="text-white/40 text-xs truncate font-mono tracking-wide">
                          {user.email || user.username}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                      <div className="text-left hidden md:block">
                        <div className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                          تاریخ عضویت
                        </div>
                        <div className="text-white/85 text-xs sm:text-sm font-medium">
                          {dateStr}
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 font-medium ${statusInfo.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.text}
                      </span>
                      <Link
                        href="/admin/users"
                        className="text-white/40 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg hidden sm:block"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <RecentComments />
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 sm:p-6 transition-colors text-right">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2 sm:mb-3" />
          <div className="text-white font-medium text-sm sm:text-base mb-1">
            افزودن کاربر جدید
          </div>
          <div className="text-white/60 text-xs sm:text-sm hidden sm:block">
            ایجاد حساب کاربری جدید
          </div>
        </button>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 sm:p-6 transition-colors text-right">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2 sm:mb-3" />
          <div className="text-white font-medium text-sm sm:text-base mb-1">
            نوشتن مقاله جدید
          </div>
          <div className="text-white/60 text-xs sm:text-sm hidden sm:block">
            انتشار محتوای آموزشی
          </div>
        </button>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 sm:p-6 transition-colors text-right">
          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2 sm:mb-3" />
          <div className="text-white font-medium text-sm sm:text-base mb-1">
            ایجاد برنامه تمرینی
          </div>
          <div className="text-white/60 text-xs sm:text-sm hidden sm:block">
            طراحی برنامه اختصاصی
          </div>
        </button>
        <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 sm:p-6 transition-colors text-right">
          <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 mb-2 sm:mb-3" />
          <div className="text-white font-medium text-sm sm:text-base mb-1">
            مشاهده تیکت‌ها
          </div>
          <div className="text-white/60 text-xs sm:text-sm hidden sm:block">
            پاسخگویی به کاربران
          </div>
        </button>
      </div>
    </div>
  );
}
