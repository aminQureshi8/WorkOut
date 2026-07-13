import React from "react";
import { Info } from "lucide-react";
import { showAlert } from "@/utils/alert";
import { PackageInfo, WorkoutPlan } from "@/types/workout";

interface CreatePlanFormProps {
  selectedPackage: PackageInfo;
  onSuccess: (plan: WorkoutPlan) => void;
}

export default function CreatePlanForm({
  selectedPackage,
  onSuccess,
}: CreatePlanFormProps) {
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/subscription/workout-month", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackage._id,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.plan);
        showAlert("موفقیت", "برنامه تمرینی با موفقیت ایجاد شد", "success");
      }
    } catch (err) {
      console.error(err);
      showAlert("خطا", "خطا در ایجاد برنامه", "error");
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
      <Info className="w-10 h-10 text-orange-500/60 mx-auto mb-3" />
      <h4 className="text-white font-bold text-lg mb-2">
        برنامه تمرینی یافت نشد
      </h4>
      <p className="text-white/60 text-sm mb-6">
        برنامه تمرینی برای پکیج {selectedPackage.name} تعریف نشده است.
      </p>
      <form onSubmit={handleCreatePlan} className="max-w-xl mx-auto text-right">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm"
        >
          ایجاد برنامه تمرینی جدید
        </button>
      </form>
    </div>
  );
}
