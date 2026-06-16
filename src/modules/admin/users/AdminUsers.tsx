"use client";
import Pagination from "@/components/AdminPagination";
import {
  Users,
  Search,
  Mail,
  Phone,
  Calendar,
  Package,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  UserCheck,
} from "lucide-react";
import Swal from "sweetalert2";
import { useCallback, useEffect, useState } from "react";

interface IUser {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "coach";
  status: string;
  package?: string;
  avatar?: string;
  lastLogin?: string;
  totalPayments?: number;
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
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [expiredUsers, setExpiredUsers] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/user?page=${currentPage}`);
      if (!res.ok) throw new Error("خطا در دریافت کاربران");
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPage || 0);
      setTotalUsers(data.totalUsers || 0);
      setActiveUsers(data.activeUsers || 0);
      setExpiredUsers(data.expiredUsers || 0);
      setBlockedUsers(data.blockedUsers || 0);
    } catch (err: any) {
      setError(err.message || "دریافت کاربران با خطا مواجه شد");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      getUsers();
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/search?query=${searchQuery}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        
        const mappedUsers = (data.userFind || []).map((u: any) => {
          let persianStatus = "فعال";
          if (u.status === "blocked") persianStatus = "مسدود";
          else if (u.status === "expired") persianStatus = "منقضی";
          return {
            ...u,
            status: persianStatus,
          };
        });

        setUsers(mappedUsers);
      } catch (err: any) {
        if (err.name !== "AbortError") setError("خطا در جستجو");
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, getUsers]);

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
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditPhone(user.phone || "");

    let dbStatus = "active";
    if (user.status === "مسدود") dbStatus = "blocked";
    else if (user.status === "منقضی") dbStatus = "expired";
    setEditStatus(dbStatus);

    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      if (editRole === "coach" && editingUser.role !== "coach") {
        await fetch("/api/admin/user/promote-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: editingUser._id }),
        });
      }

      const res = await fetch(`/api/admin/user/${editingUser._id}`, {
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
        throw new Error(err.error || "خطا در بروزرسانی مشخصات کاربر");
      }

      Swal.fire({
        title: "موفقیت",
        text: "تغییرات با موفقیت ذخیره شد!",
        icon: "success",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#f97316",
      });

      setShowEditModal(false);
      setEditingUser(null);
      getUsers();
    } catch (err: any) {
      Swal.fire({
        title: "خطا",
        text: err.message || "خطا در ذخیره تغییرات",
        icon: "error",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#f97316",
      });
    }
  };

  const handleToggleBlock = async (user: IUser) => {
    const isBlocked = user.status === "مسدود";
    const title = isBlocked ? "رفع مسدودیت کاربر" : "مسدود کردن کاربر";
    const text = isBlocked
      ? `آیا مطمئن هستید که می‌خواهید دسترسی کاربر «${user.username}» را فعال کنید؟`
      : `آیا مطمئن هستید که می‌خواهید دسترسی کاربر «${user.username}» را مسدود کنید؟`;
    const confirmButtonText = isBlocked ? "بله، فعال شود" : "بله، مسدود شود";
    const confirmButtonColor = isBlocked ? "#10b981" : "#ef4444";

    Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: "انصراف",
      confirmButtonColor,
      cancelButtonColor: "#6b7280",
      background: "#111827",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = isBlocked ? "active" : "blocked";
          const res = await fetch(`/api/admin/user/${user._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "خطا در انجام عملیات");
          }

          Swal.fire({
            title: "موفقیت",
            text: isBlocked ? "کاربر با موفقیت فعال شد." : "کاربر با موفقیت مسدود شد.",
            icon: "success",
            confirmButtonText: "باشه",
            background: "#111827",
            color: "#ffffff",
            confirmButtonColor: "#f97316",
          });

          getUsers();
        } catch (err: any) {
          Swal.fire({
            title: "خطا",
            text: err.message || "انجام عملیات با خطا مواجه شد",
            icon: "error",
            confirmButtonText: "باشه",
            background: "#111827",
            color: "#ffffff",
            confirmButtonColor: "#f97316",
          });
        }
      }
    });
  };

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(num);

  const filteredUsers = users.filter((u) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return u.status === "فعال";
    if (filterStatus === "expired") return u.status === "منقضی";
    if (filterStatus === "blocked") return u.status === "مسدود";
    return true;
  });

  return (
    <div className="overflow-hidden font-danaMed" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h1
            className="text-3xl text-white mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            مدیریت کاربران
          </h1>
          <p className="text-white/60 text-sm">مشاهده و ویرایش دسترسی‌های کاربران سیستم</p>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white ss02">
                  {formatNumber(totalUsers)}
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
                <div className="text-2xl font-bold text-white ss02">
                  {formatNumber(activeUsers)}
                </div>
                <div className="text-white/60 text-xs">کاربران فعال</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white ss02">
                  {formatNumber(expiredUsers)}
                </div>
                <div className="text-white/60 text-xs">کاربران منقضی</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white ss02">
                  {formatNumber(blockedUsers)}
                </div>
                <div className="text-white/60 text-xs">کاربران مسدود</div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="جستجو براساس نام کاربری، ایمیل یا شماره تلفن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/5 *:bg-gray-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm cursor-pointer"
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="active">فعال</option>
                <option value="expired">منقضی</option>
                <option value="blocked">مسدود</option>
              </select>
            </div>
          </div>
        </div>

        
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4 text-right">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/20 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map((u) => u._id));
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
                    پکیج فعال
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
                {isLoading ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-white/50 text-sm">
                      در حال بارگذاری اطلاعات کاربران...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-red-400 text-sm">
                      {error}
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-white/50">
                        <Users className="w-12 h-12 opacity-30" />
                        <p className="text-lg">کاربری پیدا نشد</p>
                        {searchQuery && (
                          <p className="text-sm">
                            نتیجه‌ای برای جستجوی «{searchQuery}» یافت نشد
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white/5 transition-colors text-white"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleUserSelection(user._id)}
                          className="w-4 h-4 rounded border-white/20 cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center text-xl font-bold text-orange-400">
                            {user.avatar || user.username[0]?.toUpperCase() || "👤"}
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">
                              {user.username}
                            </div>
                            <div className="text-white/60 text-xs mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-white/70 text-xs">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/70 text-xs">
                            <Phone className="w-3 h-3" />
                            <span>{user.phone || "—"}</span>
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
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border ${getStatusBadge(user.status)}`}
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
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold border ${getRoleBadge(user.role)}`}
                        >
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="p-4 text-white/70 text-sm ss02">
                        {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="p-4 text-white/70 text-sm ss02">
                        {user.lastLogin || "—"}
                      </td>
                      <td className="p-4">
                        <span
                          className="text-white font-medium"
                          style={{ fontFamily: "Marbeh, sans-serif" }}
                        >
                          {user.totalPayments ? formatNumber(user.totalPayments) : "۰"}
                        </span>
                        <span className="text-white/60 text-xs mr-1">
                          تومان
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                            title="ویرایش"
                          >
                            <Edit className="w-4 h-4 text-white/70" />
                          </button>
                          <button
                            onClick={() => handleToggleBlock(user)}
                            className="w-8 h-8 bg-white/5 hover:bg-red-500/20 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                            title={user.status === "مسدود" ? "رفع مسدودیت" : "مسدود کردن"}
                          >
                            <Ban className={`w-4 h-4 ${user.status === "مسدود" ? "text-green-400" : "text-red-400"}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-white/60 text-sm ss02">
              نمایش {(currentPage - 1) * 6 + 1} تا{" "}
              {Math.min(currentPage * 6, totalUsers)} از{" "}
              {totalUsers.toLocaleString("fa-IR")} کاربر
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>

        
        {selectedUsers.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-orange-500 backdrop-blur-lg border border-orange-400 rounded-xl p-4 shadow-2xl z-50">
            <div className="flex items-center gap-4">
              <span className="text-white font-medium text-sm">
                {formatNumber(selectedUsers.length)} کاربر انتخاب شده
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUsers([])}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors text-xs cursor-pointer"
                >
                  لغو انتخاب‌ها
                </button>
              </div>
            </div>
          </div>
        )}

        
        {showEditModal && editingUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2
                  className="text-2xl text-white font-bold"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ویرایش اطلاعات کاربر
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="text-white/60 hover:text-white transition-colors text-2xl cursor-pointer"
                >
                  ✕
                </button>
              </div>

              
              <div className="p-6 space-y-6">
                
                <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                  <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center text-4xl font-bold text-orange-400">
                    {editingUser.avatar || editingUser.username[0]?.toUpperCase() || "👤"}
                  </div>
                  <div>
                    <div className="text-white text-lg font-bold">
                      {editingUser.username}
                    </div>
                    <div className="text-white/60 text-sm">
                      {editingUser.email}
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
                      value={editingUser.package || "—"}
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
                          e.target.value as "user" | "admin" | "coach",
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
                    {editRole === "coach" && editingUser.role !== "coach" && (
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
                      value={new Date(
                        editingUser.createdAt,
                      ).toLocaleDateString("fa-IR")}
                      disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/55 cursor-not-allowed text-sm ss02"
                    />
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-xs mb-1">آخرین ورود</div>
                    <div className="text-white font-medium text-sm ss02">
                      {editingUser.lastLogin || "—"}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-white/60 text-xs mb-1">
                      کل پرداخت‌ها
                    </div>
                    <div
                      className="text-white font-medium text-sm"
                      style={{ fontFamily: "Marbeh, sans-serif" }}
                    >
                      {editingUser.totalPayments ? formatNumber(editingUser.totalPayments) : "۰"} تومان
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
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors cursor-pointer text-sm"
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
