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

const recentUsers = [
  {
    id: 1,
    name: "محمد رضایی",
    package: "بسته حرفه‌ای",
    status: "فعال",
    joinDate: "۱۵ اردیبهشت",
  },
  {
    id: 2,
    name: "سارا احمدی",
    package: "بسته VIP",
    status: "فعال",
    joinDate: "۱۲ اردیبهشت",
  },
  {
    id: 3,
    name: "علی کریمی",
    package: "بسته پایه",
    status: "منقضی",
    joinDate: "۸ فروردین",
  },
  {
    id: 4,
    name: "فاطمه نوری",
    package: "بسته حرفه‌ای",
    status: "فعال",
    joinDate: "۵ اردیبهشت",
  },
  {
    id: 5,
    name: "حسین محمدی",
    package: "بسته VIP",
    status: "فعال",
    joinDate: "۳ اردیبهشت",
  },
];

const recentTickets = [
  {
    id: 101,
    user: "محمد رضایی",
    subject: "سوال درباره برنامه تمرینی",
    status: "در حال بررسی",
    time: "۲ ساعت پیش",
  },
  {
    id: 102,
    user: "سارا احمدی",
    subject: "مشکل در دانلود ویدیو",
    status: "پاسخ داده شده",
    time: "۵ ساعت پیش",
  },
  {
    id: 103,
    user: "علی کریمی",
    subject: "درخواست تمدید اشتراک",
    status: "جدید",
    time: "۱ روز پیش",
  },
];

export default async function AdminDashboard() {
  await dbConnect();

  const users = await User.find({}, "username createdAt")
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
          <div
            className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            ۲,۵۴۳
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
          <div
            className="text-xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
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
          <div
            className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            ۱۵۶
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
          <div
            className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            ۴۸
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
              <h2
                className="text-lg sm:text-xl font-bold text-white"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
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
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-500/20 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      {user.username.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium text-sm sm:text-base truncate">
                        {user.username}
                      </div>
                      <div className="text-white/60 text-xs sm:text-sm truncate">
                        {/* {user.package} */}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="text-left hidden md:block">
                      <div className="text-white/60 text-xs sm:text-sm">
                        تاریخ عضویت
                      </div>
                      <div className="text-white text-xs sm:text-sm">
                        {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                      </div>
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs ${user.status === "فعال" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {/* {user.status} */}
                    </span>
                    <button className="text-white/50 hover:text-white hidden sm:block">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h2
                className="text-lg sm:text-xl font-bold text-white"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                تیکت‌های اخیر
              </h2>
              <Link
                href="/tickets"
                className="text-orange-500 hover:text-orange-400 text-sm"
              >
                مشاهده همه
              </Link>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 sm:p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-white/60 text-xs">#{ticket.id}</div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${ticket.status === "جدید" ? "bg-blue-500/20 text-blue-400" : ticket.status === "در حال بررسی" ? "bg-orange-500/20 text-orange-400" : "bg-green-500/20 text-green-400"}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                  <div className="text-white font-medium mb-1 text-sm sm:text-base line-clamp-1">
                    {ticket.subject}
                  </div>
                  <div className="text-white/60 text-xs sm:text-sm mb-2">
                    {ticket.user}
                  </div>
                  <div className="flex items-center text-white/40 text-xs">
                    <Clock className="w-3 h-3 ml-1" />
                    {ticket.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
