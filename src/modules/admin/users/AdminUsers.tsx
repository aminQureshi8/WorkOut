"use client";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Package,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const users = [
    {
      id: 1,
      name: "محمد رضایی",
      email: "mohammad@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      package: "بسته حرفه‌ای",
      status: "فعال",
      joinDate: "۱۵ اردیبهشت ۱۴۰۳",
      lastLogin: "۲ ساعت پیش",
      totalPayments: "۳,۶۰۰,۰۰۰",
      avatar: "👨",
    },
    {
      id: 2,
      name: "سارا احمدی",
      email: "sara@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۸",
      package: "بسته VIP",
      status: "فعال",
      joinDate: "۱۲ اردیبهشت ۱۴۰۳",
      lastLogin: "۱ ساعت پیش",
      totalPayments: "۷,۵۰۰,۰۰۰",
      avatar: "👩",
    },
    {
      id: 3,
      name: "علی کریمی",
      email: "ali@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۷",
      package: "بسته پایه",
      status: "منقضی",
      joinDate: "۸ فروردین ۱۴۰۳",
      lastLogin: "۳ روز پیش",
      totalPayments: "۱,۵۰۰,۰۰۰",
      avatar: "🧑",
    },
    {
      id: 4,
      name: "فاطمه نوری",
      email: "fatemeh@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۶",
      package: "بسته حرفه‌ای",
      status: "فعال",
      joinDate: "۵ اردیبهشت ۱۴۰۳",
      lastLogin: "۵ ساعت پیش",
      totalPayments: "۲,۴۰۰,۰۰۰",
      avatar: "👩",
    },
    {
      id: 5,
      name: "حسین محمدی",
      email: "hosein@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۵",
      package: "بسته VIP",
      status: "مسدود",
      joinDate: "۳ اردیبهشت ۱۴۰۳",
      lastLogin: "۱ هفته پیش",
      totalPayments: "۵,۰۰۰,۰۰۰",
      avatar: "👨",
    },
    {
      id: 6,
      name: "زهرا حسینی",
      email: "zahra@example.com",
      phone: "۰۹۱۲۳۴۵۶۷۸۴",
      package: "بسته پایه",
      status: "فعال",
      joinDate: "۱ اردیبهشت ۱۴۰۳",
      lastLogin: "امروز",
      totalPayments: "۵۰۰,۰۰۰",
      avatar: "👩",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "فعال":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "منقضی":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "مسدود":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-white/20 text-white/60 border-white/30";
    }
  };

  const toggleUserSelection = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    // ← removed min-h-screen and the background gradient (layout handles bg)
    // ← added overflow-hidden to prevent the right-side scrollbar
    <div
      className="overflow-hidden"
      style={{ fontFamily: "Dana, sans-serif" }}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ۲,۵۴۳
                </div>
                <div className="text-white/60 text-xs">کل کاربران</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ۲,۱۲۳
                </div>
                <div className="text-white/60 text-xs">فعال</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ۳۸۵
                </div>
                <div className="text-white/60 text-xs">منقضی</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ۳۵
                </div>
                <div className="text-white/60 text-xs">مسدود</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="جستجو براساس نام، ایمیل یا شماره تلفن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="expired">منقضی</option>
                <option value="blocked">مسدود</option>
              </select>
              <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-lg transition-colors">
                <Filter className="w-4 h-4" />
                فیلتر پیشرفته
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 text-right">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(users.map((u) => u.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    />
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    کاربر
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    تماس
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    پکیج
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    وضعیت
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    تاریخ عضویت
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    آخرین ورود
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    کل پرداخت
                  </th>
                  <th className="p-4 text-right text-white/80 text-sm font-medium">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-xl">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.name}
                          </div>
                          <div className="text-white/60 text-xs">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Phone className="w-3 h-3" />
                          <span className="text-xs">{user.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Package className="w-4 h-4 text-orange-500" />
                        {user.package}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${getStatusBadge(user.status)}`}
                      >
                        {user.status === "فعال" && (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {user.status === "منقضی" && (
                          <Calendar className="w-3 h-3" />
                        )}
                        {user.status === "مسدود" && (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/70 text-sm">
                      {user.joinDate}
                    </td>
                    <td className="p-4 text-white/70 text-sm">
                      {user.lastLogin}
                    </td>
                    <td className="p-4">
                      <span
                        className="text-white font-medium"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {user.totalPayments}
                      </span>
                      <span className="text-white/60 text-xs mr-1">تومان</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
                          title="ویرایش"
                        >
                          <Edit className="w-4 h-4 text-white/70" />
                        </button>
                        <button
                          className="w-8 h-8 bg-white/5 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors"
                          title="مسدود کردن"
                        >
                          <Ban className="w-4 h-4 text-red-400" />
                        </button>
                        <button className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
                          <MoreVertical className="w-4 h-4 text-white/70" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-white/60 text-sm">
              نمایش ۱ تا ۶ از ۲,۵۴۳ کاربر
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 backdrop-blur-lg border border-orange-400 rounded-xl p-4 shadow-2xl z-50">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium">
                {selectedUsers.length} کاربر انتخاب شده
              </span>
              <div className="flex gap-2">
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  ارسال ایمیل گروهی
                </button>
                <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  تغییر وضعیت
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  لغو
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}