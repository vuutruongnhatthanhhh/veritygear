import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const locale = await getLocale();
  const supabase = await createClient();
  const [{ data: content }, { data }] = await Promise.all([
    supabase.from("home_featured_products").select("*").eq("id", 1).single(),
    supabase
      .from("products")
      .select("*, product_categories(name_vi, name_en)")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order"),
  ]);

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const eyebrow = content ? pick(content.eyebrow_vi, content.eyebrow_en) : "";
  const heading = content ? pick(content.heading_vi, content.heading_en) : "";
  const viewAll = content ? pick(content.view_all_label_vi, content.view_all_label_en) : "";

  const products: Product[] = (data ?? []).map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.product_categories ? pick(p.product_categories.name_vi, p.product_categories.name_en) : "",
    tagline: pick(p.tagline_vi, p.tagline_en),
    price: p.price,
    compareAtPrice: p.compare_at_price ?? undefined,
    image: p.image_url ?? "",
    badge: pick(p.badge_vi ?? "", p.badge_en ?? "") || undefined,
    description: pick(p.description_vi, p.description_en),
    specs: [],
  }));

  if (products.length === 0) return null;

  return (
    <section id="san-pham" className="bg-paper px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
              {eyebrow}
            </p>
            <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
              {heading}
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
          >
            {viewAll}
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
