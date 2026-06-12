"use client";
import { useState } from "react";
import {
  Dumbbell,
  Users,
  Calendar,
  Settings,
  LayoutDashboard,
  Package,
  UserCog,
  BarChart3,
  Ticket,
  BookOpen,
  CreditCard,
  ChevronLeft,
  Menu,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useSidebar } from "./SidebarContext";
import Link from "next/link";

export default function AdminSidebar({ isAdmin = false }) {
  const { isOpen, onToggle } = useSidebar();
  const [activePage, setActivePage] = useState("dashboard");

  const adminMenuItems = [
    {
      title: "منوی اصلی",
      items: [
        {
          id: "dashboard",
          label: "داشبورد",
          icon: LayoutDashboard,
          badge: null,
          href: "/admin",
        },
        {
          id: "users",
          label: "کاربران",
          icon: Users,
          badge: "۲,۵۴۳",
          href: "/admin/users",
        },
        {
          id: "packages",
          label: "پکیج‌ها",
          icon: Package,
          badge: null,
          href: "/admin/packages",
        },
        {
          id: "subscriptions",
          label: "اشتراک‌ها",
          icon: Calendar,
          badge: "۱۲۳",
          href: "/admin/subscriptions",
        },
      ],
    },
    {
      title: "محتوا",
      items: [
        {
          id: "articles",
          label: "مقالات",
          icon: BookOpen,
          badge: "۱۵۶",
          href: "/admin/articles",
        },
        {
          id: "workouts",
          label: "برنامه‌های تمرینی",
          icon: Dumbbell,
          badge: null,
          href: "/admin/workouts",
        },
        {
          id: "tickets",
          label: "تیکت‌ها",
          icon: Ticket,
          badge: "۴۸",
          href: "/admin/tickets",
        },
      ],
    },
    {
      title: "مالی",
      items: [
        {
          id: "payments",
          label: "پرداخت‌ها",
          icon: CreditCard,
          badge: null,
          href: "/admin/payments",
        },
        {
          id: "reports",
          label: "گزارش‌ها",
          icon: BarChart3,
          badge: null,
          href: "/admin/reports",
        },
      ],
    },
    {
      title: "تنظیمات",
      items: [
        {
          id: "settings",
          label: "تنظیمات سایت",
          icon: Settings,
          badge: null,
          href: "/admin/settings",
        },
        {
          id: "admins",
          label: "مدیران",
          icon: UserCog,
          badge: "۳",
          href: "/admin/admins",
        },
      ],
    },
  ];

  const userMenuItems = [
    {
      title: "منوی کاربر",
      items: [
        {
          id: "dashboard",
          label: "داشبورد",
          icon: LayoutDashboard,
          badge: null,
          href: "/dashboard",
        },
        {
          id: "subscription",
          label: "اشتراک من",
          icon: CreditCard,
          badge: null,
          href: "/dashboard/subscription",
        },
        {
          id: "profile",
          label: "پروفایل",
          icon: UserCog,
          badge: null,
          href: "/dashboard/profile",
        },
        {
          id: "tickets",
          label: "تیکت‌ها",
          icon: Ticket,
          badge: null,
          href: "/dashboard/tickets",
        },
      ],
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const sidebarStyle = isAdmin
    ? "bg-black/40 border-l border-white/10"
    : "bg-[linear-gradient(180deg,#0f172a_0%,#1e1b4b_100%)] border-l border-purple-500/20";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 h-full backdrop-blur-xl transition-all duration-300 z-50
          w-64
          ${sidebarStyle}
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
          ${isOpen ? "md:w-64" : "md:w-18"}
        `}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {isOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-orange-500" />
                <span className="font-bold text-lg text-white">فیت‌کوچ</span>
              </Link>
              <button
                onClick={onToggle}
                className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white/70" />
              </button>
            </>
          ) : (
            <button onClick={onToggle} className="w-full flex justify-center">
              <Menu className="w-6 h-6 text-white/70" />
            </button>
          )}
        </div>

        <div className="h-[calc(100vh-8rem)] overflow-y-auto py-4 px-3">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {isOpen && (
                <h3 className="text-white/50 text-xs font-medium mb-3 px-3">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActivePage(item.id);
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 768
                      ) {
                        onToggle();
                      }
                    }}
                    style={
                      activePage === item.id &&
                      item.id === "dashboard" &&
                      !isAdmin
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.3))",
                            border: "1px solid rgba(124,58,237,0.4)",
                          }
                        : {}
                    }
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                      activePage === item.id
                        ? item.id === "dashboard" && !isAdmin
                          ? "text-white"
                          : "bg-orange-500 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
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
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-black/20">
          <Link
            href={isAdmin ? "/admin/help" : "/dashboard/help"}
            className="w-full flex items-center gap-3 px-3 py-3 text-white/70 hover:bg-white/5 hover:text-white rounded-lg transition-all"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="flex-1 text-right text-sm">
                راهنما و پشتیبانی
              </span>
            )}
          </Link>
          <Link
            href="/logout"
            className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-1"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="flex-1 text-right text-sm">خروج</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
