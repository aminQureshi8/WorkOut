"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Crown,
  Award,
} from "lucide-react";

import { IPackage } from "../../../../model/Package";
import { useForm, SubmitHandler } from "react-hook-form";

type PackageItem = any;

type PackageFormData = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  colorClass: string;
  tier: string;
  isPopular: boolean;
  isActive: boolean;
  price: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
  originalPrice: {
    monthly: number;
    quarterly: number;
    biannual: number;
  };
};

const mockPackages: PackageItem[] = [
  {
    _id: "1",
    name: "بسته پایه",
    slug: "basic-package",
    tagline: "پایه",
    description: "مناسب برای مبتدیان و افرادی که تازه شروع کرده‌اند",
    price: { monthly: 200000, quarterly: 540000, biannual: 960000 },
    originalPrice: { monthly: 200000, quarterly: 540000, biannual: 960000 },
    icon: "",
    colorClass: "bg-blue-500",
    rating: 0,
    reviewCount: 0,
    studentCount: 542,
    isPopular: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    name: "بسته حرفه‌ای",
    slug: "professional-package",
    tagline: "حرفه‌ای",
    description: "برای ورزشکارانی که به دنبال پیشرفت جدی هستند",
    price: { monthly: 350000, quarterly: 900000, biannual: 1500000 },
    originalPrice: { monthly: 350000, quarterly: 900000, biannual: 1500000 },
    icon: "",
    colorClass: "bg-purple-500",
    rating: 0,
    reviewCount: 0,
    studentCount: 823,
    isPopular: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    tier: "professional",
  },
  {
    _id: "3",
    name: "بسته VIP",
    slug: "vip-package",
    tagline: "وی‌آی‌پی",
    description: "بهترین انتخاب برای حرفه‌ای‌ها و افراد جدی",
    price: { monthly: 500000, quarterly: 1350000, biannual: 2400000 },
    originalPrice: { monthly: 500000, quarterly: 1350000, biannual: 2400000 },
    icon: "",
    colorClass: "bg-orange-500",
    rating: 0,
    reviewCount: 0,
    studentCount: 178,
    isPopular: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    tier: "vip",
  },
];

export default function PackagesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormData>();

  const createPackage = async (data: PackageFormData) => {
    const response = await fetch("/api/admin/package", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log(result);

    if (!response.ok)
      throw new Error(result.error || "Failed to create package");
    return result.package as IPackage;
  };

  const onSubmit: SubmitHandler<PackageFormData> = async (data) => {
    try {
      await createPackage(data);
      setShowCreateModal(false);
      reset();
      alert("پکیج جدید با موفقیت ایجاد شد!");
    } catch (e) {
      console.error(e);
      alert("خطا در ایجاد پکیج");
    }
  };

  const handleSelectPackage = (id: string) => {
    if (selectedPackages.includes(id)) {
      setSelectedPackages(selectedPackages.filter((pid) => pid !== id));
    } else {
      setSelectedPackages([...selectedPackages, id]);
    }
  };

  const getPackageIcon = (tier?: string) => {
    switch (tier) {
      case "basic":
        return <Package className="w-8 h-8 text-blue-400" />;
      case "professional":
        return <Award className="w-8 h-8 text-purple-400" />;
      case "vip":
        return <Crown className="w-8 h-8 text-orange-400" />;
      default:
        return <Package className="w-8 h-8 text-gray-400" />;
    }
  };

  const getPackageBadge = (tier?: string) => {
    if (!tier) return null;
    const styles: Record<string, string> = {
      basic: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      professional: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      vip: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    const labels: Record<string, string> = {
      basic: "پایه",
      professional: "حرفه‌ای",
      vip: "VIP 👑",
    };
    return (
      <span className={`px-3 py-1 rounded-full border text-xs ${styles[tier]}`}>
        {labels[tier]}
      </span>
    );
  };

  const getStatusBadge = (active: boolean) =>
    active ? (
      <span className="px-3 py-1 rounded-full border text-xs bg-green-500/20 text-green-400 border-green-500/30">
        فعال
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full border text-xs bg-gray-500/20 text-gray-400 border-gray-500/30">
        غیرفعال
      </span>
    );

  const formatNumber = (num: number) =>
    new Intl.NumberFormat("fa-IR").format(num);

  const totalUsers = mockPackages.reduce(
    (sum, pkg) => sum + pkg.studentCount,
    0,
  );
  const totalRevenue = mockPackages.reduce(
    (sum, pkg) => sum + pkg.price.monthly * pkg.studentCount,
    0,
  );
  const activePackages = mockPackages.filter((p) => p.isActive).length;
  const filteredPackages = mockPackages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div
      className="min-h-screen bg-gradient-to-br bg-black/30 p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1
              className="text-3xl mb-2 text-white"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              مدیریت پکیج‌ها
            </h1>
            <p className="text-white/60">مشاهده و ویرایش پکیج‌های اشتراک</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            ایجاد پکیج جدید
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">کل پکیج‌ها</div>
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div
              className="text-3xl text-white mb-1"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(mockPackages.length)}
            </div>
            <div className="text-green-400 text-sm">
              {formatNumber(activePackages)} پکیج فعال
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">کل کاربران</div>
              <Users className="w-5 h-5 text-purple-400" />
            </div>
            <div
              className="text-3xl text-white mb-1"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(totalUsers)}
            </div>
            <div className="text-purple-400 text-sm">در تمام پکیج‌ها</div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">درآمد کل</div>
              <DollarSign className="w-5 h-5 text-orange-400" />
            </div>
            <div
              className="text-2xl text-white mb-1"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {formatNumber(totalRevenue)} تومان
            </div>
            <div className="text-orange-400 text-sm flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +۱۸٪ این ماه
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">محبوب‌ترین</div>
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div
              className="text-xl text-white mb-1"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              بسته حرفه‌ای
            </div>
            <div className="text-green-400 text-sm">
              {formatNumber(823)} کاربر فعال
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="جستجوی پکیج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPackages.length > 0 && (
          <div className="bg-orange-500/20 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="text-white">
              <span className="font-bold">
                {formatNumber(selectedPackages.length)}
              </span>{" "}
              پکیج انتخاب شده
            </div>
            <div className="flex gap-2">
              <button className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                حذف
              </button>
              <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg transition-colors">
                غیرفعال کردن
              </button>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg._id}
              className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-white/5 ${
                selectedPackages.includes(pkg._id)
                  ? "ring-2 ring-orange-500"
                  : ""
              }`}
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedPackages.includes(pkg._id)}
                      onChange={() => handleSelectPackage(pkg._id)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-orange-500 cursor-pointer"
                    />
                    <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center">
                      {getPackageIcon(pkg.tier)}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getPackageBadge(pkg.tier)}
                    {getStatusBadge(pkg.isActive)}
                  </div>
                </div>

                <h3
                  className="text-2xl text-white mb-2"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  {pkg.name}
                </h3>
                <p className="text-white/60 text-sm mb-4">{pkg.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">یک ماهه:</span>
                    <span className="text-white font-medium">
                      {formatNumber(pkg.price.monthly)} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">سه ماهه:</span>
                    <span className="text-white font-medium">
                      {formatNumber(pkg.price.quarterly)} تومان
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/60">شش ماهه:</span>
                    <span className="text-white font-medium">
                      {formatNumber(pkg.price.biannual)} تومان
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                      <Users className="w-4 h-4" />
                      کاربران فعال
                    </div>
                    <div className="text-white font-medium">
                      {formatNumber(pkg.studentCount)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                      <DollarSign className="w-4 h-4" />
                      درآمد کل
                    </div>
                    <div className="text-white font-medium text-sm">
                      {formatNumber(pkg.price.monthly * pkg.studentCount)} تومان
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="text-white text-sm font-medium mb-3">
                  امکانات:
                </h4>
                <ul className="space-y-2 mb-4">
                  {pkg.features?.slice(0, 4).map((feature: any, index: number) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-white/70 text-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {pkg.features && pkg.features.length > 4 && (
                    <li className="text-orange-400 text-sm">
                      +{pkg.features.length - 4} مورد دیگر
                    </li>
                  )}
                </ul>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <Eye className="w-4 h-4" />
                    مشاهده
                  </button>
                  <button className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                    <Edit className="w-4 h-4" />
                    ویرایش
                  </button>
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Package Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2
                  className="text-2xl text-white"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  ایجاد پکیج جدید
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    reset();
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-white mb-2">نام پکیج</label>
                  <input
                    type="text"
                    placeholder="مثال: بسته طلایی"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    {...register("name", {
                      required: "نام پکیج ضروری است",
                      minLength: 2,
                    })}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-white mb-2">اسلاگ (URL)</label>
                  <input
                    type="text"
                    placeholder="مثال: gold-package"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    {...register("slug", {
                      required: "اسلاگ ضروری است",
                      pattern: {
                        value: /^[a-z0-9-]+$/i,
                        message: "فرمت اسلاگ نامعتبر است",
                      },
                    })}
                  />
                  {errors.slug && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.slug.message}
                    </p>
                  )}
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-white mb-2">تاگلاین</label>
                  <input
                    type="text"
                    placeholder="توضیح کوتاه"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                    {...register("tagline", {
                      required: "تاگلاین ضروری است",
                      minLength: 2,
                    })}
                  />
                  {errors.tagline && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.tagline.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white mb-2">توضیحات</label>
                  <textarea
                    rows={3}
                    placeholder="توضیحات کوتاه درباره پکیج..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                    {...register("description", {
                      required: "توضیحات ضروری است",
                      minLength: 2,
                    })}
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Prices */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت یک ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("price.monthly", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.price?.monthly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.price.monthly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت سه ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("price.quarterly", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.price?.quarterly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.price.quarterly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت شش ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("price.biannual", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.price?.biannual && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.price.biannual.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Original Prices */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت اصلی یک ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("originalPrice.monthly", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.originalPrice?.monthly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.originalPrice.monthly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت اصلی سه ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("originalPrice.quarterly", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.originalPrice?.quarterly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.originalPrice.quarterly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-sm">
                      قیمت اصلی شش ماهه
                    </label>
                    <input
                      type="number"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("originalPrice.biannual", {
                        required: "ضروری است",
                        min: 0,
                        valueAsNumber: true,
                      })}
                    />
                    {errors.originalPrice?.biannual && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.originalPrice.biannual.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Icon & Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">
                      آیکون (URL یا کلاس)
                    </label>
                    <input
                      type="text"
                      placeholder="آیکن یا کلاس"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("icon")}
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">کلاس رنگ</label>
                    <input
                      type="text"
                      placeholder="مثال: bg-blue-500"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50"
                      {...register("colorClass")}
                    />
                  </div>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-white mb-2">دسته‌بندی</label>
                  <select
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50"
                    {...register("tier")}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="basic">پایه</option>
                    <option value="professional">حرفه‌ای</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      {...register("isPopular")}
                    />
                    بسته محبوب
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4"
                      {...register("isActive")}
                    />
                    فعال باشد
                  </label>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-white mb-2">
                    امکانات (هر خط یک مورد)
                  </label>
                  <textarea
                    rows={6}
                    placeholder={
                      "دسترسی به برنامه تمرینی\nرژیم غذایی شخصی‌سازی شده\nپشتیبانی ۲۴/۷"
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "در حال ایجاد..." : "ایجاد پکیج"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      reset();
                    }}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
