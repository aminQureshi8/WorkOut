import dbConnect from "@/lib/dbConnect";
import Subscription from "@/model/Subscription";
import Pr from "@/model/Pr";
import PersonalRecords from "@/modules/admin/pr/PersonalRecords";

export const metadata = {
  title: "فیت‌کوچ | رکوردهای شخصی (PR) - مدیریت",
  description: "مدیریت رکوردهای شخصی (PR) در پنل مدیریت فیت‌کوچ",
};

interface AdminPRPageProps {
  searchParams: Promise<{ userId?: string }>;
}

export default async function AdminPRPage({ searchParams }: AdminPRPageProps) {
  const { userId } = await searchParams;

  if (userId) {
    try {
      await dbConnect();
      const findUser = await Subscription.findOne({ userId })
        .populate("userId")
        .populate("pr")
        .lean();
      console.log(findUser);
    } catch (err) {
      console.error(err);
    }
  }

  return <PersonalRecords userId={userId} />;
}
