import FitnessProfileManagement from "@/modules/dashboard/fitness-profile/FitnessProfileManagement";

export const metadata = {
  title: "فیت‌کوچ | پروفایل ورزشی من",
  description: "مشاهده و ویرایش مشخصات فیزیکی، اهداف ورزشی و سابقه تمرین در فیت‌کوچ",
};

export default function FittnessProfilePage() {
  return <FitnessProfileManagement />;
}
