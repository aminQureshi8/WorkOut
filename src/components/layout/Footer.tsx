import { BsInstagram } from "react-icons/bs";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { BiDumbbell } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
export default function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/10 py-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-8 sm:gap-8 mb-12">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BiDumbbell className="w-8 h-8 text-orange-500" />
              <span className="font-bold text-xl text-white font-morabbaReg">
                استار فیت
              </span>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              پلتفرم آنلاین تمرینات بدنسازی و فیتنس با بیش از ۱۰ سال تجربه در
              زمینه مربیگری و برنامه‌نویسی تمرینی. همراه شما در مسیر تحول بدنی
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 rounded-lg flex items-center justify-center transition-all"
              >
                <BsInstagram className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 rounded-lg flex items-center justify-center transition-all"
              >
                <FiMessageCircle className="w-5 h-5 text-white" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/5 hover:bg-orange-500 border border-white/10 hover:border-orange-500 rounded-lg flex items-center justify-center transition-all"
              >
                <CgMail className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          <div className="col-span-1">
            <h4
              className="font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              دسترسی سریع
            </h4>
            <div className="space-y-3 text-white/60 text-sm">
              <div>
                <Link
                  href="/"
                  className="hover:text-orange-500 transition-colors"
                >
                  صفحه اصلی
                </Link>
              </div>
              <div>
                <Link
                  href="/packages"
                  className="hover:text-orange-500 transition-colors"
                >
                  پکیج‌های اشتراک
                </Link>
              </div>
              <div>
                <Link
                  href="/articles"
                  className="hover:text-orange-500 transition-colors"
                >
                  مقالات آموزشی
                </Link>
              </div>
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  درباره ما
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  تماس با ما
                </a>
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <h4
              className="font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              خدمات
            </h4>
            <div className="space-y-3 text-white/60 text-sm">
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  مربیگری آنلاین
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  برنامه تمرینی
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  برنامه غذایی
                </a>
              </div>
              <div>
                <Link
                  href="/tickets"
                  className="hover:text-orange-500 transition-colors"
                >
                  پشتیبانی
                </Link>
              </div>
              <div>
                <a href="#" className="hover:text-orange-500 transition-colors">
                  مشاوره رایگان
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/50 text-sm text-center md:text-right">
              © ۱۴۰۳ فیت‌کوچ. تمامی حقوق محفوظ است.
            </div>
            <div className="text-white/50 text-sm text-center md:text-left" dir="ltr">
              built pixel by pixel by{" "}
              <a
                href="https://www.linkedin.com/in/amin-ghoreishi-399a26395?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-400 transition-colors"
              >
                Amin Ghoreishi
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
