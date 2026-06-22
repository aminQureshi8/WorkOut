import { Flame, Activity, Target, Star } from "lucide-react";

const stats = [
  {
    label: "روز تمرین",
    value: "۳۲",
    icon: Flame,
    color: "from-orange-500 to-red-500",
    change: "+۴ این هفته",
  },
  {
    label: "وزن کنونی",
    value: "۷۸",
    unit: "کیلو",
    icon: Activity,
    color: "from-blue-500 to-cyan-500",
    change: "-۲ کیلو",
  },
  {
    label: "هدف هفتگی",
    value: "۵/۷",
    unit: "جلسه",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    change: "۵ جلسه تکمیل",
  },
  {
    label: "امتیاز",
    value: "۱,۲۴۰",
    icon: Star,
    color: "from-yellow-500 to-orange-500",
    change: "+۸۰ این هفته",
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${stat.color}`}
            >
              <Icon size={18} className="text-white" />
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-2xl font-bold text-white">
                {stat.value}
              </span>
              {stat.unit && (
                <span className="text-gray-400 text-sm mb-0.5">
                  {stat.unit}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className="text-green-400 text-xs mt-1">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
