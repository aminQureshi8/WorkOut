"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Package, PackageFormData } from "@/types/package";
import PackageStats from "./PackageStats";
import PackageList from "./PackageList";
import PackageModal from "./PackageModal";

const formatNumber = (num: number) =>
  new Intl.NumberFormat("fa-IR").format(num);

export default function PackagesManagLoement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormData>();

  const fetchPackages = async () => {
    const res = await fetch("/api/admin/package");
    if (!res.ok) throw new Error("خطا در دریافت لیست پکیج‌ها");
    const data = await res.json();
    setPackages(data.packages || []);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br bg-black/30 p-4 md:p-8"
      dir="rtl"
    >
      <div className="container mx-auto pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl mb-2 text-white font-morabbaReg font-bold">
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

        <PackageStats packages={packages} formatNumber={formatNumber} />

        <PackageList
          packages={packages}
          fetchPackages={fetchPackages}
          setEditingPackage={setEditingPackage}
          setShowCreateModal={setShowCreateModal}
          reset={reset}
          formatNumber={formatNumber}
        />

        <PackageModal
          isOpen={showCreateModal}
          setShowCreateModal={setShowCreateModal}
          editingPackage={editingPackage}
          setEditingPackage={setEditingPackage}
          reset={reset}
          handleSubmit={handleSubmit}
          fetchPackages={fetchPackages}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          setValue={setValue}
        />
      </div>
    </div>
  );
}
