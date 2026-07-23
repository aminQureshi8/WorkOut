"use client";
import React, { memo } from "react";
import { MessageSquare, CheckCircle, Clock } from "lucide-react";
import type { CommentStatsProps } from "@/types/comment";

const CommentStats = memo(function CommentStats({ stats, formatNumber }: CommentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.totalCount)}
          </div>
          <div className="text-white/60 text-sm">کل دیدگاه‌ها</div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.approvedCount)}
          </div>
          <div className="text-white/60 text-sm">تایید شده</div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center animate-pulse">
          <Clock className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.pendingCount)}
          </div>
          <div className="text-white/60 text-sm">در انتظار تایید</div>
        </div>
      </div>
    </div>
  );
});

export default CommentStats;
