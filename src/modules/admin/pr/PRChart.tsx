"use client";

import React, { useState } from "react";
import useSWR from "swr";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp, Loader2, Award, User } from "lucide-react";
import type { PRChartProps, PRRecordItem } from "@/types/pr";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PRChart({ userId }: PRChartProps) {
  const [selectedTest, setSelectedTest] = useState<string>("all");

  const { data: prData, isLoading: isLoadingPR } = useSWR(
    userId ? `/api/admin/user/pr?userId=${userId}` : null,
    fetcher,
  );

  const { data: userData } = useSWR(
    userId ? `/api/admin/user/${userId}` : null,
    fetcher,
  );

  console.log(prData);
  

  const records: PRRecordItem[] = prData?.records || [];
  const userInfo = userData?.user;

  const availableTests = Array.from(
    new Set(records.map((r) => r.testName).filter(Boolean)),
  );

  const filteredRecords = records.filter((r) =>
    selectedTest === "all" ? true : r.testName === selectedTest,
  );

  const sortedRecords = [...filteredRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const labels = sortedRecords.map((r) => {
    try {
      return new Date(r.date).toLocaleDateString("fa-IR");
    } catch (e) {
      return r.date;
    }
  });

  const chartValues = sortedRecords.map((r) => r.value);
  const currentUnit = sortedRecords[0]?.unit || "";

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: {
            family: "Vazirmatn, Tahoma, sans-serif",
            size: 13,
          },
        },
      },
      tooltip: {
        rtl: true,
        titleFont: { family: "Vazirmatn, Tahoma" },
        bodyFont: { family: "Vazirmatn, Tahoma" },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: { family: "Vazirmatn, Tahoma" },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.6)",
          font: { family: "Vazirmatn, Tahoma" },
        },
      },
    },
  };

  const chartDataConfig: ChartData<"line"> = {
    labels,
    datasets: [
      {
        fill: true,
        label: `مقدار رکورد (${currentUnit})`,
        data: chartValues,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.15)",
        tension: 0.35,
        pointBackgroundColor: "rgb(236, 72, 153)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointRadius: 5,
      },
    ],
  };

  if (!userId) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center text-white/40 flex flex-col items-center justify-center">
        <User className="w-12 h-12 text-white/20 mb-3" />
        <p className="text-base font-semibold text-white/70 mb-1">
          هیچ کاربری انتخاب نشده است
        </p>
        <p className="text-xs text-white/40">
          لطفاً از نوار جستجو بالا کاربر مورد نظر خود را جستجو و انتخاب کنید.
        </p>
      </div>
    );
  }

  if (isLoadingPR) {
    return (
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-16 text-center text-white/60 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span>در حال بارگذاری رکوردهای کاربر...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              روند پیشرفت {userInfo?.fullName || userInfo?.username || "کاربر"}
            </h2>
            {userInfo && (
              <p className="text-xs text-white/50 mt-1">
                @{userInfo.username} | {userInfo.phone || userInfo.email}
              </p>
            )}
          </div>

          {availableTests.length > 0 && (
            <div className="w-full sm:w-auto">
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full sm:w-auto bg-gray-900 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-purple-500/50"
              >
                <option value="all">همه حرکت‌ها و تست‌ها</option>
                {availableTests.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {records.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-white/10 rounded-xl text-white/40 flex flex-col items-center justify-center">
            <Award className="w-10 h-10 text-white/20 mb-2" />
            <p className="text-sm">هیچ رکوردی برای این کاربر ثبت نشده است.</p>
          </div>
        ) : (
          <div className="h-80 w-full relative">
            <Line options={options} data={chartDataConfig} />
          </div>
        )}
      </div>

      {records.length > 0 && (
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
      )}
    </div>
  );
}
