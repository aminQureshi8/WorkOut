"use client";
import React, { useState } from "react";
import { showAlert } from "@/utils/alert";
import type { UserEditModalProps } from "@/types/user";

export default function UserEditModal({
  user,
  onClose,
  onSaveSuccess,
}: UserEditModalProps) {
  const [editUsername, setEditUsername] = useState(user.username);
  const [editEmail, setEditEmail] = useState(user.email || "");
  const [editPhone, setEditPhone] = useState(user.phone || "");
  const [editStatus, setEditStatus] = useState(() => {
    let dbStatus = "active";
    if (user.status === "مسدود") dbStatus = "blocked";
    else if (user.status === "منقضی") dbStatus = "expired";
    return dbStatus;
  });
  const [editRole, setEditRole] = useState<"user" | "admin" | "coach">(user.role);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(num);

  const handleSaveEdit = async () => {
    try {
      if (editRole === "coach" && user.role !== "coach") {
        await fetch("/api/admin/user/promote-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });
      }

      const res = await fetch(`/api/admin/user/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          phone: editPhone,
          role: editRole,
          status: editStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "خطا در بروزرسانی مشخصات کاربر");
      }

      showAlert({
        title: "موفقیت",
        text: "تغییرات با موفقیت ذخیره شد!",
        icon: "success",
      });

      onSaveSuccess();
      onClose();
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "خطا در ذخیره تغییرات";
      showAlert({
        title: "خطا",
        text: errMessage,
        icon: "error",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
          <h2 className="text-2xl text-white font-bold font-morabbaReg">
            ویرایش اطلاعات کاربر
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-4xl font-bold text-orange-400">
              {user.avatar || user.username[0]?.toUpperCase() || "👤"}
            </div>
            <div>
              <div className="text-white text-lg font-bold">
                {user.username}
              </div>
              <div className="text-white/60 text-sm">
                {user.email}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2 text-xs">
                نام کاربری
              </label>
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">
                ایمیل
              </label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">
                شماره تلفن
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">
                پکیج فعال
              </label>
              <input
                type="text"
                value={user.package || "—"}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed text-sm"
              />
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">
                وضعیت کاربر
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm cursor-pointer"
              >
                <option value="active" className="bg-gray-800">
                  فعال
                </option>
                <option value="expired" className="bg-gray-800">
                  منقضی
                </option>
                <option value="blocked" className="bg-gray-800">
                  مسدود
                </option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">نقش کاربر</label>
              <select
                value={editRole}
                onChange={(e) =>
                  setEditRole(
                    e.target.value as "user" | "admin" | "coach"
                  )
                }
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm cursor-pointer"
              >
                <option value="user" className="bg-gray-800">
                  کاربر
                </option>
                <option value="coach" className="bg-gray-800">
                  مربی
                </option>
                <option value="admin" className="bg-gray-800">
                  ادمین
                </option>
              </select>
              {editRole === "coach" && user.role !== "coach" && (
                <p className="text-blue-400 text-xs mt-2">
                  ⚠️ با ذخیره، پروفایل مربی برای این کاربر ساخته می‌شود.
                </p>
              )}
            </div>
            <div>
              <label className="block text-white mb-2 text-xs">
                تاریخ عضویت
              </label>
              <input
                type="text"
                value={new Date(user.createdAt).toLocaleDateString("fa-IR")}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/55 cursor-not-allowed text-sm ss02"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">آخرین ورود</div>
              <div className="text-white font-medium text-sm ss02">
                {user.lastLogin || "—"}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-white/60 text-xs mb-1">
                کل پرداخت‌ها
              </div>
              <div className="text-white font-medium text-sm font-morabbaReg">
                {user.totalPayments ? formatNumber(user.totalPayments) : "۰"} تومان
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={handleSaveEdit}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all font-bold text-sm cursor-pointer"
          >
            ذخیره تغییرات
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors cursor-pointer text-sm"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}
