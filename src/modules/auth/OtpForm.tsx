"use client";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BiDumbbell, BiArrowBack } from "react-icons/bi";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { showAlert } from "@/utils/alert";

function OtpFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Logic for OTP verification can be implemented here.
      // For now, we simulate success and redirect to dashboard.
      setTimeout(() => {
        setIsSubmitting(false);
        showAlert("موفقیت", "ایمیل با موفقیت تایید شد", "success");
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      setIsSubmitting(false);
      console.error(err);
    }
  };

  const handleResendCode = () => {
    setTimeLeft(120);
    showAlert("موفقیت", "کد تایید جدید ارسال شد", "success");
  };

  return (
    <div
      className="min-h-screen bg-linear-to-br font-danaMed from-gray-955 via-gray-900 to-gray-955 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md animate-in fade-in duration-300">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <BiDumbbell className="w-12 h-12 text-orange-500" />
            <span className="font-bold text-3xl text-white" style={{ fontFamily: "Marbeh, sans-serif" }}>
              استارفیت
            </span>
          </Link>
          <p className="text-white/60 text-sm">به جامعه فیتنس ما بپیوندید</p>
        </div>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="animate-in slide-in-from-left-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <Link
                href="/login"
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <BiArrowBack className="w-5 h-5 transform scale-x-[-1]" />
              </Link>
              <div className="flex-1 text-center pr-6">
                <h2 className="text-xl font-bold text-white mb-1">تایید ایمیل</h2>
                <p className="text-white/40 text-[10px] leading-relaxed truncate max-w-[280px]">
                  کد تایید ۵ رقمی به {email || "ایمیل شما"} ارسال گردید
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-2 text-xs font-semibold">کد تایید</label>
                <div className="relative">
                  <HiOutlineShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    maxLength={5}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="• • • • •"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pr-12 pl-4 py-3 text-white placeholder:text-white/20 text-center tracking-[0.5em] focus:outline-none focus:border-orange-500 font-bold text-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-white/60">
                {timeLeft > 0 ? (
                  <span>ارسال مجدد کد پس از {formatTime(timeLeft)}</span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-orange-500 hover:text-orange-400 font-bold cursor-pointer"
                  >
                    ارسال مجدد کد تایید
                  </button>
                )}
                <Link
                  href="/login"
                  className="text-orange-500 hover:text-orange-400 font-bold cursor-pointer"
                >
                  ویرایش ایمیل
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3 rounded-lg transition-colors font-bold text-sm cursor-pointer shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
              >
                {isSubmitting ? "در حال تایید..." : "ورود به حساب کاربری"}
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-6 text-white/60 text-sm">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OtpForm() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">بارگذاری...</div>}>
      <OtpFormContent />
    </Suspense>
  );
}
