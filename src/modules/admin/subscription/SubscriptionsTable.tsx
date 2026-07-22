"use client";
import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Loader2,
  Dumbbell,
  Edit,
  Trash2,
  Search,
  Utensils,
  Trophy,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import {
  SubscriptionItem,
  SubscriptionsTableRef,
  SubscriptionsTableProps,
} from "@/types/workout";
import { showAlert, showConfirm } from "@/utils/alert";
import Pagination from "@/components/AdminPagination";

export default forwardRef<SubscriptionsTableRef, SubscriptionsTableProps>(
  function SubscriptionsTable({ onOpenPlanModal, onEdit, onStatsUpdate }, ref) {
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    const fetchSubscriptions = useCallback(async () => {
      setLoading(true);
      try {
        const url = `/api/admin/subscription?page=${currentPage}&limit=8&status=${statusFilter}&search=${encodeURIComponent(debouncedSearch)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch subscriptions");
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
        console.log(data);
        
        setTotalPages(data.totalPages || 1);

        const statsRes = await fetch("/api/admin/subscription?limit=10000");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          const allSubs: SubscriptionItem[] = statsData.subscriptions || [];
          onStatsUpdate({
            total: allSubs.length,
            active: allSubs.filter((s) => s.status === "active").length,
            trial: allSubs.filter((s) => s.status === "trial").length,
            expired: allSubs.filter((s) => s.status === "expired").length,
          });
        }
      } catch (e) {
        console.error(e);
        showAlert("خطا", "خطا در بارگذاری اشتراک‌ها", "error");
      } finally {
        setLoading(false);
      }
    }, [currentPage, debouncedSearch, statusFilter, onStatsUpdate]);

    useImperativeHandle(
      ref,
      () => ({
        refresh() {
          fetchSubscriptions();
        },
      }),
      [fetchSubscriptions],
    );

    useEffect(() => {
      fetchSubscriptions();
    }, [fetchSubscriptions]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedSearch(searchTerm);
        setCurrentPage(1);
      }, 500);
      return () => clearTimeout(timer);
    }, [searchTerm]);

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
        !(await showConfirm(
          "حذف اشتراک",
          "آیا از حذف این اشتراک اطمینان دارید؟",
        ))
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

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
          <div className="overflow-x-auto min-h-[360px] pb-28">
            <table className="w-full min-w-[650px] text-right border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white/60 text-sm whitespace-nowrap">
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
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-md shrink-0">
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
                      <td className="p-4 whitespace-nowrap">
                        <span className="font-semibold text-orange-400">
                          {sub.packageId?.name || "پکیج حذف شده"}
                        </span>
                      </td>
                      <td className="p-4 text-white/80 whitespace-nowrap">
                        {formatDate(sub.startsAt)}
                      </td>
                      <td className="p-4 text-white/80 whitespace-nowrap">
                        {formatDate(sub.endsAt)}
                      </td>
                      <td className="p-4 whitespace-nowrap">{getStatusBadge(sub.status)}</td>
                      <td className="p-4 text-center whitespace-nowrap">
                        <div className="relative inline-block text-right">
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === sub._id ? null : sub._id,
                              )
                            }
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
                          >
                            <span>عملیات</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                openDropdownId === sub._id ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {openDropdownId === sub._id && (
                            <>
                              <div
                                className="fixed inset-0 z-20"
                                onClick={() => setOpenDropdownId(null)}
                              />
                              <div className="absolute left-0 top-full mt-1.5 w-48 bg-gray-900/95 border border-white/15 rounded-xl shadow-2xl z-30 overflow-hidden py-1.5 backdrop-blur-xl">
                                <button
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    if (sub.packageId) {
                                      onOpenPlanModal(sub.packageId);
                                    } else {
                                      showAlert("خطا", "پکیج یافت نشد!", "error");
                                    }
                                  }}
                                  className="w-full text-right px-3.5 py-2 text-xs text-purple-300 hover:bg-purple-500/15 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Dumbbell className="w-4 h-4 text-purple-400" />
                                  <span>برنامه تمرینی</span>
                                </button>

                                <Link
                                  href={`/admin/meal-plans?search=${encodeURIComponent(
                                    sub.packageId?.name || "",
                                  )}`}
                                  onClick={() => setOpenDropdownId(null)}
                                  className="w-full text-right px-3.5 py-2 text-xs text-emerald-300 hover:bg-emerald-500/15 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Utensils className="w-4 h-4 text-emerald-400" />
                                  <span>برنامه غذایی</span>
                                </Link>

                                <Link
                                  href={`/admin/pr?userId=${encodeURIComponent(
                                    (typeof sub.userId === "object"
                                      ? sub.userId?._id
                                      : sub.userId) || "",
                                  )}`}
                                  onClick={() => setOpenDropdownId(null)}
                                  className="w-full text-right px-3.5 py-2 text-xs text-amber-300 hover:bg-amber-500/15 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Trophy className="w-4 h-4 text-amber-400" />
                                  <span>رکوردهای شخصی (PR)</span>
                                </Link>

                                <div className="my-1 border-t border-white/10" />

                                <button
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    onEdit(sub);
                                  }}
                                  className="w-full text-right px-3.5 py-2 text-xs text-blue-300 hover:bg-blue-500/15 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4 text-blue-400" />
                                  <span>ویرایش</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setOpenDropdownId(null);
                                    handleDeleteSubscription(sub._id);
                                  }}
                                  className="w-full text-right px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/15 flex items-center gap-2.5 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-400" />
                                  <span>حذف اشتراک</span>
                                </button>
                              </div>
                            </>
                          )}
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
                نمایش صفحه {formatNumber(currentPage)} از{" "}
                {formatNumber(totalPages)}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    );
  },
);
