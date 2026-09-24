import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Article } from "@/data/news";
import { formatArticleDate } from "@/data/news";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <Link href={`/tin-tuc/${article.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper">
          {article.category}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ink/40">
          {formatArticleDate(article.date)} · {article.readTime}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold uppercase leading-snug tracking-wide transition-colors group-hover:text-ink/70">
          {article.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-ink/55">
          {article.excerpt}
        </p>
        <span className="mt-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink">
          Đọc tiếp
          <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
