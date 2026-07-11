"use client";

import React from "react";
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
import { TrendingUp } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PRChart() {
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

  const labels = ["دی", "بهمن", "اسفند", "فروردین", "اردیبهشت", "خرداد"];

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        fill: true,
        label: "سرعت (کیلومتر بر ساعت)",
        data: [12, 13.5, 14, 15, 15.5, 16.5],
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

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl text-white font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          روند پیشرفت سرعت کاربر
        </h2>
      </div>

      <div className="h-80 w-full relative">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
