import Link from "next/link";
import { ChevronLeft, Award, AlertCircle, Zap } from "lucide-react";

interface SubscriptionInfo {
  packageName: string;
  status: string;
  daysRemaining: number;
  totalDays: number;
  endDate: string;
  nextPayment: string;
}

interface ActiveSubscriptionProps {
  subscription: SubscriptionInfo | null;
  coachName: string;
}

export default function ActiveSubscription({ subscription, coachName }: ActiveSubscriptionProps) {
  const progressPercent = subscription
    ? Math.round(
        ((subscription.totalDays - subscription.daysRemaining) /
          subscription.totalDays) *
          100,
      )
    : 0;

  return (
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
              <span className="text-purple-300">{coachName}</span>
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
  );
}
