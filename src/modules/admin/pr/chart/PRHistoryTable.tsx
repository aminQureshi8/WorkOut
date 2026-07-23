"use client";

import React from "react";
import { Award } from "lucide-react";
import type { PRHistoryTableProps } from "@/types/pr";

export default function PRHistoryTable({
  sortedRecords,
}: PRHistoryTableProps) {
  if (!sortedRecords || sortedRecords.length === 0) return null;

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-400" />
        تاریخچه رکوردهای ثبت‌شده
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-white/60 text-xs">
              <th className="p-3 font-semibold">تست / حرکت</th>
              <th className="p-3 font-semibold">دسته‌بندی</th>
              <th className="p-3 font-semibold">مقدار</th>
              <th className="p-3 font-semibold">واحد</th>
              <th className="p-3 font-semibold">تاریخ</th>
              <th className="p-3 font-semibold">توضیحات</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((rec) => (
              <tr
                key={rec._id}
                className="border-b border-white/5 hover:bg-white/5 text-white text-xs transition-colors"
              >
                <td className="p-3 font-medium text-purple-300">
                  {rec.testName}
                </td>
                <td className="p-3 text-white/70">{rec.category || "-"}</td>
                <td className="p-3 font-bold text-white">{rec.value}</td>
                <td className="p-3 text-white/60">{rec.unit}</td>
                <td className="p-3 text-white/80">
                  {new Date(rec.date).toLocaleDateString("fa-IR")}
                </td>
                <td className="p-3 text-white/50">{rec.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
