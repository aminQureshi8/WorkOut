import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  User,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Activity,
  FileText,
  TrendingUp,
  ChevronLeft,
  Sparkles,
  Zap,
  DollarSign,
  ArrowUpLeft,
} from "lucide-react";


import SubscriptionModel from "@/model/Subscription";
import PackageModel from "@/model/Package";
import CoachModel from "@/model/Coach";
import OrderModel from "@/model/Order";
import UserModel from "@/model/User";
import WorkoutPlanModel from "@/model/WorkoutPlan";
import WorkoutDayModel from "@/model/WorkoutDay";
import WorkoutExerciseModel from "@/model/WorkoutExercise";
import VideoModel from "@/model/Video";
import DashboardWorkoutPlan from "@/modules/subscription/DashboardWorkoutPlan";


const registerModels = () => {
  return [
    SubscriptionModel,
    PackageModel,
    CoachModel,
    OrderModel,
    UserModel,
    WorkoutPlanModel,
    WorkoutDayModel,
    WorkoutExerciseModel,
    VideoModel
  ];
};

export const dynamic = "force-dynamic";


const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};


const getCycleLabel = (cycle: string) => {
  switch (cycle) {
    case "monthly":
      return "ماهانه (۳۰ روزه)";
    case "quarterly":
      return "سه ماهه (۹۰ روزه)";
    case "biannual":
      return "شش ماهه (۱۸۰ روزه)";
    default:
      return cycle;
  }
};


const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          فعال
        </span>
      );
    case "trial":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          دوره آزمایشی
        </span>
      );
    case "expired":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
          منقضی شده
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
          لغو شده
        </span>
      );
    default:
      return null;
  }
};

export default async function SubscriptionPage() {
  registerModels();
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  
  const subscription = await SubscriptionModel.findOne({
    userId: session.user.id,
    status: { $in: ["active", "trial"] },
    endsAt: { $gt: new Date() },
  })
    .populate("packageId")
    .populate("coachId")
    .populate("orderId");

  
  let workoutPlan = null;
  let workoutDays: any[] = [];
  
  if (subscription) {
    workoutPlan = await WorkoutPlanModel.findOne({
      packageId: subscription.packageId?._id,
      isActive: true,
    }).lean();

    if (workoutPlan) {
      const days = await WorkoutDayModel.find({ planId: workoutPlan._id })
        .sort({ sortOrder: 1 })
        .lean();

      const dayIds = days.map(d => d._id);
      const exercises = await WorkoutExerciseModel.find({ dayId: { $in: dayIds } })
        .populate("videoId")
        .populate("videoId2")
        .sort({ sortOrder: 1 })
        .lean();

      workoutDays = days.map(day => ({
        ...day,
        _id: day._id.toString(),
        exercises: exercises
          .filter(e => e.dayId.toString() === day._id.toString())
          .map(e => ({
            ...e,
            _id: e._id.toString(),
            videoId: e.videoId ? {
              ...e.videoId,
              _id: e.videoId._id.toString()
            } : null,
            videoId2: e.videoId2 ? {
              ...e.videoId2,
              _id: e.videoId2._id.toString()
            } : null
          }))
      }));
    }
  }

  
  const orders = await OrderModel.find({
    userId: session.user.id,
  })
    .populate("packageId")
    .sort({ createdAt: -1 });

  
  let daysRemaining = 0;
  let totalDays = 1;
  let progressPercent = 0;

  if (subscription) {
    const now = new Date();
    const endsAt = new Date(subscription.endsAt);
    const startsAt = new Date(subscription.startsAt);

    const totalTime = endsAt.getTime() - startsAt.getTime();
    const remainingTime = endsAt.getTime() - now.getTime();

    daysRemaining = Math.max(
      0,
      Math.ceil(remainingTime / (1000 * 60 * 60 * 24)),
    );
    totalDays = Math.max(1, Math.ceil(totalTime / (1000 * 60 * 60 * 24)));
    progressPercent = Math.min(
      100,
      Math.max(0, Math.round(((totalDays - daysRemaining) / totalDays) * 100)),
    );
  }

  return (
    <div className="min-h-screen text-white font-danaMed pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-6 space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-morabbaReg text-2xl md:text-3xl font-bold text-white">
              اشتراک من
            </h1>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              جزئیات عضویت فعال، دسترسی‌های ورزشی و سوابق مالی شما
            </p>
          </div>
          {subscription && (
            <Link
              href="/packages"
              id="sub-upgrade-btn"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 animate-bounce" />
              <span>ارتقا یا تمدید اشتراک</span>
            </Link>
          )}
        </div>

        {subscription ? (
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-6">
              
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-500 shadow-md">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-white font-morabbaReg">
                        {subscription.packageId?.name || "پکیج اختصاصی"}
                      </h2>
                      <p className="text-gray-400 text-xs md:text-sm mt-0.5">
                        {subscription.packageId?.tagline ||
                          "برنامه اختصاصی تناسب اندام و مربیگری"}
                      </p>
                    </div>
                  </div>
                  <div>{getStatusBadge(subscription.status)}</div>
                </div>

                <hr className="border-white/10 my-6" />

                
                <div className="space-y-4">
                  <div className="flex justify-between items-end text-xs md:text-sm">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>میزان مصرف اشتراک</span>
                    </div>
                    <span className="font-bold text-purple-400">
                      {daysRemaining} روز مانده از {totalDays} روز
                    </span>
                  </div>

                  
                  <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  
                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs md:text-sm text-gray-400">
                    <div className="flex flex-col gap-1 bg-white/3 p-3 rounded-xl border border-white/5">
                      <span className="text-gray-500">تاریخ شروع</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(subscription.startsAt)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 bg-white/3 p-3 rounded-xl border border-white/5">
                      <span className="text-gray-500">تاریخ انقضا</span>
                      <span className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {formatDate(subscription.endsAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <h3 className="text-lg font-bold font-morabbaReg text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span>برنامه تمرینی فعال شما</span>
                </h3>
                <DashboardWorkoutPlan plan={workoutPlan} days={workoutDays} />
              </div>

              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                <h3 className="text-lg font-bold font-morabbaReg text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span>دسترسی‌های فعال شما</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        برنامه تمرینی سفارشی
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        طراحی شده بر اساس فیزیک و اهداف شما
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        ویدیوهای آموزشی حرکات
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        اجرای اصولی تمرین‌ها با راهنمای ویدیویی
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        پشتیبانی مستقیم مربی
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        ارسال تیکت و دریافت پاسخ سوالات ورزشی
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/3 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        گزارش و ارزیابی پیشرفت
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        تحلیل تغییرات فیزیکی شما در طول دوره
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="space-y-6">
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl relative overflow-hidden">
                <h3 className="text-base font-bold text-gray-400 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>مربی اختصاصی شما</span>
                </h3>

                {subscription.coachId ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      {subscription.coachId.avatarUrl ? (
                        <img
                          src={subscription.coachId.avatarUrl}
                          alt={subscription.coachId.name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-purple-500/30"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg border-2 border-purple-500/30">
                          {subscription.coachId.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {subscription.coachId.name}
                        </h4>
                        <p className="text-xs text-purple-400 mt-0.5">
                          {subscription.coachId.specialties
                            ?.slice(0, 2)
                            .join("، ") || "مربی ورزشی"}
                        </p>
                      </div>
                    </div>
                    {subscription.coachId.bio && (
                      <p className="text-xs text-gray-400 leading-relaxed bg-white/3 p-3 rounded-lg border border-white/5">
                        {subscription.coachId.bio}
                      </p>
                    )}
                    <Link
                      href="/dashboard/tickets"
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-white rounded-xl transition-all"
                    >
                      <span>گفتگو با مربی</span>
                      <ArrowUpLeft className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400 animate-pulse">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        در حال تخصیص مربی...
                      </p>
                      <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">
                        سیستم به زودی بهترین مربی را بر اساس فیزیک و هدف شما
                        مشخص خواهد کرد.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              
              {subscription.orderId && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
                  <h3 className="text-base font-bold text-gray-400 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    <span>جزئیات پرداخت دوره</span>
                  </h3>
                  <div className="space-y-3 text-xs md:text-sm">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">دوره صورت‌حساب</span>
                      <span className="text-white font-semibold">
                        {getCycleLabel(subscription.orderId.billingCycle)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-gray-500">مبلغ پرداخت شده</span>
                      <span className="text-white font-semibold">
                        {subscription.orderId.amountPaid.toLocaleString(
                          "fa-IR",
                        )}{" "}
                        تومان
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">کد پیگیری پرداخت</span>
                      <span className="text-purple-400 font-semibold select-all">
                        {subscription.orderId.paymentRef || "ثبت نشده"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-16 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10" />

            <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-purple-400 animate-pulse" />
            </div>

            <h2 className="font-morabbaReg text-xl md:text-2xl font-bold text-white mb-3">
              هیچ اشتراک فعالی ندارید!
            </h2>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md mx-auto">
              در حال حاضر اشتراک فعالی برای حساب کاربری شما ثبت نشده است. برای
              دریافت برنامه ورزشی اختصاصی و مشاوره مستقیم با مربیان، یکی از
              پکیج‌های ما را تهیه کنید.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-danaDemiBold">
              <Link
                href="/packages"
                id="sub-buy-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-white" />
                <span>مشاهده و خرید پکیج‌ها</span>
              </Link>
              <Link
                href="/dashboard/tickets"
                id="sub-support-btn"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5 text-gray-400" />
                <span>ارتباط با پشتیبانی</span>
              </Link>
            </div>
          </div>
        )}

        
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <h3 className="text-lg font-bold font-morabbaReg text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span>سوابق تراکنش‌ها و خریدها</span>
          </h3>

          {orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs md:text-sm">
                    <th className="pb-3 pr-2">پکیج</th>
                    <th className="pb-3">دوره</th>
                    <th className="pb-3">مبلغ پرداختی</th>
                    <th className="pb-3">تاریخ خرید</th>
                    <th className="pb-3">کد پیگیری</th>
                    <th className="pb-3 pl-2">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs md:text-sm text-gray-200">
                  {orders.map((order) => (
                    <tr
                      key={order._id.toString()}
                      className="hover:bg-white/2 transition-colors"
                    >
                      <td className="py-3.5 pr-2 font-semibold text-white">
                        {order.packageId?.name || "پکیج اختصاصی"}
                      </td>
                      <td className="py-3.5 text-gray-300">
                        {getCycleLabel(order.billingCycle)}
                      </td>
                      <td className="py-3.5 font-bold text-white">
                        {order.amountPaid.toLocaleString("fa-IR")} تومان
                      </td>
                      <td className="py-3.5 text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3.5 text-purple-400 font-mono select-all">
                        {order.paymentRef || "—"}
                      </td>
                      <td className="py-3.5 pl-2">
                        {order.status === "paid" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                            موفق
                          </span>
                        ) : order.status === "pending" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse">
                            در انتظار پرداخت
                          </span>
                        ) : order.status === "failed" ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
                            ناموفق
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                            مرجوع شده
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-xs md:text-sm">
              <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p>هیچ تراکنش مالی برای حساب شما یافت نشد.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
