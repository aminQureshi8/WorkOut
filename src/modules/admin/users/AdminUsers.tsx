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
} from "lucide-react";

import { useEffect, useState } from "react";

interface IUser {
  _id: string;
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "coach";
  status: string;
  package?: string;
  avatar?: string;
  joinDate?: string;
  lastLogin?: string;
  totalPayments?: string;
  createdAt: string;
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [editRole, setEditRole] = useState<"user" | "admin" | "coach">("user");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await fetch("/api/admin/user");
    const data = await res.json();
    setUsers(data.users);
  };

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

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "coach":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "ادمین";
      case "coach":
        return "مربی";
      default:
        return "کاربر";
    }
  };

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      // اگه role به coach تغییر کرد، promote-coach رو صدا بزن
      if (editRole === "coach" && editingUser.role !== "coach") {
        await fetch("/api/admin/promote-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editingUser._id }),
        });
      } else {
        // فقط role رو آپدیت کن
        await fetch(`/api/admin/user/${editingUser._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: editRole }),
        });
      }

      // آپدیت local state
      setUsers((prev) =>
        prev.map((u) =>
          u._id === editingUser._id ? { ...u, role: editRole } : u,
        ),
      );

      alert("تغییرات با موفقیت ذخیره شد!");
      setShowEditModal(false);
      setEditingUser(null);
    } catch (err) {
      alert("خطا در ذخیره تغییرات");
    }
  };

  return (
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
                          setSelectedUsers(users.map((u) => u._id));
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
                    نقش
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
                    key={user._id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="w-4 h-4 rounded border-white/20"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-xl">
                          {user.avatar || "👤"}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {user.username}
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
                          <span className="text-xs">{user.phone || "—"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Package className="w-4 h-4 text-orange-500" />
                        {user.package || "—"}
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
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs border ${getRoleBadge(user.role)}`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="p-4 text-white/70 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-4 text-white/70 text-sm">
                      {user.lastLogin || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className="text-white font-medium"
                        style={{ fontFamily: "Marbeh, sans-serif" }}
                      >
                        {user.totalPayments || "۰"}
                      </span>
                      <span className="text-white/60 text-xs mr-1">تومان</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
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

        {/* Edit Modal */}
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2
                  className="text-2xl text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ویرایش اطلاعات کاربر
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="text-white/60 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* User Avatar */}
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-4xl">
                    {editingUser.avatar || "👤"}
                  </div>
                  <div>
                    <div className="text-white text-lg font-medium">
                      {editingUser.username}
                    </div>
                    <div className="text-white/60 text-sm">
                      {editingUser.email}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      نام و نام خانوادگی
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser.username}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">
                      ایمیل
                    </label>
                    <input
                      type="email"
                      defaultValue={editingUser.email}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">
                      شماره تلفن
                    </label>
                    <input
                      type="text"
                      defaultValue={editingUser.phone || ""}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">
                      پکیج
                    </label>
                    <select
                      defaultValue={editingUser.package}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      <option value="بسته پایه" className="bg-gray-800">
                        بسته پایه
                      </option>
                      <option value="بسته حرفه‌ای" className="bg-gray-800">
                        بسته حرفه‌ای
                      </option>
                      <option value="بسته VIP" className="bg-gray-800">
                        بسته VIP
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">
                      وضعیت
                    </label>
                    <select
                      defaultValue={editingUser.status}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
                    >
                      <option value="فعال" className="bg-gray-800">
                        فعال
                      </option>
                      <option value="منقضی" className="bg-gray-800">
                        منقضی
                      </option>
                      <option value="مسدود" className="bg-gray-800">
                        مسدود
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">نقش</label>
                    <select
                      value={editRole}
                      onChange={(e) =>
                        setEditRole(
                          e.target.value as "user" | "admin" | "coach",
                        )
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 appearance-none cursor-pointer"
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
                    {editRole === "coach" && editingUser.role !== "coach" && (
                      <p className="text-blue-400 text-xs mt-2">
                        ⚠️ با ذخیره، پروفایل مربی برای این کاربر ساخته می‌شود.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">
                      تاریخ عضویت
                    </label>
                    <input
                      type="text"
                      defaultValue={new Date(
                        editingUser.createdAt,
                      ).toLocaleDateString("fa-IR")}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/60 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">آخرین ورود</div>
                    <div className="text-white font-medium">
                      {editingUser.lastLogin || "—"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-sm mb-1">
                      کل پرداخت‌ها
                    </div>
                    <div
                      className="text-white font-medium"
                      style={{ fontFamily: "Marbeh, sans-serif" }}
                    >
                      {editingUser.totalPayments || "۰"} تومان
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-white mb-2 text-sm">
                    یادداشت‌های ادمین
                  </label>
                  <textarea
                    rows={4}
                    placeholder="یادداشت‌های اختصاصی درباره این کاربر..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/10 flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  ذخیره تغییرات
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
