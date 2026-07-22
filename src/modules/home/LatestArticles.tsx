import Link from "next/link";
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  readingTime: string;
  authorName: string;
  authorInitial: string;
  publishDate: string;
}

interface LatestArticlesProps {
  articles: Article[];
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="py-20 bg-black/20 font-danaMed">
      <div className="container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-morabbaReg">
              جدیدترین مقالات
            </h2>
            <p className="text-white/70">آخرین نکات و راهنماهای تمرینی</p>
          </div>
          <Link
            href="/articles"
            className="text-amber-500 hover:text-amber-400 flex items-center gap-2"
          >
            <span>مشاهده همه</span>
            <BsArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {articles && articles.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/article/${a.slug}`}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all hover:scale-105 cursor-pointer flex flex-col"
              >
                <div className="aspect-video bg-linear-to-br from-orange-500/20 to-purple-500/20 relative flex items-center justify-center overflow-hidden">
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-6xl">📝</span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                        {a.category}
                      </span>
                      <span className="text-xs text-white/50">{a.readingTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-white/70 text-sm line-clamp-2 mb-4">
                      {a.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/60 pt-4 border-t border-white/5">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-sm font-bold text-orange-400">
                      {a.authorInitial}
                    </div>
                    <span>{a.authorName}</span>
                    <span className="text-white/40">•</span>
                    <span>{a.publishDate}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white/40 text-sm border border-dashed border-white/10 rounded-2xl">
            مقاله‌ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </section>
  );
}
