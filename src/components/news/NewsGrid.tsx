"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { articles, newsCategories } from "@/data/news";
import NewsCard from "./NewsCard";

const FILTERS = ["Tất cả", ...newsCategories];

export default function NewsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("chu-de") ?? "Tất cả";
  const active = FILTERS.includes(requested) ? requested : "Tất cả";

  const filtered = useMemo(() => {
    if (active === "Tất cả") return articles;
    return articles.filter((a) => a.category === active);
  }, [active]);

  function handleFilter(category: string) {
    const url =
      category === "Tất cả"
        ? "/tin-tuc"
        : `/tin-tuc?chu-de=${encodeURIComponent(category)}`;
    router.replace(url, { scroll: false });
  }

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        {FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => handleFilter(c)}
            className={`h-10 px-5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              active === c
                ? "bg-ink text-paper"
                : "border border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink/50">
          Chưa có bài viết trong chủ đề này.
        </p>
      )}
    </section>
  );
}
