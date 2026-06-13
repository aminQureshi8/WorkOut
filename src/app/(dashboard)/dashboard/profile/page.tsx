import UserProfileManagement from "@/modules/dashboard/profile/UserProfileManagement";

export const metadata = {
  title: "فیت‌کوچ | پروفایل من",
  description: "ویرایش اطلاعات حساب کاربری و تغییر رمز عبور در فیت‌کوچ",
};

export default function ProfilePage() {
  return <UserProfileManagement />;
}
