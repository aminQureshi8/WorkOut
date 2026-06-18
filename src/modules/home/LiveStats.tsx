import { BiTrendingUp, BiUser } from "react-icons/bi";

interface LiveStatsProps {
  stats: {
    todayUsersCount: string;
    trendText: string;
  };
}

export default function LiveStats({ stats }: LiveStatsProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="bg-linear-to-r from-orange-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              فیت‌کوچ در یک نگاه
            </h2>
            <p className="text-white/70">آمار زنده از عملکرد پلتفرم</p>
          </div>
          <div className="flex justify-center">
            <div className="max-w-xs w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiUser className="w-8 h-8 text-blue-400" />
              </div>
              <div
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                {stats.todayUsersCount}
              </div>
              <div className="text-white/60 text-sm">کاربر امروز</div>
              <div className="text-green-400 text-xs mt-2 flex items-center justify-center gap-1">
                <BiTrendingUp className="w-3 h-3" />
                {stats.trendText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
