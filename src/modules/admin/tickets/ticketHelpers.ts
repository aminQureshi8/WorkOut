import type { IClientTicket as ITicket } from "@/types/ticket";

export const getStatusBadge = (status: ITicket["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
    case "answered":
      return "bg-green-500/20 text-green-400 border-green-500/50";
    case "closed":
      return "bg-white/10 text-white/50 border-white/20";
    default:
      return "bg-white/10 text-white/55 border-white/20";
  }
};

export const getStatusLabel = (status: ITicket["status"]) => {
  switch (status) {
    case "pending":
      return "در انتظار پاسخ";
    case "answered":
      return "پاسخ داده شده";
    case "closed":
      return "بسته شده";
    default:
      return status;
  }
};

export const getCategoryBadge = (category: ITicket["category"]) => {
  switch (category) {
    case "workout":
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case "nutrition":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
    case "form_check":
      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
    case "injury":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case "technical":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    default:
      return "bg-white/5 text-white/60 border-white/10";
  }
};

export const getCategoryLabel = (category: ITicket["category"]) => {
  switch (category) {
    case "workout":
      return "سوال تمرینی";
    case "nutrition":
      return "سوال تغذیه";
    case "form_check":
      return "بررسی فرم حرکت";
    case "injury":
      return "درد یا آسیب";
    case "technical":
      return "مشکل سایت";
    default:
      return category;
  }
};



export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fa-IR").format(num);
};
