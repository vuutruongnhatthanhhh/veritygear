import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatArticleDate } from "@/lib/format";
import type { Article } from "@/lib/types";
import NewsCard from "@/components/news/NewsCard";

// Articles are managed live from the admin — no generateStaticParams here,
// every request resolves the current catalog (same as the product detail page).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("news_articles")
    .select("title_vi, title_en, excerpt_vi, excerpt_en")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!article) return {};

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return {
    title: `${pick(article.title_vi, article.title_en)} — VERITY GEAR`,
    description: pick(article.excerpt_vi, article.excerpt_en),
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations("news");
  const supabase = await createClient();
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const { data: row } = await supabase
    .from("news_articles")
    .select("*, news_categories(id, slug, name_vi, name_en)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!row) notFound();

  const article: Article = {
    slug: row.slug,
    title: pick(row.title_vi, row.title_en),
    excerpt: pick(row.excerpt_vi, row.excerpt_en),
    content: pick(row.content_vi, row.content_en),
    image: row.image_url ?? "",
    category: row.news_categories ? pick(row.news_categories.name_vi, row.news_categories.name_en) : "",
    categorySlug: row.news_categories?.slug ?? "",
    date: formatArticleDate(row.published_at, locale),
    readTime: t("readTime", { count: row.read_minutes }),
  };

  let related: Article[] = [];
  if (row.category_id) {
    const { data: relatedRows } = await supabase
      .from("news_articles")
      .select("*, news_categories(slug, name_vi, name_en)")
      .eq("category_id", row.category_id)
      .eq("is_active", true)
      .neq("id", row.id)
      .order("published_at", { ascending: false })
      .limit(3);

    related = (relatedRows ?? []).map((a) => ({
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
  }

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
          <Link href="/" className="transition-colors hover:text-ink">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/tin-tuc" className="transition-colors hover:text-ink">
            Tin tức
          </Link>
        </nav>
      </div>

      <article className="mx-auto max-w-5xl px-6 py-10 sm:px-10 sm:py-14">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
          {article.category} · {article.date} · {article.readTime}
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.1] sm:text-5xl">
          {article.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden bg-ink/5">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>

        <div
          className="mt-10 max-w-none text-[16px] leading-[1.8] text-ink [&_a]:text-ink [&_a]:underline [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:uppercase [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:uppercase [&_img]:my-6 [&_img]:w-full [&_img]:rounded-none [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {related.length > 0 && (
        <section className="border-t border-ink/10 px-6 py-20 sm:px-10 sm:py-28">
          <div className="mx-auto max-w-[1600px]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
              Đọc thêm
            </p>
            <h2 className="mb-12 max-w-lg font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
