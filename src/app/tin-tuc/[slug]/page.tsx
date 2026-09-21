import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, formatArticleDate } from "@/data/news";
import NewsCard from "@/components/news/NewsCard";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} — VERITY GEAR`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
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
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">
          {article.category} · {formatArticleDate(article.date)} ·{" "}
          {article.readTime}
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

        <div className="mt-10 space-y-6">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-[16px] leading-[1.8] text-ink/75">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-ink/10 px-6 py-20 sm:px-10 sm:py-28">
          <div className="mx-auto max-w-[1600px]">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
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
