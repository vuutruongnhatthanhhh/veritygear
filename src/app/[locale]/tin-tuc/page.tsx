import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import NewsHero from "@/components/news/NewsHero";
import NewsGrid from "@/components/news/NewsGrid";
import Newsletter from "@/components/Newsletter";
import { createClient } from "@/lib/supabase/server";
import { formatArticleDate } from "@/lib/format";
import type { Article, NewsCategory } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tin tức — VERITY GEAR",
  description:
    "Cập nhật tin tức mới nhất từ VERITY GEAR — ra mắt sản phẩm, sự kiện esports và hướng dẫn chọn phụ kiện gaming.",
};

export default async function NewsPage() {
  const locale = await getLocale();
  const t = await getTranslations("news");
  const supabase = await createClient();

  const [{ data: categoryRows }, { data: articleRows }] = await Promise.all([
    supabase.from("news_categories").select("*").order("sort_order"),
    supabase
      .from("news_articles")
      .select("*, news_categories(slug, name_vi, name_en)")
      .eq("is_active", true)
      .order("published_at", { ascending: false }),
  ]);

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const categories: NewsCategory[] = (categoryRows ?? []).map((c) => ({
    slug: c.slug,
    name: pick(c.name_vi, c.name_en),
  }));

  const articles: Article[] = (articleRows ?? []).map((a) => ({
    slug: a.slug,
    title: pick(a.title_vi, a.title_en),
    excerpt: pick(a.excerpt_vi, a.excerpt_en),
    content: "",
    image: a.image_url ?? "",
    category: a.news_categories ? pick(a.news_categories.name_vi, a.news_categories.name_en) : "",
    categorySlug: a.news_categories?.slug ?? "",
    date: formatArticleDate(a.published_at, locale),
    readTime: t("readTime", { count: a.read_minutes }),
  }));

  return (
    <>
      <NewsHero />
      <Suspense>
        <NewsGrid categories={categories} articles={articles} />
      </Suspense>
      <Newsletter />
    </>
  );
}
