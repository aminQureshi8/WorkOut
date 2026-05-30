import Link from "next/link";
import { BiDumbbell } from "react-icons/bi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserDropdown from "./UserDropdown";

export default async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-black/30! backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto">
        <div className="mx-auhref font-danaMed">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <BiDumbbell className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white">استارفیت</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link
                href="/"
                className="text-white hover:text-orange-500 transition-colors"
              >
                خانه
              </Link>
              <Link
                href="/packages"
                className="text-white/80 hover:text-orange-500 transition-colors"
              >
                پکیج‌ها
              </Link>
              <Link
                href="/articles"
                className="text-white/80 hover:text-orange-500 transition-colors"
              >
                مقالات
              </Link>
              <Link
                href="/tickets"
                className="text-white/80 hover:text-orange-500 transition-colors"
              >
                پشتیبانی
              </Link>
            </div>

            {session ? (
              <UserDropdown
                username={session.user.username}
                avatar={session.user.avatar}
                email={session.user.email}
              />
            ) : (
              <Link
                href="/login"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                ورود / ثبت نام
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
