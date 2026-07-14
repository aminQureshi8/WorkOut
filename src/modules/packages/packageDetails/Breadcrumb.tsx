import type { BreadcrumbProps } from "@/types/components";
import Link from "next/link";

export default function Breadcrumb({ packageName }: BreadcrumbProps) {
  return (
    <section className="py-6 bg-black/10 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-white/50">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link
            href="/packages"
            className="hover:text-orange-500 transition-colors"
          >
            پکیج‌ها
          </Link>
          <span>/</span>
          <span className="text-white/80 font-medium">
            {packageName}
          </span>
        </div>
      </div>
    </section>
  );
}
