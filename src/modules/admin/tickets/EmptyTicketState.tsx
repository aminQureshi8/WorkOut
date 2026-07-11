import { MessageSquare } from "lucide-react";

export default function EmptyTicketState() {
  return (
    <div className="lg:col-span-7 h-[500px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 p-8 text-center bg-white/5">
      <MessageSquare className="w-16 h-16 mb-4 opacity-20 text-orange-500" />
      <h4 className="font-bold text-lg text-white mb-2">
        تیکتی انتخاب نشده است
      </h4>
      <p className="text-sm">
        برای مشاهده گفتگو و پاسخ به کاربر، یکی از تیکت‌های ستون راست را انتخاب
        کنید.
      </p>
    </div>
  );
}
