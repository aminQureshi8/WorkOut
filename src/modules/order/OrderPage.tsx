"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Zap,
  Gift,
} from "lucide-react";

const banks = [
  { id: "mellat", name: "بانک ملت", logo: "🏦" },
  { id: "melli", name: "بانک ملی", logo: "🏦" },
  { id: "saderat", name: "بانک صادرات", logo: "🏦" },
  { id: "parsian", name: "بانک پارسیان", logo: "🏦" },
  { id: "pasargad", name: "بانک پاسارگاد", logo: "🏦" },
  { id: "tejarat", name: "بانک تجارت", logo: "🏦" },
];

export default function OrderPage({ package: initialPackage, userId, email }) {
  const { register, handleSubmit, watch, setValue } = useForm({
    mode: "onBlur",
    defaultValues: {
      selectedPackage: initialPackage?._id,
      billingCycle: "monthly",
      paymentMethod: "gateway",
      selectedBank: "mellat",
      discountCode: "",
      agreedToTerms: false,
      fullName: "",
      email,
      phone: "",
    },
  });

  const selectedPackage = watch("selectedPackage");
  const billingCycle = watch("billingCycle");
  const paymentMethod = watch("paymentMethod");
  const selectedBank = watch("selectedBank");
  const discountCode = watch("discountCode");
  const agreedToTerms = watch("agreedToTerms");

  const currentPackage = initialPackage;

  const getPrice = () => {
    switch (billingCycle) {
      case "monthly":
        return currentPackage?.price?.monthly || 0;
      case "quarterly":
        return currentPackage?.price?.quarterly || 0;
      case "biannual":
        return currentPackage?.price?.biannual || 0;
      default:
        return currentPackage?.price?.monthly || 0;
    }
  };

  const discountApplied = discountCode?.toUpperCase() === "FIT2024";

  const getDiscount = () => {
    if (!discountApplied) return 0;
    return Math.floor(getPrice() * 0.15);
  };

  const getFinalPrice = () => getPrice() - getDiscount();

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fa-IR").format(num || 0);
  };

  const onSubmit = async (data) => {
    if (!data.fullName || !data.email || !data.phone) {
      alert("لطفاً تمام اطلاعات را وارد کنید");
      return;
    }

    if (!data.agreedToTerms) {
      alert("لطفاً قوانین و مقررات را تایید کنید");
      return;
    }

    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        packageId: data.selectedPackage,
        billingCycle: data.billingCycle,
        discountCode: data.discountCode || null,
      };

      const res = await fetch(`/api/order?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message);
        return;
      }

      console.log(result);
    } catch (error) {
      console.error(error);
      alert("خطا در ثبت سفارش");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4"
      style={{ fontFamily: "Dana, sans-serif" }}
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4"
          >
            <ArrowRight className="w-5 h-5" />
            بازگشت به پکیج‌ها
          </Link>

          <h1
            className="text-4xl text-white mb-2"
            style={{ fontFamily: "Marbeh, sans-serif" }}
          >
            تکمیل سفارش
          </h1>

          <p className="text-white/60">
            اطلاعات خود را وارد کنید و پرداخت را تکمیل کنید
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CheckCircle className="w-6 h-6 text-orange-500" />
                انتخاب پکیج
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setValue("selectedPackage", initialPackage?._id)
                  }
                  className={`p-4 rounded-xl border-2 transition-all text-right ${
                    selectedPackage === initialPackage?._id
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-white font-medium mb-1">
                    {currentPackage?.name}
                  </div>

                  <div className="text-white/60 text-sm">
                    از {formatNumber(currentPackage?.price?.monthly)} تومان
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CheckCircle className="w-6 h-6 text-orange-500" />
                دوره پرداخت
              </h2>

              <div className="space-y-3">
                {["monthly", "quarterly", "biannual"].map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setValue("billingCycle", cycle)}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                      billingCycle === cycle
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="text-right">
                      <div className="text-white font-medium">
                        {cycle === "monthly" && "یک ماهه"}
                        {cycle === "quarterly" && "سه ماهه"}
                        {cycle === "biannual" && "شش ماهه"}
                      </div>
                    </div>

                    <div
                      className="text-white font-bold"
                      style={{ fontFamily: "Marbeh, sans-serif" }}
                    >
                      {formatNumber(currentPackage?.price?.[cycle])} تومان
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CheckCircle className="w-6 h-6 text-orange-500" />
                اطلاعات شما
              </h2>

              <div className="space-y-4">
                <input
                  {...register("fullName", { required: true, minLength: 3 })}
                  placeholder="نام کامل خود را وارد کنید"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                />

                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="email@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                />

                <input
                  type="text"
                  {...register("phone", {
                    required: true,
                    pattern: /^09\d{9}$/,
                  })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CreditCard className="w-6 h-6 text-orange-500" />
                روش پرداخت
              </h2>

              <div className="space-y-3 text-white">
                <button
                  type="button"
                  onClick={() => setValue("paymentMethod", "gateway")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "gateway"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  درگاه بانکی
                </button>

                {paymentMethod === "gateway" && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {banks.map((bank) => (
                      <button
                        type="button"
                        key={bank.id}
                        onClick={() => setValue("selectedBank", bank.id)}
                        className={`p-3 rounded-lg border ${
                          selectedBank === bank.id
                            ? "border-orange-500 bg-orange-500/20"
                            : "border-white/10 bg-white/5"
                        }`}
                      >
                        <div className="text-2xl mb-1">{bank.logo}</div>
                        <div className="text-white text-xs">{bank.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 sticky top-8">
              <h2
                className="text-xl text-white mb-4"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                خلاصه سفارش
              </h2>

              <div className="flex justify-between text-white/80">
                <span>قیمت پکیج:</span>
                <span>{formatNumber(getPrice())} تومان</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-green-400">
                  <span>تخفیف (۱۵٪):</span>
                  <span>-{formatNumber(getDiscount())} تومان</span>
                </div>
              )}

              <div className="flex justify-between items-center text-white text-xl font-bold mt-4 mb-6">
                <span>مبلغ نهایی:</span>
                <span className="text-orange-400">
                  {formatNumber(getFinalPrice())} تومان
                </span>
              </div>

              <input
                {...register("discountCode")}
                placeholder="کد تخفیف"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40"
              />

              <label className="flex items-start gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agreedToTerms")}
                  className="w-5 h-5 rounded border-white/20 bg-white/5"
                />
                <span className="text-white/80 text-sm">
                  قوانین و مقررات را می‌پذیرم
                </span>
              </label>

              <button
                type="submit"
                disabled={!agreedToTerms}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl disabled:opacity-50"
              >
                انتقال به درگاه پرداخت
              </button>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <ShieldCheck className="w-5 h-5 text-green-400 mx-auto mb-1" />
                  <div className="text-white/60 text-xs">پرداخت امن</div>
                </div>

                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <Gift className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-white/60 text-xs">۷ روز رایگان</div>
                </div>

                <div className="bg-white/5 rounded-lg p-2 text-center">
                  <Zap className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <div className="text-white/60 text-xs">فعال‌سازی آنی</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
