"use client";
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { PackageInfo, UserInfo, SubscriptionItem } from "@/types/workout";
import { showAlert } from "@/utils/alert";

interface CreateSubscriptionModalProps {
  onClose: () => void;
  onSuccess: () => void;
  packages: PackageInfo[];
}

export default function CreateSubscriptionModal({
  onClose,
  onSuccess,
  packages,
}: CreateSubscriptionModalProps) {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<UserInfo[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [createStatus, setCreateStatus] = useState<SubscriptionItem["status"]>("active");
  const [createEndsAt, setCreateEndsAt] = useState("");

  useEffect(() => {
    if (userSearchTerm.length > 1) {
      const fetchSearchUsers = async () => {
        try {
          const res = await fetch(
            `/api/admin/search?query=${encodeURIComponent(userSearchTerm)}`,
          );
          if (res.ok) {
            const data = await res.json();
            setSearchedUsers(data.userFind || []);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchSearchUsers();
    } else {
      setSearchedUsers([]);
    }
  }, [userSearchTerm]);

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedPackageId) {
      showAlert("هشدار", "لطفا کاربر و پکیج را انتخاب کنید", "warning");
      return;
    }
    try {
      const res = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser._id,
          packageId: selectedPackageId,
          status: createStatus,
          endsAt: createEndsAt
            ? new Date(createEndsAt).toISOString()
            : undefined,
        }),
      });
      if (res.ok) {
        showAlert("موفقیت", "اشتراک با موفقیت ثبت شد", "success");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        showAlert("خطا", `خطا: ${err.message}`, "error");
      }
    } catch (e) {
      console.error(e);
      showAlert("خطا", "خطا در ایجاد اشتراک", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
          <h2 className="text-xl text-white font-bold font-morabbaReg">
            ثبت اشتراک جدید (دستی)
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        <form
          onSubmit={handleCreateSubscription}
          className="p-6 space-y-4"
        >
          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              جستجو و انتخاب کاربر
            </label>
            {selectedUser ? (
              <div className="bg-white/5 border border-green-500/30 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="text-white font-semibold">
                    {selectedUser.fullName || "کاربر بدون نام"}
                  </div>
                  <div className="text-white/50 text-xs">
                    @{selectedUser.username} |{" "}
                    {selectedUser.phone || selectedUser.email}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="bg-red-500/20 text-red-400 p-1 rounded hover:bg-red-500/30 transition-colors cursor-pointer"
                >
                  تغییر
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="نام کاربری یا ایمیل کاربر..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                />
                {searchedUsers.length > 0 && (
                  <div className="absolute top-full right-0 left-0 bg-gray-800 border border-white/10 rounded-lg mt-1 overflow-hidden z-10 max-h-48 overflow-y-auto shadow-xl">
                    {searchedUsers.map((u) => (
                      <button
                        key={u._id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(u);
                          setSearchedUsers([]);
                        }}
                        className="w-full text-right p-3 hover:bg-white/5 text-white border-b border-white/5 last:border-0 block cursor-pointer"
                      >
                        <div className="font-semibold text-sm">
                          {u.fullName || "بدون نام"}
                        </div>
                        <div className="text-xs text-white/50">
                          @{u.username} | {u.phone || u.email}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              پکیج
            </label>
            <select
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 cursor-pointer"
              required
            >
              <option value="">انتخاب پکیج...</option>
              {packages.map((pkg) => (
                <option key={pkg._id} value={pkg._id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              وضعیت اشتراک
            </label>
            <select
              value={createStatus}
              onChange={(e) =>
                setCreateStatus(
                  e.target.value as SubscriptionItem["status"],
                )
              }
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50 cursor-pointer"
            >
              <option value="active">فعال</option>
              <option value="trial">تست (Trial)</option>
              <option value="expired">منقضی شده</option>
            </select>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2 font-medium">
              تاریخ پایان (اختیاری - پیش‌فرض ۳۰ روز آینده)
            </label>
            <input
              type="date"
              value={createEndsAt}
              onChange={(e) => setCreateEndsAt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-orange-500/50"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2.5 rounded-lg hover:opacity-90 font-medium text-sm cursor-pointer"
            >
              ثبت اشتراک
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg border border-white/10 text-sm cursor-pointer"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
