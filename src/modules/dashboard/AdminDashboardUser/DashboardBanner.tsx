import Link from "next/link";
import { Play } from "lucide-react";

interface DashboardBannerProps {
  userName: string;
  todayWorkout: {
    type: string;
    duration: string;
  } | null;
}

export default function DashboardBanner({ userName, todayWorkout }: DashboardBannerProps) {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #4c1d95, #1e1b4b)",
        border: "1px solid rgba(139,92,246,0.3)",
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-purple-500 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-pink-500 blur-2xl"></div>
      </div>
      <div className="relative flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-purple-300 text-sm mb-1">
            سلام، {userName} 👋
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">
            بریم تمرین کنیم!
          </h2>
          <p className="text-gray-400 text-sm">
            تمرین امروز:{" "}
            <span className="text-white font-semibold">
              {todayWorkout
                ? `${todayWorkout.type} (${todayWorkout.duration})`
                : "روز استراحت و ریکاوری"}
            </span>
          </p>
        </div>
        <Link
          href="/dashboard/subscription"
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
          }}
        >
          <Play size={16} />
          شروع تمرین
        </Link>
      </div>
    </div>
  );
}
