import Link from "next/link";
import { BiDumbbell } from "react-icons/bi";

export default function Header() {
  return (
    <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto">
        <div className="mx-auhref font-danaMed  px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <BiDumbbell className="w-8 h-8 text-orange-500" />
              <span
                className="font-bold text-xl text-white"
               
              >
                فیت‌کوچ
              </span>
            </div>
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
            <Link
              href="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ورود / ثبت نام
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
