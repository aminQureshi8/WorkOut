"use client";
import React from "react";
import {
  Search,
  Trash2,
  Users,
  DollarSign,
  Edit,
  Package as PackageIcon,
  Award,
  Crown,
} from "lucide-react";
import { PackageListProps } from "@/types/package";

export default function PackageList({
  packages,
  searchTerm,
  setSearchTerm,
  selectedPackages,
  handleSelectPackage,
  handleBulkDelete,
  handleEditClick,
  handleDeletePackage,
  formatNumber,
  isLoading,
  error,
}: PackageListProps) {
  const getPackageIcon = (tier?: string) => {
    switch (tier) {
      case "basic":
        return <PackageIcon className="w-8 h-8 text-blue-400" />;
      case "professional":
        return <Award className="w-8 h-8 text-purple-400" />;
      case "vip":
        return <Crown className="w-8 h-8 text-orange-400" />;
      default:
        return <PackageIcon className="w-8 h-8 text-gray-400" />;
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

  const filteredPackages = packages.filter((pkg) =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
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

      {/* Bulk actions */}
      {selectedPackages.length > 0 && (
        <div className="bg-orange-500/20 backdrop-blur-lg border border-orange-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-white text-sm">
            <span className="font-bold">{formatNumber(selectedPackages.length)}</span> پکیج انتخاب شده
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

      {/* Grid List */}
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
                selectedPackages.includes(pkg._id) ? "ring-2 ring-orange-500" : ""
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
                <h4 className="text-white text-sm font-medium mb-3">امکانات:</h4>
                <ul className="space-y-2 mb-6 min-h-[120px]">
                  {pkg.features?.slice(0, 4).map((feature: any, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{typeof feature === "string" ? feature : feature.name}</span>
                    </li>
                  ))}
                  {(!pkg.features || pkg.features.length === 0) && (
                    <li className="text-white/40 text-xs">بدون ویژگی ثبت شده</li>
                  )}
                  {pkg.features && pkg.features.length > 4 && (
                    <li className="text-orange-400 text-sm">+{pkg.features.length - 4} مورد دیگر</li>
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
    </>
  );
}
