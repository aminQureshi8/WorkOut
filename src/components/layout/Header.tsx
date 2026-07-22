"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiDumbbell } from "react-icons/bi";
import UserDropdown from "./UserDropdown";

export default function Header({ session }: { session: any }) {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "text-amber-500 transition-colors"
      : "text-white/80 hover:text-orange-500 transition-colors";
  };

  return (
    <nav className="bg-black/30! backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto">
        <div className="mx-auhref font-danaMed">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <BiDumbbell className="w-8 h-8 text-amber-500 " />
              <span className="font-bold text-xl text-white font-morabbaReg">
                استارفیت
              </span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link href="/" className={getLinkClass("/")}>
                خانه
              </Link>
              <Link href="/packages" className={getLinkClass("/packages")}>
                پکیج‌ها
              </Link>
              <Link href="/nutrition" className={getLinkClass("/nutrition")}>
                کالری شمار
              </Link>
              <Link href="/articles" className={getLinkClass("/articles")}>
                مقالات
              </Link>
              <Link
                href="/dashboard/tickets"
                className={getLinkClass("/tickets")}
              >
                پشتیبانی
              </Link>
            </div>

            {session ? (
              <UserDropdown
                username={session.user.username}
                avatar={session.user.avatar}
                email={session.user.email}
                role={session.user.role}
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
