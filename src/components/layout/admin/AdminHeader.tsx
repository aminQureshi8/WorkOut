"use client";
import { Bell, Menu, Settings } from "lucide-react";
import { useSidebar } from "./SidebarContext";

export default function AdminHeader({ username, role }) {
  const { onToggle } = useSidebar();

  return (
    <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggle}
              className="lg:hidden w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
            <div>
              <h1
                className="text-xl font-bold text-white"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                داشبورد
              </h1>
              <p className="text-white/50 text-xs">خوش آمدید مربی علی محمدی</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-white/70 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-xs flex items-center justify-center">
                ۳
              </span>
            </button>
            <button className="text-white/70 hover:text-white transition-colors hidden md:block">
              <Settings className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-white/10">
              <div className="text-left">
                <div className="text-white text-sm">{username}</div>
                <div className="text-white/50 text-xs">
                  {role === "admin" ? "مدیر سیستم" : "مربی"}
                </div>
              </div>
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                ع
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
