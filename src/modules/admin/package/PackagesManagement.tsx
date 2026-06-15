"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Crown,
  Award,
} from "lucide-react";
import Swal from "sweetalert2";
import { useForm, SubmitHandler } from "react-hook-form";

const cleanNumberString = (str: string) => {
  if (!str) return "";
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  let cleaned = str;
  for (let i = 0; i < 10; i++) {
    cleaned = cleaned.replace(new RegExp(persianDigits[i], "g"), i.toString());
    cleaned = cleaned.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  return cleaned.replace(/[^0-9]/g, "");
};

const formatToPersianWithCommas = (value: string | number) => {
  if (value === undefined || value === null || value === "") return "";
  const cleaned = cleanNumberString(value.toString());
  if (!cleaned) return "";
  return new Intl.NumberFormat("fa-IR").format(parseInt(cleaned, 10));
};

const parsePersianPrice = (val: string) => {
  if (!val) return 0;
  const cleaned = cleanNumberString(val);
  return cleaned ? parseInt(cleaned, 10) : 0;
};

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
    monthly: string;
    quarterly: string;
    biannual: string;
  };
  originalPrice: {
    monthly: string;
    quarterly: string;
    biannual: string;
  };
  featuresText: string;
};

export default function PackagesManagement() {
  const [packages, setPackages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormData>();

  const showAlert = (
    title: string,
    text: string,
    icon: "success" | "error" | "warning" | "info" = "info",
  ) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: "باشه",
      background: "#111827",
      color: "#ffffff",
      confirmButtonColor: "#f97316",
      customClass: {
        popup: "border border-orange-500/20 rounded-2xl",
      },
    });
  };

  const fetchPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/package");
      if (!res.ok) throw new Error("خطا در دریافت لیست پکیج‌ها");
      const data = await res.json();
      setPackages(data.packages || []);
    } catch (err: any) {
      setError(err.message || "بارگذاری اطلاعات با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingPackage(null);
    reset({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      icon: "",
      colorClass: "",
      tier: "",
      isPopular: false,
      isActive: true,
      price: { monthly: "", quarterly: "", biannual: "" },
      originalPrice: { monthly: "", quarterly: "", biannual: "" },
      featuresText: "",
    });
  };

  const handleEditClick = (pkg: any) => {
    setEditingPackage(pkg);
    setShowCreateModal(true);
    const featuresText = pkg.features
      ? pkg.features.map((f: any) => (typeof f === "string" ? f : f.name)).join("\n")
      : "";
    reset({
      name: pkg.name,
      slug: pkg.slug,
      tagline: pkg.tagline,
      description: pkg.description,
      icon: pkg.icon,
      colorClass: pkg.colorClass,
      tier: pkg.tier || "",
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
      price: {
        monthly: formatToPersianWithCommas(pkg.price?.monthly || ""),
        quarterly: formatToPersianWithCommas(pkg.price?.quarterly || ""),
        biannual: formatToPersianWithCommas(pkg.price?.biannual || ""),
      },
      originalPrice: {
        monthly: formatToPersianWithCommas(pkg.originalPrice?.monthly || ""),
        quarterly: formatToPersianWithCommas(pkg.originalPrice?.quarterly || ""),
        biannual: formatToPersianWithCommas(pkg.originalPrice?.biannual || ""),
      },
      featuresText,
    });
  };

  const onSubmit: SubmitHandler<PackageFormData> = async (formData) => {
    try {
      const features = formData.featuresText
        ? formData.featuresText.split("\n").filter((f) => f.trim() !== "")
        : [];

      const payload = {
        ...formData,
        features,
        price: {
          monthly: parsePersianPrice(formData.price.monthly),
          quarterly: parsePersianPrice(formData.price.quarterly),
          biannual: parsePersianPrice(formData.price.biannual),
        },
        originalPrice: {
          monthly: parsePersianPrice(formData.originalPrice.monthly),
          quarterly: parsePersianPrice(formData.originalPrice.quarterly),
          biannual: parsePersianPrice(formData.originalPrice.biannual),
        },
      };

      if (editingPackage) {
        // update package
        const res = await fetch(`/api/admin/package/${editingPackage._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "خطا در ویرایش پکیج");
        }
        showAlert("موفقیت", "پکیج با موفقیت ویرایش شد", "success");
      } else {
        // create package
        const res = await fetch("/api/admin/package", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "خطا در ایجاد پکیج");
        }
        showAlert("موفقیت", "پکیج با موفقیت ایجاد شد", "success");
      }
      handleCloseModal();
      fetchPackages();
    } catch (err: any) {
      showAlert("خطا", err.message || "عملیات ناموفق بود", "error");
    }
  };

  const handleDeletePackage = async (id: string) => {
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این پکیج و ویژگی‌های آن به طور کامل حذف خواهند شد!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#111827",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/package/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "خطا در حذف پکیج");
          }
          showAlert("موفقیت", "پکیج با موفقیت حذف شد", "success");
          setSelectedPackages((prev) => prev.filter((pid) => pid !== id));
          fetchPackages();
        } catch (err: any) {
          showAlert("خطا", err.message || "حذف پکیج ناموفق بود", "error");
        }
      }
    });
  };

  const handleBulkDelete = async () => {
    if (selectedPackages.length === 0) return;
    Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: `تعداد ${formatNumber(selectedPackages.length)} پکیج انتخاب شده به همراه ویژگی‌هایشان حذف خواهند شد!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شوند",
      cancelButtonText: "انصراف",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#111827",
      color: "#ffffff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deletePromises = selectedPackages.map((id) =>
            fetch(`/api/admin/package/${id}`, { method: "DELETE" })
          );
          await Promise.all(deletePromises);
          showAlert("موفقیت", "پکیج‌های انتخاب شده با موفقیت حذف شدند", "success");
          setSelectedPackages([]);
          fetchPackages();
        } catch (err: any) {
          showAlert("خطا", "برخی از پکیج‌ها با خطا مواجه شدند", "error");
        }
      }
    });
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

  const totalUsers = packages.reduce(
    (sum, pkg) => sum + (pkg.studentCount || 0),
    0,
  );
  const totalRevenue = packages.reduce(
    (sum, pkg) => sum + ((pkg.price?.monthly || 0) * (pkg.studentCount || 0)),
    0,
  );
  const activePackages = packages.filter((p) => p.isActive).length;
  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const mostPopularPackage = packages.find((p) => p.isPopular) || packages[0];

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
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer font-semibold text-sm"
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
              {formatNumber(packages.length)}
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
              <div className="text-white/60 text-sm">درآمد کل تخمینی</div>
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
              ماهانه
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-white/60 text-sm">محبوب‌ترین بسته</div>
              <Award className="w-5 h-5 text-green-400" />
            </div>
            <div
              className="text-xl text-white mb-1 truncate"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              {mostPopularPackage ? mostPopularPackage.name : "—"}
            </div>
            <div className="text-green-400 text-sm">
              {mostPopularPackage ? formatNumber(mostPopularPackage.studentCount || 0) : 0} کاربر فعال
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
              className="w-full bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
            />
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedPackages.length > 0 && (
          <div className="bg-orange-500/20 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="text-white text-sm">
              <span className="font-bold">
                {formatNumber(selectedPackages.length)}
              </span>{" "}
              پکیج انتخاب شده
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                حذف دسته‌جمعی
              </button>
            </div>
          </div>
        )}

        {/* Packages Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-white/50 bg-white/5 border border-white/10 rounded-2xl">
            در حال بارگذاری اطلاعات پکیج‌ها...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 bg-white/5 border border-white/10 rounded-2xl">
            {error}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="p-12 text-center text-white/40 bg-white/5 border border-white/10 rounded-2xl">
            هیچ پکیجی یافت نشد. پکیج جدیدی ایجاد کنید.
          </div>
        ) : (
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
                  <p className="text-white/60 text-sm mb-4 min-h-[40px] line-clamp-2">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">یک ماهه:</span>
                      <span className="text-white font-medium">
                        {formatNumber(pkg.price?.monthly || 0)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">سه ماهه:</span>
                      <span className="text-white font-medium">
                        {formatNumber(pkg.price?.quarterly || 0)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/60">شش ماهه:</span>
                      <span className="text-white font-medium">
                        {formatNumber(pkg.price?.biannual || 0)} تومان
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
                        {formatNumber(pkg.studentCount || 0)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-white/60 text-xs mb-1">
                        <DollarSign className="w-4 h-4" />
                        درآمد ماهانه
                      </div>
                      <div className="text-white font-medium text-sm">
                        {formatNumber((pkg.price?.monthly || 0) * (pkg.studentCount || 0))} تومان
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-white text-sm font-medium mb-3">
                    امکانات:
                  </h4>
                  <ul className="space-y-2 mb-6 min-h-[120px]">
                    {pkg.features?.slice(0, 4).map((feature: any, index: number) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-white/70 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{typeof feature === "string" ? feature : feature.name}</span>
                      </li>
                    ))}
                    {(!pkg.features || pkg.features.length === 0) && (
                      <li className="text-white/40 text-xs">بدون ویژگی ثبت شده</li>
                    )}
                    {pkg.features && pkg.features.length > 4 && (
                      <li className="text-orange-400 text-sm">
                        +{pkg.features.length - 4} مورد دیگر
                      </li>
                    )}
                  </ul>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(pkg)}
                      className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                      ویرایش
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg._id)}
                      className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-400 px-3.5 py-2.5 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      title="حذف پکیج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Package Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-gray-900/80 backdrop-blur-lg">
                <h2
                  className="text-2xl text-white font-bold"
                  style={{ fontFamily: "Marbeh, sans-serif" }}
                >
                  {editingPackage ? "ویرایش پکیج" : "ایجاد پکیج جدید"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-white mb-2 text-xs">نام پکیج</label>
                  <input
                    type="text"
                    placeholder="مثال: بسته طلایی"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
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
                  <label className="block text-white mb-2 text-xs">اسلاگ (URL)</label>
                  <input
                    type="text"
                    placeholder="مثال: gold-package"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
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
                  <label className="block text-white mb-2 text-xs">تاگلاین (معرفی کوتاه)</label>
                  <input
                    type="text"
                    placeholder="توضیح کوتاه و جذاب"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
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
                  <label className="block text-white mb-2 text-xs">توضیحات</label>
                  <textarea
                    rows={3}
                    placeholder="توضیحات کامل درباره خدمات این پکیج..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
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
                    <label className="block text-white mb-2 text-xs">
                      قیمت یک ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("price.monthly", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("price.monthly", formatted);
                        }
                      })}
                    />
                    {errors.price?.monthly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.price.monthly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-xs">
                      قیمت سه ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("price.quarterly", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("price.quarterly", formatted);
                        }
                      })}
                    />
                    {errors.price?.quarterly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.price.quarterly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-xs">
                      قیمت شش ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("price.biannual", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("price.biannual", formatted);
                        }
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
                    <label className="block text-white mb-2 text-xs">
                      قیمت اصلی یک ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("originalPrice.monthly", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("originalPrice.monthly", formatted);
                        }
                      })}
                    />
                    {errors.originalPrice?.monthly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.originalPrice.monthly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-xs">
                      قیمت اصلی سه ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("originalPrice.quarterly", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("originalPrice.quarterly", formatted);
                        }
                      })}
                    />
                    {errors.originalPrice?.quarterly && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.originalPrice.quarterly.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-xs">
                      قیمت اصلی شش ماهه
                    </label>
                    <input
                      type="text"
                      placeholder="۰"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("originalPrice.biannual", {
                        required: "ضروری است",
                        onChange: (e) => {
                          const formatted = formatToPersianWithCommas(e.target.value);
                          setValue("originalPrice.biannual", formatted);
                        }
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
                    <label className="block text-white mb-2 text-xs">
                      آیکون (نام آیکون)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: award, crown, package"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("icon")}
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 text-xs">کلاس رنگ</label>
                    <input
                      type="text"
                      placeholder="مثال: bg-blue-500"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 text-sm"
                      {...register("colorClass")}
                    />
                  </div>
                </div>

                {/* Tier */}
                <div>
                  <label className="block text-white mb-2 text-xs">دسته‌بندی پکیج</label>
                  <select
                    className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 text-sm cursor-pointer"
                    {...register("tier")}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="basic">پایه (Basic)</option>
                    <option value="professional">حرفه‌ای (Professional)</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-orange-500"
                      {...register("isPopular")}
                    />
                    بسته محبوب (Popular)
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer accent-orange-500"
                      {...register("isActive")}
                    />
                    پکیج فعال باشد
                  </label>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-white mb-2 text-xs">
                    امکانات پکیج (هر ویژگی در یک خط)
                  </label>
                  <textarea
                    rows={5}
                    placeholder={
                      "برنامه تمرینی شخصی‌سازی شده\nبرنامه غذایی اختصاصی\nپشتیبانی روزانه آنلاین"
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-500/50 resize-none text-sm"
                    {...register("featuresText")}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold text-sm"
                  >
                    {isSubmitting
                      ? (editingPackage ? "در حال ثبت تغییرات..." : "در حال ایجاد...")
                      : (editingPackage ? "ثبت تغییرات" : "ایجاد پکیج")}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors cursor-pointer text-sm"
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
