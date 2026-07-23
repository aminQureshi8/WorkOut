"use client";

import { useState } from "react";
import { Trophy } from "lucide-react";
import UserSearchBar from "./UserSearchBar";
import PRChart from "./chart/PRChart";
import CreatePRModal from "./CreatePRModal";
import CreateMetricModal from "./CreateMetricModal";
import type { PersonalRecordsProps } from "@/types/pr";

export default function PersonalRecords({ userId }: PersonalRecordsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8" dir="rtl">
      <div className="container mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl text-white font-bold font-morabbaReg">
                رکوردهای شخصی
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            <UserSearchBar />
            <button
              onClick={() => setIsMetricModalOpen(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 text-sm whitespace-nowrap cursor-pointer"
            >
              تعریف متس جدید
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/10 text-sm whitespace-nowrap cursor-pointer"
            >
              ثبت رکورد جدید
            </button>
          </div>
        </div>

        <PRChart userId={userId} />

        <CreatePRModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
        />

        <CreateMetricModal
          isOpen={isMetricModalOpen}
          onClose={() => setIsMetricModalOpen(false)}
        />
      </div>
    </div>
  );
}
