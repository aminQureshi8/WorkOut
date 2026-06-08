"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Wallet,
  Building2,
  ShieldCheck,
  Zap,
  Gift,
  Tag,
} from "lucide-react";

const banks = [
  { id: "mellat", name: "بانک ملت", logo: "🏦" },
  { id: "melli", name: "بانک ملی", logo: "🏦" },
  { id: "saderat", name: "بانک صادرات", logo: "🏦" },
  { id: "parsian", name: "بانک پارسیان", logo: "🏦" },
  { id: "pasargad", name: "بانک پاسارگاد", logo: "🏦" },
  { id: "tejarat", name: "بانک تجارت", logo: "🏦" },
];

export default function OrderPage({ package: initialPackage }) {
  const [selectedPackage, setSelectedPackage] = useState(initialPackage?.slug);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [selectedBank, setSelectedBank] = useState("mellat");
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

  const getDiscount = () => {
    if (!discountApplied) return 0;
    return Math.floor(getPrice() * 0.15);
  };

  const getFinalPrice = () => {
    return getPrice() - getDiscount();
  };

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "FIT2024") {
      setDiscountApplied(true);
    } else {
      alert("کد تخفیف نامعتبر است");
    }
  };

  const handleSubmitOrder = () => {
    if (!fullName || !email || !phone) {
      alert("لطفاً تمام اطلاعات را وارد کنید");
      return;
    }
    if (!agreedToTerms) {
      alert("لطفاً قوانین و مقررات را مطالعه و تایید کنید");
      return;
    }
    alert("در حال انتقال به درگاه پرداخت...");
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("fa-IR").format(num || 0);
  };

  const getCycleName = () => {
    switch (billingCycle) {
      case "monthly":
        return "یک ماهه";
      case "quarterly":
        return "سه ماهه";
      case "biannual":
        return "شش ماهه";
      default:
        return "یک ماهه";
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4"
      style={{ fontFamily: "Dana, sans-serif" }}
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Selection */}
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
                  onClick={() => setSelectedPackage(initialPackage?.slug)}
                  className={`p-4 rounded-xl border-2 transition-all text-right ${
                    selectedPackage === initialPackage?.slug
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

            {/* Billing Cycle */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CheckCircle className="w-6 h-6 text-orange-500" />
                دوره پرداخت
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    billingCycle === "monthly"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-right">
                    <div className="text-white font-medium">یک ماهه</div>
                    <div className="text-white/60 text-sm">پرداخت ماهانه</div>
                  </div>
                  <div
                    className="text-white font-bold"
                    style={{ fontFamily: "Marbeh, sans-serif" }}
                  >
                    {formatNumber(currentPackage?.price?.monthly)} تومان
                  </div>
                </button>

                <button
                  onClick={() => setBillingCycle("quarterly")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    billingCycle === "quarterly"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-right">
                    <div className="text-white font-medium flex items-center gap-2">
                      سه ماهه
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                        ۱۰٪ تخفیف
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">صرفه‌جویی بیشتر</div>
                  </div>
                  <div
                    className="text-white font-bold"
                    style={{ fontFamily: "Marbeh, sans-serif" }}
                  >
                    {formatNumber(currentPackage?.price?.quarterly)} تومان
                  </div>
                </button>

                <button
                  onClick={() => setBillingCycle("biannual")}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    billingCycle === "biannual"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-right">
                    <div className="text-white font-medium flex items-center gap-2">
                      شش ماهه
                      <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                        ۲۰٪ تخفیف
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">بهترین قیمت</div>
                  </div>
                  <div
                    className="text-white font-bold"
                    style={{ fontFamily: "Marbeh, sans-serif" }}
                  >
                    {formatNumber(currentPackage?.price?.biannual)} تومان
                  </div>
                </button>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CheckCircle className="w-6 h-6 text-orange-500" />
                اطلاعات شما
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">
                    نام و نام خانوادگی
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نام کامل خود را وارد کنید"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">ایمیل</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">شماره موبایل</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
              <h2
                className="text-xl text-white mb-4 flex items-center gap-2"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <CreditCard className="w-6 h-6 text-orange-500" />
                روش پرداخت
              </h2>

              <div className="space-y-3">
                {/* Gateway */}
                <button
                  onClick={() => setPaymentMethod("gateway")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "gateway"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-right flex-1">
                      <div className="text-white font-medium">درگاه بانکی</div>
                      <div className="text-white/60 text-sm">
                        پرداخت امن از طریق بانک
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "gateway" && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBank(bank.id);
                          }}
                          className={`p-3 rounded-lg border transition-all ${
                            selectedBank === bank.id
                              ? "border-orange-500 bg-orange-500/20"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="text-2xl mb-1">{bank.logo}</div>
                          <div className="text-white text-xs">{bank.name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </button>

                {/* Card to Card */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-right flex-1">
                      <div className="text-white font-medium">کارت به کارت</div>
                      <div className="text-white/60 text-sm">
                        انتقال مستقیم به شماره کارت
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-sm mb-1">
                          شماره کارت:
                        </div>
                        <div
                          className="text-white font-bold text-lg"
                          style={{ fontFamily: "Marbeh, sans-serif" }}
                        >
                          ۶۰۳۷-۹۹۱۲-۳۴۵۶-۷۸۹۰
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="text-white/60 text-sm mb-1">
                          به نام:
                        </div>
                        <div className="text-white">علی محمدی (فیت‌کوچ)</div>
                      </div>
                    </div>
                  )}
                </button>

                {/* Wallet */}
                <button
                  onClick={() => setPaymentMethod("wallet")}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === "wallet"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-right flex-1">
                      <div className="text-white font-medium">کیف پول</div>
                      <div className="text-white/60 text-sm">
                        موجودی: ۱,۵۰۰,۰۰۰ تومان
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 sticky top-8">
              <h2
                className="text-xl text-white mb-4"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                خلاصه سفارش
              </h2>

              {/* Package Info */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="text-orange-400 text-sm mb-1">پکیج انتخابی</div>
                <div
                  className="text-white text-lg font-medium"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  {currentPackage?.name}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  دوره: {getCycleName()}
                </div>
              </div>

              {/* Discount Code */}
              <div className="mb-4">
                <label className="block text-white mb-2 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  کد تخفیف
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="کد تخفیف"
                    disabled={discountApplied}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 disabled:opacity-50"
                  />
                  {!discountApplied ? (
                    <button
                      onClick={handleApplyDiscount}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      اعمال
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setDiscountApplied(false);
                        setDiscountCode("");
                      }}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
                    >
                      حذف
                    </button>
                  )}
                </div>
                {discountApplied && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
                    <Gift className="w-4 h-4" />
                    کد تخفیف با موفقیت اعمال شد
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 py-4 border-y border-white/10">
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
              </div>

              {/* Total */}
              <div
                className="flex justify-between items-center text-white text-xl font-bold mt-4 mb-6"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                <span>مبلغ نهایی:</span>
                <span className="text-orange-400">
                  {formatNumber(getFinalPrice())} تومان
                </span>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-orange-500 mt-0.5 cursor-pointer"
                />
                <span className="text-white/80 text-sm">
                  <Link
                    href="#"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    قوانین و مقررات
                  </Link>{" "}
                  را مطالعه کرده و می‌پذیرم
                </span>
              </label>

              {/* Submit Button */}
              <button
                onClick={handleSubmitOrder}
                disabled={!agreedToTerms}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {paymentMethod === "gateway"
                  ? "انتقال به درگاه پرداخت"
                  : paymentMethod === "card"
                    ? "تایید و ادامه"
                    : "پرداخت از کیف پول"}
              </button>

              {/* Trust Badges */}
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
        </div>
      </div>
    </div>
  );
}
