"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Article, NewsCategory } from "@/lib/types";
import NewsCard from "./NewsCard";

export default function NewsGrid({
  categories,
  articles,
}: {
  categories: NewsCategory[];
  articles: Article[];
}) {
  const t = useTranslations("news");
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => [{ slug: "tat-ca", name: t("all") }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))],
    [categories, t],
  );

  const requested = searchParams.get("chu-de") ?? "tat-ca";
  const active = filters.some((f) => f.slug === requested) ? requested : "tat-ca";

  const filtered = useMemo(() => {
    if (active === "tat-ca") return articles;
    return articles.filter((a) => a.categorySlug === active);
  }, [articles, active]);

  function handleFilter(slug: string) {
    const url = slug === "tat-ca" ? "/tin-tuc" : `/tin-tuc?chu-de=${slug}`;
    router.replace(url, { scroll: false });
  }

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <button
            key={f.slug}
            onClick={() => handleFilter(f.slug)}
            className={`h-10 px-5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              active === f.slug
                ? "bg-ink text-paper"
                : "border border-ink/20 text-ink hover:border-ink"
            }`}
          >
            {f.name}
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
        <p className="py-20 text-center text-ink/50">{t("empty")}</p>
      )}
    </section>
  );
}
