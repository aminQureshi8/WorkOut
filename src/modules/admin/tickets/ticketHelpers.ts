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

export const getPriorityBadge = (priority: ITicket["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case "medium":
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case "low":
      return "bg-white/5 text-white/60 border-white/10";
    default:
      return "bg-white/5 text-white/60 border-white/10";
  }
};

export const getPriorityLabel = (priority: ITicket["priority"]) => {
  switch (priority) {
    case "high":
      return "فوری";
    case "medium":
      return "متوسط";
    case "low":
      return "کم اهمیت";
    default:
      return priority;
  }
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("fa-IR").format(num);
};
