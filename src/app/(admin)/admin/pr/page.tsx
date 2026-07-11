import PersonalRecords from "@/modules/admin/pr/PersonalRecords";

export const metadata = {
  title: "فیت‌کوچ | رکوردهای شخصی (PR) - مدیریت",
  description: "مدیریت رکوردهای شخصی (PR) در پنل مدیریت فیت‌کوچ",
};

export default function AdminPRPage() {
  return <PersonalRecords />;
}
