import React from "react";
import { MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import type { TicketStatsProps } from "@/types/ticket";

const TicketStats: React.FC<TicketStatsProps> = ({ stats, formatNumber }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.totalCount)}
          </div>
          <div className="text-white/60 text-xs">کل تیکت‌ها</div>
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
          <div className="text-white/60 text-xs">در انتظار پاسخ</div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.answeredCount)}
          </div>
          <div className="text-white/60 text-xs">پاسخ داده شده</div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
          <XCircle className="w-6 h-6 text-white/40" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white ss02">
            {formatNumber(stats.closedCount)}
          </div>
          <div className="text-white/60 text-xs">بسته شده</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TicketStats);
