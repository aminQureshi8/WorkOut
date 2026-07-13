import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  BookOpen,
  MessageSquare,
  Dumbbell,
  Ticket,
  CreditCard,
  BarChart3,
  Settings,
  UserCog,
  Heart,
  Activity,
  Salad,
  Utensils,
  Trophy,
} from "lucide-react";
import React from "react";
import { SidebarCounts, MenuItem, MenuSection } from "@/types/sidebar";

export function getAdminMenuItems(
  counts: SidebarCounts,
  formatNumber: (num: number) => string
): MenuSection[] {
  return [
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
          badge: counts.users > 0 ? formatNumber(counts.users) : null,
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
          badge: counts.subscriptions > 0 ? formatNumber(counts.subscriptions) : null,
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
          badge: counts.articles > 0 ? formatNumber(counts.articles) : null,
          href: "/admin/articles",
        },
        {
          id: "comments",
          label: "کامنت‌ها",
          icon: MessageSquare,
          badge: counts.comments > 0 ? formatNumber(counts.comments) : null,
          href: "/admin/comments",
        },
        {
          id: "workouts",
          label: "برنامه‌های تمرینی",
          icon: Dumbbell,
          badge: null,
          href: "/admin/workouts",
        },
        {
          id: "personal-records",
          label: "رکورد های شخصی PR",
          icon: Trophy,
          badge: null,
          href: "/admin/pr",
        },
        {
          id: "foods",
          label: "مدیریت غذاها",
          icon: Salad,
          badge: null,
          href: "/admin/foods",
        },
        {
          id: "meal-plans",
          label: "برنامه غذایی",
          icon: Utensils,
          badge: null,
          href: "/admin/meal-plans",
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
}

export function getUserMenuItems(
  counts: SidebarCounts,
  formatNumber: (num: number) => string
): MenuSection[] {
  return [
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
          id: "workout",
          label: "برنامه ی تمرینی",
          icon: Dumbbell,
          badge: null,
          href: "/dashboard/workout",
        },
        {
          id: "profile",
          label: "پروفایل سایت",
          icon: UserCog,
          badge: null,
          href: "/dashboard/profile",
        },
        {
          id: "fitness-profile",
          label: "پروفایل ورزشی",
          icon: Dumbbell,
          badge: null,
          href: "/dashboard/fitness-profile",
        },
        {
          id: "wishlist",
          label: "علاقه‌مندی‌ها",
          icon: Heart,
          badge: counts.wishlist > 0 ? formatNumber(counts.wishlist) : null,
          href: "/dashboard/favorites",
        },
        {
          id: "bmi",
          label: "شاخص توده بدنی (BMI)",
          icon: Activity,
          badge: null,
          href: "/dashboard/bmi",
        },
        {
          id: "nutrition",
          label: "تغذیه و کالری‌شمار",
          icon: Salad,
          badge: null,
          href: "/nutrition",
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
}
