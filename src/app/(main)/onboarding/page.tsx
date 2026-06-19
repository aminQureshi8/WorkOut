import OnboardingForm from "@/modules/onboarding/OnboardingForm";

export const metadata = {
  title: "فیت‌کوچ | تکمیل مشخصات ورزشی",
  description: "برای شخصی‌سازی برنامه‌های ورزشی و تغذیه، لطفاً مشخصات فیزیکی و ورزشی خود را در این بخش تکمیل کنید.",
};

export default function OnboardingPage() {
  return <OnboardingForm />;
}
