import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";

interface WishlistItem {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  views: number;
}

interface WishlistArticlesProps {
  wishlist: WishlistItem[];
}

export default function WishlistArticles({ wishlist }: WishlistArticlesProps) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">علاقه‌مندی‌های شما</h3>
        <Link
          href="/articles"
          className="text-purple-400 text-xs hover:text-purple-300 flex items-center gap-1"
        >
          مشاهده همه مقالات <ChevronLeft size={14} />
        </Link>
      </div>
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((a) => (
            <Link
              key={a.id}
              href={`/article/${a.slug}`}
              className="rounded-xl p-4 cursor-pointer hover:border-purple-500/40 transition-all group block bg-white/[0.03] border border-white/[0.07]"
            >
              {a.image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-white/5 rounded-lg flex items-center justify-center text-3xl mb-3">
                  📚
                </div>
              )}
              <span className="text-xs px-2 py-0.5 rounded-full mb-2 inline-block bg-purple-500/20 text-purple-300">
                {a.category}
              </span>
              <p className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                {a.title}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-white/40 text-xs bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/20" />
          <p className="mb-2">لیست علاقه‌مندی‌های شما خالی است</p>
          <Link
            href="/articles"
            className="text-purple-400 hover:text-purple-300 font-semibold"
          >
            مشاهده و نشانه‌گذاری مقالات علمی
          </Link>
        </div>
      )}
    </div>
  );
}
