"use client";
import React from "react";
import { Loader2, Dumbbell, Edit, Trash2, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { SubscriptionItem, PackageInfo } from "@/types/workout";
import { showAlert, showConfirm } from "@/utils/alert";

interface SubscriptionsTableProps {
  loading: boolean;
  subscriptions: SubscriptionItem[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onOpenPlanModal: (pkg: PackageInfo) => void;
  onEdit: (sub: SubscriptionItem) => void;
  fetchSubscriptions: () => Promise<void>;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export default function SubscriptionsTable({
  loading,
  subscriptions,
  currentPage,
  totalPages,
  setCurrentPage,
  onOpenPlanModal,
  onEdit,
  fetchSubscriptions,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: SubscriptionsTableProps) {

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fa-IR").format(num);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("fa-IR");
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: SubscriptionItem["status"]) => {
    const styles = {
      active: "bg-green-500/20 text-green-400 border-green-500/30",
      trial: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      expired: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    };

    const labels = {
      active: "فعال",
      trial: "تست (Trial)",
      expired: "منقضی شده",
      cancelled: "لغو شده",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full border text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const handleDeleteSubscription = async (id: string) => {
    if (
      !(await showConfirm("حذف اشتراک", "آیا از حذف این اشتراک اطمینان دارید@"))
    )
      return;
    try {
      const res = await fetch(`/api/admin/subscription?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت حذف شد", "success");
        fetchSubscriptions();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در حذف اشتراک", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and filter bar */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="جستجو در نام، یوزرنیم، ایمیل یا شماره..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
          <span className="text-white/60 text-sm whitespace-nowrap ml-2">
            وضعیت:
          </span>
          {["all", "active", "trial", "expired", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {st === "all"
                ? "همه"
                : st === "active"
                  ? "فعال"
                  : st === "trial"
                    ? "آزمایشی"
                    : st === "expired"
                      ? "منقضی شده"
                      : "لغو شده"}
            </button>
          ))}
        </div>
      </div>

      {/* Table wrapper */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 text-sm">
                <th className="p-4 font-semibold">کاربر</th>
                <th className="p-4 font-semibold">پکیج</th>
                <th className="p-4 font-semibold">شروع</th>
                <th className="p-4 font-semibold">پایان</th>
                <th className="p-4 font-semibold">وضعیت</th>
                <th className="p-4 font-semibold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-white/60">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                      <span>در حال بارگذاری اطلاعات...</span>
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/40">
                    هیچ اشتراکی پیدا نشد
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors text-white text-sm"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-md">
                          {sub.userId?.fullName?.charAt(0) ||
                            sub.userId?.username?.charAt(0) ||
                            "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {sub.userId?.fullName || "کاربر ناشناس"}
                          </div>
                          <div className="text-white/50 text-xs">
                            @{sub.userId?.username || "username"} |{" "}
                            {sub.userId?.phone || sub.userId?.email || "-"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-orange-400">
                        {sub.packageId?.name || "پکیج حذف شده"}
                      </span>
                    </td>
                    <td className="p-4 text-white/80">
                      {formatDate(sub.startsAt)}
                    </td>
                    <td className="p-4 text-white/80">
                      {formatDate(sub.endsAt)}
                    </td>
                    <td className="p-4">{getStatusBadge(sub.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (sub.packageId) {
                              onOpenPlanModal(sub.packageId);
                            } else {
                              showAlert("خطا", "پکیج یافت نشد!", "error");
                            }
                          }}
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors cursor-pointer"
                        >
                          <Dumbbell className="w-3.5 h-3.5" />
                          برنامه تمرینی
                        </button>
                        <button
                          onClick={() => onEdit(sub)}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(sub._id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="حذف اشتراک"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
            <span className="text-white/60 text-xs">
              نمایش صفحه {formatNumber(currentPage)} از {formatNumber(totalPages)}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="bg-white/5 border border-white/10 text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="bg-white/5 border border-white/10 text-white p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
