"use client";
import React, { memo, useMemo } from "react";
import { Package as PackageIcon, Users, DollarSign, TrendingUp, Award } from "lucide-react";
import { PackageStatsProps, PackageStats as IPackageStats } from "@/types/package";

const PackageStats = memo(function PackageStats({
  packages,
  formatNumber,
}: PackageStatsProps) {
  const stats = useMemo<IPackageStats>(() => {
    const totalUsers = packages.reduce(
      (sum, pkg) => sum + (pkg.studentCount || 0),
      0,
    );
    const totalRevenue = packages.reduce(
      (sum, pkg) => sum + (pkg.price?.monthly || 0) * (pkg.studentCount || 0),
      0,
    );
    const activeCount = packages.filter((p) => p.isActive).length;
    const mostPopularPackage = packages.find((p) => p.isPopular) || packages[0];

    return {
      totalCount: packages.length,
      activeCount,
      totalUsers,
      totalRevenue,
      mostPopularName: mostPopularPackage ? mostPopularPackage.name : "—",
      mostPopularCount: mostPopularPackage
        ? mostPopularPackage.studentCount || 0
        : 0,
    };
  }, [packages]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">کل پکیج‌ها</div>
          <PackageIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-3xl text-white mb-1 font-morabbaReg">
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
        <div className="text-3xl text-white mb-1 font-morabbaReg">
          {formatNumber(stats.totalUsers)}
        </div>
        <div className="text-purple-400 text-sm">در تمام پکیج‌ها</div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white/60 text-sm">درآمد کل تخمینی</div>
          <DollarSign className="w-5 h-5 text-orange-400" />
        </div>
        <div className="text-2xl text-white mb-1 font-morabbaReg">
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
        <div className="text-xl text-white mb-1 truncate font-morabbaReg">
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
