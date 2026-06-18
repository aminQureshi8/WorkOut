import BMICalculator from "@/modules/dashboard/bmi/BMICalculator";

export const metadata = {
  title: "فیت‌کوچ | محاسبه شاخص توده بدنی (BMI)",
  description: "محاسبه شاخص توده بدنی (BMI) و تحلیل تناسب اندام شما در فیت‌کوچ",
};

export default function BMIPage() {
  return <BMICalculator />;
}
