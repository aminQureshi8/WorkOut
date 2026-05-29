import { BsInstagram } from "react-icons/bs";
import Link from "next/link";
import { FiMessageCircle } from "react-icons/fi";
import { BiCheckCircle, BiDumbbell, BiPhone } from "react-icons/bi";
import { CgMail } from "react-icons/cg";
import { CiLock } from "react-icons/ci";
export default function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/10 py-16">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BiDumbbell className="w-8 h-8 text-orange-500" />
              <span
                className="font-bold text-xl text-white"
                style={{ fontFamily: "Marbeh, sans-serif" }}
              >
                فیت‌کوچ
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
          <div>
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
          <div>
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
          <div>
            <h4
              className="font-bold text-white mb-4"
              style={{ fontFamily: "Marbeh, sans-serif" }}
            >
              اطلاعات تماس
            </h4>
            <div className="space-y-4 text-white/60 text-sm">
              <div className="flex items-start gap-3">
                <BiPhone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">تلفن تماس</div>
                  <div>۰۲۱-۱۲۳۴۵۶۷۸</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CgMail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">ایمیل</div>
                  <div>info@fitcoach.ir</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CiLock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-white mb-1">ساعات پاسخگویی</div>
                  <div>۹ صبح تا ۹ شب</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/50 text-sm text-center md:text-right">
              © ۱۴۰۳ فیت‌کوچ. تمامی حقوق محفوظ است.
            </div>
            <div className="flex flex-wrap gap-6 text-white/50 text-sm">
              <a href="#" className="hover:text-orange-500 transition-colors">
                شرایط و قوانین
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                حریم خصوصی
              </a>
              <a href="#" className="hover:text-orange-500 transition-colors">
                سوالات متداول
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <div className="flex items-center gap-2">
              <BiCheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-white/60 text-sm">پرداخت امن</span>
            </div>
            <div className="flex items-center gap-2">
              <BiCheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-white/60 text-sm">۷ روز ضمانت بازگشت</span>
            </div>
            <div className="flex items-center gap-2">
              <BiCheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-white/60 text-sm">پشتیبانی ۲۴/۷</span>
            </div>
            <div className="flex items-center gap-2">
              <BiCheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-white/60 text-sm">مربیان مجرب</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
