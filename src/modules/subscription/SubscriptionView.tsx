import Link from "next/link";
import {
  Calendar,
  Clock,
  Award,
  User,
  CheckCircle,
  Activity,
  Zap,
  ArrowUpLeft,
  CreditCard,
} from "lucide-react";
import DashboardWorkoutPlan from "./DashboardWorkoutPlan";
import NoSubscriptionView from "./NoSubscriptionView";
import PurchaseHistory from "./PurchaseHistory";
import ActiveAccesses from "./ActiveAccesses";
import { SubscriptionViewProps } from "@/types/subscription";

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

export default function SubscriptionView({
  subscription,
  workoutPlan,
  workoutDays,
  orders,
}: SubscriptionViewProps) {
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

              <ActiveAccesses />
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
          <NoSubscriptionView />
        )}

        <PurchaseHistory orders={orders} />
      </div>
    </div>
  );
}
