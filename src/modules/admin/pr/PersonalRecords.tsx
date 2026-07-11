import React from "react";
import { Trophy } from "lucide-react";
import UserSearchBar from "./UserSearchBar";
import PRChart from "./PRChart";

export default function PersonalRecords() {
  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1
                className="text-3xl text-white font-bold"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                رکوردهای شخصی (Personal Records - PR)
              </h1>
              <p className="text-white/60">
                بیشترین وزنه‌هایی که تاکنون جابه‌جا کرده‌اید را ثبت و روند رشد
                خود را تحلیل کنید
              </p>
            </div>
          </div>

          <UserSearchBar />
        </div>

        <PRChart />
      </div>
    </div>
  );
}
