import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { pageMetadata } from "@/lib/seo";

// Admin-authored static pages — no generateStaticParams, resolved live from
// Supabase per request (same as every other admin-managed content page).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("custom_pages")
    .select("title_vi, title_en, content_vi, content_en")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!page) return {};

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);
  const title = pick(page.title_vi, page.title_en);
  // Derive a description from the page's own content (strip HTML, clamp length).
  const rawText = pick(page.content_vi, page.content_en)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const description = rawText.slice(0, 160);

  return pageMetadata({
    locale,
    path: `/${slug}`,
    title,
    description,
  });
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const tNav = await getTranslations("nav");
  const supabase = await createClient();
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const { data: row } = await supabase
    .from("custom_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!row) notFound();

  const title = pick(row.title_vi, row.title_en);
  const content = pick(row.content_vi, row.content_en);

  return (
    <article className="mx-auto max-w-5xl px-6 pb-20 pt-24 sm:px-10 sm:pt-28">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
        <Link href="/" className="transition-colors hover:text-ink">
          {tNav("trangChu")}
        </Link>
        <span>/</span>
        <span className="text-ink/70">{title}</span>
      </nav>

      <h1 className="font-display text-3xl font-bold uppercase leading-[1.1] sm:text-4xl">{title}</h1>

      <div
        className="mt-10 max-w-none text-[16px] leading-[1.8] text-ink [&_a]:text-ink [&_a]:underline [&_h1]:mb-4 [&_h1]:mt-10 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:uppercase [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:uppercase [&_img]:my-6 [&_img]:w-full [&_img]:rounded-none [&_li]:mb-1 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_strong]:font-bold [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
