"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { showAlert, showConfirm } from "@/utils/alert";
import { formatToPersianWithCommas, parsePersianPrice } from "@/utils/price";
import {
  Package,
  PackageFormData,
  PackageStats as IPackageStats,
} from "@/types/package";
import PackageStats from "./PackageStats";
import PackageList from "./PackageList";
import PackageModal from "./PackageModal";

const formatNumber = (num: number) =>
  new Intl.NumberFormat("fa-IR").format(num);

export default function PackagesManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PackageFormData>();

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
      tier: "basic",
      isPopular: false,
      isActive: true,
      price: { monthly: "", quarterly: "", biannual: "" },
      originalPrice: { monthly: "", quarterly: "", biannual: "" },
      featuresText: "",
    });
  };

  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowCreateModal(true);
    const featuresText = pkg.features
      ? pkg.features
          .map((f: any) => (typeof f === "string" ? f : f.name))
          .join("\n")
      : "";
    reset({
      name: pkg.name,
      slug: pkg.slug,
      tagline: pkg.tagline,
      description: pkg.description,
      icon: pkg.icon,
      colorClass: pkg.colorClass,
      tier: pkg.tier || "basic",
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
      price: {
        monthly: formatToPersianWithCommas(pkg.price?.monthly || ""),
        quarterly: formatToPersianWithCommas(pkg.price?.quarterly || ""),
        biannual: formatToPersianWithCommas(pkg.price?.biannual || ""),
      },
      originalPrice: {
        monthly: formatToPersianWithCommas(pkg.originalPrice?.monthly || ""),
        quarterly: formatToPersianWithCommas(
          pkg.originalPrice?.quarterly || "",
        ),
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
    const confirmed = await showConfirm(
      "آیا مطمئن هستید؟",
      "این پکیج و ویژگی‌های آن به طور کامل حذف خواهند شد!",
      "بله، حذف شود",
    );
    if (confirmed) {
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
  };

  const handleBulkDelete = async () => {
    if (selectedPackages.length === 0) return;
    const confirmed = await showConfirm(
      "آیا مطمئن هستید؟",
      `تعداد ${formatNumber(selectedPackages.length)} پکیج انتخاب شده به همراه ویژگی‌هایشان حذف خواهند شد!`,
      "بله، حذف شوند",
    );
    if (confirmed) {
      try {
        const deletePromises = selectedPackages.map((id) =>
          fetch(`/api/admin/package/${id}`, { method: "DELETE" }),
        );
        await Promise.all(deletePromises);
        showAlert(
          "موفقیت",
          "پکیج‌های انتخاب شده با موفقیت حذف شدند",
          "success",
        );
        setSelectedPackages([]);
        fetchPackages();
      } catch (err: any) {
        showAlert("خطا", "برخی از پکیج‌ها با خطا مواجه شدند", "error");
      }
    }
  };

  const handleSelectPackage = (id: string) => {
    if (selectedPackages.includes(id)) {
      setSelectedPackages(selectedPackages.filter((pid) => pid !== id));
    } else {
      setSelectedPackages([...selectedPackages, id]);
    }
  };

  const stats = useMemo<IPackageStats>(() => {
    const totalUsers = packages.reduce(
      (sum, pkg) => sum + (pkg.studentCount || 0),
      0,
    );
    const totalRevenue = packages.reduce(
      (sum, pkg) => sum + (pkg.price?.monthly || 0) * (pkg.studentCount || 0),
      0,
    );
    const activeCount = packages.filter((p) => p.isActive).length;
    const mostPopularPackage = packages.find((p) => p.isPopular) || packages[0];

    return {
      totalCount: packages.length,
      activeCount,
      totalUsers,
      totalRevenue,
      mostPopularName: mostPopularPackage ? mostPopularPackage.name : "—",
      mostPopularCount: mostPopularPackage
        ? mostPopularPackage.studentCount || 0
        : 0,
    };
  }, [packages]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br bg-black/30 p-4 md:p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl mb-2 text-white">مدیریت پکیج‌ها</h1>
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

        <PackageStats stats={stats} formatNumber={formatNumber} />

        <PackageList
          packages={packages}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPackages={selectedPackages}
          handleSelectPackage={handleSelectPackage}
          handleBulkDelete={handleBulkDelete}
          handleEditClick={handleEditClick}
          handleDeletePackage={handleDeletePackage}
          formatNumber={formatNumber}
          isLoading={isLoading}
          error={error}
        />

        <PackageModal
          isOpen={showCreateModal}
          editingPackage={editingPackage}
          onClose={handleCloseModal}
          onSubmit={handleSubmit(onSubmit)}
          register={register}
          errors={errors}
          isSubmitting={isSubmitting}
          setValue={setValue}
        />
      </div>
    </div>
  );
}
