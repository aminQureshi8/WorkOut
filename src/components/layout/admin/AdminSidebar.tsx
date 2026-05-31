"use client";
import { useState } from "react";
import {
  Dumbbell,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  Search,
  MoreVertical,
  Clock,
  LayoutDashboard,
  Package,
  UserCog,
  BarChart3,
  Ticket,
  BookOpen,
  CreditCard,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function AdminSidebar() {
  const { isOpen, onToggle } = useSidebar(); // ← از context بگیر
  const [activePage, setActivePage] = useState("dashboard");

  const menuItems = [
    {
      title: "منوی اصلی",
      items: [
        {
          id: "dashboard",
          label: "داشبورد",
          icon: LayoutDashboard,
          badge: null,
        },
        { id: "users", label: "کاربران", icon: Users, badge: "۲,۵۴۳" },
        { id: "packages", label: "پکیج‌ها", icon: Package, badge: null },
        {
          id: "subscriptions",
          label: "اشتراک‌ها",
          icon: Calendar,
          badge: "۱۲۳",
        },
      ],
    },
    {
      title: "محتوا",
      items: [
        { id: "articles", label: "مقالات", icon: BookOpen, badge: "۱۵۶" },
        {
          id: "workouts",
          label: "برنامه‌های تمرینی",
          icon: Dumbbell,
          badge: null,
        },
        { id: "tickets", label: "تیکت‌ها", icon: Ticket, badge: "۴۸" },
      ],
    },
    {
      title: "مالی",
      items: [
        { id: "payments", label: "پرداخت‌ها", icon: CreditCard, badge: null },
        { id: "reports", label: "گزارش‌ها", icon: BarChart3, badge: null },
      ],
    },
    {
      title: "تنظیمات",
      items: [
        { id: "settings", label: "تنظیمات سایت", icon: Settings, badge: null },
        { id: "admins", label: "مدیران", icon: UserCog, badge: "۳" },
      ],
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "محمد رضایی",
      package: "بسته حرفه‌ای",
      status: "فعال",
      joinDate: "۱۵ اردیبهشت",
    },
    {
      id: 2,
      name: "سارا احمدی",
      package: "بسته VIP",
      status: "فعال",
      joinDate: "۱۲ اردیبهشت",
    },
    {
      id: 3,
      name: "علی کریمی",
      package: "بسته پایه",
      status: "منقضی",
      joinDate: "۸ فروردین",
    },
    {
      id: 4,
      name: "فاطمه نوری",
      package: "بسته حرفه‌ای",
      status: "فعال",
      joinDate: "۵ اردیبهشت",
    },
    {
      id: 5,
      name: "حسین محمدی",
      package: "بسته VIP",
      status: "فعال",
      joinDate: "۳ اردیبهشت",
    },
  ];

  const recentTickets = [
    {
      id: 101,
      user: "محمد رضایی",
      subject: "سوال درباره برنامه تمرینی",
      status: "در حال بررسی",
      time: "۲ ساعت پیش",
    },
    {
      id: 102,
      user: "سارا احمدی",
      subject: "مشکل در دانلود ویدیو",
      status: "پاسخ داده شده",
      time: "۵ ساعت پیش",
    },
    {
      id: 103,
      user: "علی کریمی",
      subject: "درخواست تمدید اشتراک",
      status: "جدید",
      time: "۱ روز پیش",
    },
  ];

  return (
    <aside
      className={`fixed top-0 right-0 h-full bg-black/40 backdrop-blur-xl border-l border-white/10 transition-all duration-300 z-50 ${
        isOpen ? "w-64" : "w-20" // ← sidebarOpen → isOpen
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {isOpen ? ( // ← sidebarOpen → isOpen
          <>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-lg text-white">فیت‌کوچ</span>
            </div>
            <button
              onClick={onToggle} // ← setSidebarOpen(false) → onToggle
              className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white/70" />
            </button>
          </>
        ) : (
          <button onClick={onToggle} className="w-full flex justify-center">
            {" "}
            {/* ← setSidebarOpen(true) → onToggle */}
            <Menu className="w-6 h-6 text-white/70" />
          </button>
        )}
      </div>

      {/* Sidebar Menu */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto py-4 px-3">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6">
            {isOpen && ( // ← sidebarOpen → isOpen
              <h3 className="text-white/50 text-xs font-medium mb-3 px-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    activePage === item.id
                      ? "bg-orange-500 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && ( // ← sidebarOpen → isOpen
                    <>
                      <span className="flex-1 text-right text-sm">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            activePage === item.id
                              ? "bg-white/20 text-white"
                              : "bg-white/10 text-white/60"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-black/20">
        <button className="w-full flex items-center gap-3 px-3 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-all">
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="flex-1 text-right text-sm">راهنما و پشتیبانی</span>
          )}{" "}
          {/* ← sidebarOpen → isOpen */}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <span className="flex-1 text-right text-sm">خروج</span>
          )}{" "}
          {/* ← sidebarOpen → isOpen */}
        </button>
      </div>
    </aside>
  );
}
