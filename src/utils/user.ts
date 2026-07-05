export const getStatusBadge = (status: string) => {
  switch (status) {
    case "فعال":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "منقضی":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "مسدود":
      return "bg-red-500/20 text-red-400 border-red-500/50";
    default:
      return "bg-white/20 text-white/60 border-white/30";
  }
};

export const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-500/20 text-purple-400 border-purple-500/50";
    case "coach":
      return "bg-blue-500/20 text-blue-400 border-blue-500/50";
    default:
      return "bg-white/10 text-white/60 border-white/20";
  }
};

export const getRoleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "ادمین";
    case "coach":
      return "مربی";
    default:
      return "کاربر";
  }
};
