import NutritionTracker from "@/modules/dashboard/nutrition/NutritionTracker";

export const metadata = {
  title: "فیت‌کوچ | مدیریت تغذیه و کالری‌شمار روزانه",
  description: "ثبت روزانه وعده‌های غذایی، کنترل کالری دریافتی، پروتئین و هیدراتاسیون بدن در فیت‌کوچ",
};

export default function NutritionPage() {
  return <NutritionTracker />;
}
