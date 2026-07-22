import Link from "next/link";
import { BiDumbbell } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";

export default function HeroSection() {
  return (
    <div className="container mx-auto">
      <section className="relative overflow-hidden">
        <div className="py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl font-morabbaReg md:text-6xl font-bold text-white leading-tight">
                بدن رویایی خود را بسازید
              </h1>
              <p className="text-xl  text-white/80 font-danaMed">
                با برنامه‌های تمرینی تخصصی و مربیگری حرفه‌ای، به اهداف فیتنس خود
                برسید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 font-danaMed">
                <Link
                  href="/packages"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg transition-colors text-center flex items-center justify-center gap-2"
                >
                  <span>مشاهده پکیج‌ها</span>
                  <BsArrowLeft className="w-5 h-5" />
                </Link>
                <button className="border-2 border-white/30 hover:border-orange-500 text-white px-8 py-4 rounded-lg transition-colors">
                  مشاوره رایگان
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square -z-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                <BiDumbbell className="w-32 h-32 text-amber-500/50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
