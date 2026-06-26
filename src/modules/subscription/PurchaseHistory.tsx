import React from "react";
import { FileText, AlertCircle } from "lucide-react";
import { PurchaseHistoryProps } from "@/types/subscription";

const formatDate = (date: Date | string) => {
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

export default function PurchaseHistory({ orders }: PurchaseHistoryProps) {
  return (
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
                  key={order._id}
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
  );
}
