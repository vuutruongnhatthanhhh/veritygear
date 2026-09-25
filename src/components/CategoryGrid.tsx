import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/types";

export default async function CategoryGrid() {
  const locale = await getLocale();
  const t = await getTranslations("categoryGrid");
  const supabase = await createClient();
  const [{ data: content }, { data: categoryRows }, { data: productRows }] = await Promise.all([
    supabase.from("home_category_grid").select("*").eq("id", 1).single(),
    supabase.from("product_categories").select("*").eq("show_on_homepage", true).order("sort_order"),
    supabase.from("products").select("category_id").eq("is_active", true),
  ]);

  const countByCategory = new Map<number, number>();
  (productRows ?? []).forEach((p) => {
    if (p.category_id) countByCategory.set(p.category_id, (countByCategory.get(p.category_id) ?? 0) + 1);
  });

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const categories: Category[] = (categoryRows ?? []).map((c) => ({
    slug: c.slug,
    name: pick(c.name_vi, c.name_en),
    image: c.image_url ?? "",
    count: countByCategory.get(c.id) ?? 0,
  }));

  if (categories.length === 0) return null;

  const eyebrow = content ? pick(content.eyebrow_vi, content.eyebrow_en) : "";
  const headingLine1 = content ? pick(content.heading_line1_vi, content.heading_line1_en) : "";
  const headingLine2 = content ? pick(content.heading_line2_vi, content.heading_line2_en) : "";
  const description = content ? pick(content.description_vi, content.description_en) : "";

  return (
    <section id="danh-muc" className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
            {eyebrow}
          </p>
          <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
            {headingLine1}
            <br />
            {headingLine2}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/san-pham?danh-muc=${cat.slug}`}
            className={`group relative flex flex-col justify-end overflow-hidden bg-ink ${
              i === 0
                ? "col-span-2 aspect-16/10 md:col-span-2 md:row-span-2 md:aspect-auto"
                : "aspect-square md:aspect-square"
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent" />
            <div className="relative z-10 flex items-end justify-between p-5">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-paper/60">{t("productCount", { count: cat.count })}</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-transform duration-500 group-hover:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
