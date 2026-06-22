"use client";
import React, { memo } from "react";
import { Package, Users, DollarSign, TrendingUp, Award } from "lucide-react";
import { PackageStatsProps } from "@/types/package";

const PackageStats = memo(function PackageStats({
  stats,
  formatNumber,
}: PackageStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">کل پکیج‌ها</div>
          <Package className="w-5 h-5 text-blue-400" />
        </div>
        <div
          className="text-3xl text-white mb-1"
          style={{ fontFamily: "Marbeh, sans-serif" }}
        >
          {formatNumber(stats.totalCount)}
        </div>
        <div className="text-green-400 text-sm">
          {formatNumber(stats.activeCount)} پکیج فعال
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">کل کاربران</div>
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div
          className="text-3xl text-white mb-1"
          style={{ fontFamily: "Marbeh, sans-serif" }}
        >
          {formatNumber(stats.totalUsers)}
        </div>
        <div className="text-purple-400 text-sm">در تمام پکیج‌ها</div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">درآمد کل تخمینی</div>
          <DollarSign className="w-5 h-5 text-orange-400" />
        </div>
        <div
          className="text-2xl text-white mb-1"
          style={{ fontFamily: "Marbeh, sans-serif" }}
        >
          {formatNumber(stats.totalRevenue)} تومان
        </div>
        <div className="text-orange-400 text-sm flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          ماهانه
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">محبوب‌ترین بسته</div>
          <Award className="w-5 h-5 text-green-400" />
        </div>
        <div
          className="text-xl text-white mb-1 truncate"
          style={{ fontFamily: "Marbeh, sans-serif" }}
        >
          {stats.mostPopularName || "—"}
        </div>
        <div className="text-green-400 text-sm">
          {formatNumber(stats.mostPopularCount)} کاربر فعال
        </div>
      </div>
    </div>
  );
});

export default PackageStats;
