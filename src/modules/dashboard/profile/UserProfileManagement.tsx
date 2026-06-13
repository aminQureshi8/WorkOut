"use client";

import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle, Save } from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

export default function UserProfileManagement() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Show/Hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      if (data.user) {
        setProfile(data.user);
        setUsername(data.user.username || "");
        setFullName(data.user.fullName || "");
        setPhone(data.user.phone || "");
        setEmail(data.user.email || "");
      }
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "خطا",
        text: "بارگذاری اطلاعات حساب کاربری با خطا مواجه شد.",
        icon: "error",
        confirmButtonText: "تلاش مجدد",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      Swal.fire({
        title: "خطا",
        text: "نام کاربری نمی‌تواند خالی باشد.",
        icon: "warning",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    if (username.length < 3) {
      Swal.fire({
        title: "خطا",
        text: "نام کاربری باید حداقل ۳ کاراکتر باشد.",
        icon: "warning",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      Swal.fire({
        title: "خطا",
        text: "نام کاربری فقط می‌تواند شامل حروف انگلیسی، اعداد و خط تیره (_) باشد.",
        icon: "warning",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    if (password && password !== confirmPassword) {
      Swal.fire({
        title: "خطا",
        text: "رمز عبور جدید و تکرار آن یکسان نیستند.",
        icon: "warning",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    if (password && password.length < 6) {
      Swal.fire({
        title: "خطا",
        text: "رمز عبور باید حداقل ۶ کاراکتر باشد.",
        icon: "warning",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName,
          phone,
          email,
          password: password || undefined
        })
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data.user);
        setPassword("");
        setConfirmPassword("");
        router.refresh();
        Swal.fire({
          title: "موفقیت‌آمیز",
          text: "اطلاعات حساب کاربری شما با موفقیت بروزرسانی شد.",
          icon: "success",
          confirmButtonText: "باشه",
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#7c3aed"
        });
      } else {
        Swal.fire({
          title: "خطا",
          text: data.message || "بروزرسانی اطلاعات کاربری ناموفق بود.",
          icon: "error",
          confirmButtonText: "باشه",
          background: "#111827",
          color: "#ffffff",
          confirmButtonColor: "#7c3aed"
        });
      }
    } catch (e) {
      console.error(e);
      Swal.fire({
        title: "خطا",
        text: "خطا در ارتباط با سرور رخ داده است.",
        icon: "error",
        confirmButtonText: "باشه",
        background: "#111827",
        color: "#ffffff",
        confirmButtonColor: "#7c3aed"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white/60 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <span>در حال بارگذاری اطلاعات پروفایل...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Info Summary Card */}
        <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl h-fit">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center font-bold text-3xl shadow-lg mb-4">
            {fullName ? fullName.charAt(0) : profile?.username.charAt(0) || "U"}
          </div>
          <h2 className="text-xl font-bold font-morabbaReg text-white">{fullName || "کاربر ورزشکار"}</h2>
          <p className="text-purple-400 text-xs mt-1 font-semibold bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
            {profile?.role === "admin" ? "مدیر کل" : profile?.role === "coach" ? "مربی مجرب" : "ورزشکار فیت‌کوچ"}
          </p>
          
          <hr className="border-white/10 w-full my-6" />

          <div className="w-full text-right space-y-3 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>نام کاربری:</span>
              <span className="text-white font-medium">@{profile?.username}</span>
            </div>
            <div className="flex justify-between">
              <span>وضعیت حساب:</span>
              <span className="text-green-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                تایید شده
              </span>
            </div>
          </div>
        </div>

        {/* Profile Edit Fields Form (2 Columns) */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl font-bold font-morabbaReg text-white mb-6">ویرایش حساب کاربری</h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-5">
            
            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">نام و نام خانوادگی</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
                  <input
                    type="text"
                    placeholder="مثال: علی کریمی"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">نام کاربری (انگلیسی)</label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 text-sm font-semibold">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-9 pl-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">شماره تلفن همراه</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
                  <input
                    type="tel"
                    placeholder="مثال: 09123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">آدرس ایمیل</label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <hr className="border-white/5 my-6" />

            <div className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-4 mb-4">
              <span className="text-[10px] text-purple-300 font-bold block mb-1">تغییر رمز عبور (اختیاری)</span>
              <span className="text-[10px] text-gray-400 leading-relaxed block">در صورتی که نمی‌خواهید رمز عبور خود را تغییر دهید، فیلدهای زیر را خالی بگذارید.</span>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">رمز عبور جدید</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-10 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 text-xs mb-2 font-medium">تکرار رمز عبور جدید</label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/45" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="******"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pr-11 pl-10 py-3 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال ذخیره...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>ذخیره تغییرات</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
