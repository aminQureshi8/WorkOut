"use client";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BiDumbbell, BiArrowBack } from "react-icons/bi";
import { signIn } from "next-auth/react";
import { showAlert } from "@/utils/alert";

function OtpFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") || searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleOtpChange = (index: number, value: string) => {
    const val = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    if (val && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);

    if (!pastedData) return;

    const newOtp = ["", "", "", "", ""];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    const targetIndex = Math.min(pastedData.length, 4);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length < 5) {
      showAlert("خطا", "لطفاً کد ۵ رقمی را کامل وارد کنید", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const pendingDataStr =
        typeof window !== "undefined"
          ? sessionStorage.getItem("pendingRegister")
          : null;
      const pendingData = pendingDataStr ? JSON.parse(pendingDataStr) : null;

      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          code,
          username: pendingData?.username,
          password: pendingData?.password,
        }),
      });

      const resData = await res.json();
      setIsSubmitting(false);

      if (!res.ok) {
        showAlert(
          "خطا",
          resData.message || "کد تایید اشتباه یا منقضی شده است",
          "error",
        );
        return;
      }

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("pendingRegister");
      }

      const signInRes = await signIn("credentials", {
        phone,
        isOtpLogin: "true",
        redirect: false,
      });

      if (signInRes?.error) {
        showAlert("خطا", "ایجاد نشست کاربر با مشکل مواجه شد", "error");
        return;
      }

      showAlert("موفقیت", "تایید با موفقیت انجام شد", "success");
      window.location.href = "/dashboard";
    } catch {
      setIsSubmitting(false);
      showAlert("خطا", "خطایی در تایید کد رخ داد", "error");
    }
  };

  const handleResendCode = async () => {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const resData = await res.json();
      if (res.ok) {
        setTimeLeft(120);
        setOtp(["", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        showAlert("موفقیت", "کد تایید جدید ارسال شد", "success");
      } else {
        showAlert("خطا", resData.message || "خطا در ارسال کد", "error");
      }
    } catch {
      showAlert("خطا", "خطایی در ارتباط با سرور رخ داد", "error");
    }
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
            <span
              className="font-bold text-3xl text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
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
                <h2 className="text-xl font-bold text-white mb-1">
                  تایید شماره تلفن
                </h2>
                <p className="text-white/40 text-[10px] leading-relaxed truncate max-w-[280px]">
                  کد تایید ۵ رقمی به {phone || "شماره تلفن شما"} ارسال گردید
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-white/80 mb-4 text-xs font-semibold text-center">
                  کد تایید ۵ رقمی را وارد کنید
                </label>
                <div className="flex justify-center gap-3" dir="ltr">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-white font-bold text-xl focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-colors"
                    />
                  ))}
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
                  ویرایش شماره تلفن
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-955 flex items-center justify-center text-white">
          بارگذاری...
        </div>
      }
    >
      <OtpFormContent />
    </Suspense>
  );
}
