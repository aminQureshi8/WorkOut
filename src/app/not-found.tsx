"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowRight, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12">
      {/* Decorative Floating Ambient Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "2s" }} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg mx-auto text-center">
        {/* Glassmorphic Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/50">
          
          {/* Animated Dumbbell Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/10 border border-orange-500/30 mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
            <Dumbbell className="w-12 h-12 text-orange-500 animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          {/* Huge Glowing 404 Text */}
          <h1 className="font-morabbaReg text-7xl md:text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 drop-shadow-[0_5px_15px_rgba(249,115,22,0.3)] mb-4 select-none">
            404
          </h1>

          {/* Title */}
          <h2 className="font-morabbaReg text-2xl md:text-3xl font-bold text-white mb-4">
            از مسیر تمرین خارج شدی قهرمان! 🏋️‍♂️
          </h2>

          {/* Description */}
          <p className="font-danaMed text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-md mx-auto">
            صفحه‌ای که به دنبال آن بودید پیدا نشد. شاید وزنه بیش از حد سنگین بوده یا مسیر حرکت را اشتباه رفته‌اید! نگران نباشید، با دکمه‌های زیر می‌توانید به مسیر اصلی برگردید.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center font-danaDemiBold">
            {/* Go to Home Page Button */}
            <Link
              href="/"
              id="notfound-home-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl shadow-lg shadow-orange-950/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border border-orange-500/20"
            >
              <Home className="w-5 h-5" />
              <span>بازگشت به خانه</span>
            </Link>

            {/* Go Back Button */}
            <button
              onClick={() => router.back()}
              id="notfound-back-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-200 hover:text-white rounded-xl border border-gray-700/50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
              <span>صفحه قبلی</span>
            </button>
          </div>
        </div>

        {/* Footer info inside the 404 wrapper */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs font-danaLight text-gray-500">
          <HelpCircle className="w-4 h-4" />
          <span>پشتیبانی سیستم ورزشی و تناسب اندام</span>
        </div>
      </div>
    </div>
  );
}
