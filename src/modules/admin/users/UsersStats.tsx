"use client";
import React from "react";
import { Users, UserCheck, Calendar, Ban } from "lucide-react";

interface UsersStatsProps {
  totalUsers: number;
  activeUsers: number;
  expiredUsers: number;
  blockedUsers: number;
}

export default function UsersStats({
  totalUsers,
  activeUsers,
  expiredUsers,
  blockedUsers,
}: UsersStatsProps) {
  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(num);

  return (
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
  );
}
