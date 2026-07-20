"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import WorkoutPdfDocument from "./WorkoutPdfDocument";
import { Download } from "lucide-react";
import type { DownloadButtonProps } from "@/types/workout";

export default function WorkoutDownloadButton({
  workoutPlan,
  workoutDays,
}: DownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
    }, 0);
  }, []);

  if (!isClient) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/50 to-pink-500/50 text-white/50 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg"
      >
        <Download className="w-4 h-4 animate-pulse" />
        <span>دانلود فایل PDF برنامه</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={
        <WorkoutPdfDocument
          workoutPlan={workoutPlan}
          workoutDays={workoutDays}
        />
      }
      fileName={`workout-plan-${workoutPlan._id}.pdf`}
    >
      {({ loading }) => (
        <span
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 cursor-pointer ${
            loading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          <Download className="w-4 h-4" />
          <span>
            {loading ? "در حال آماده‌سازی..." : "دانلود فایل PDF برنامه"}
          </span>
        </span>
      )}
    </PDFDownloadLink>
  );
}
