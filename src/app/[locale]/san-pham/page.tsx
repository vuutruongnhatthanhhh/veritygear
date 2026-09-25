import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import ShopHero from "@/components/shop/ShopHero";
import ProductsGrid from "@/components/shop/ProductsGrid";
import Newsletter from "@/components/Newsletter";
import { createClient } from "@/lib/supabase/server";
import type { Product, Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Sản phẩm — VERITY GEAR",
  description:
    "Toàn bộ bộ sưu tập phụ kiện gaming VERITY GEAR — bàn phím cơ, chuột gaming, tai nghe, lót chuột và tay cầm cao cấp.",
};

export default async function ShopPage() {
  const locale = await getLocale();
  const supabase = await createClient();

  const [{ data: categoryRows }, { data: productRows }] = await Promise.all([
    supabase.from("product_categories").select("*").order("sort_order"),
    supabase
      .from("products")
      .select("*, product_categories(slug, name_vi, name_en)")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const countByCategory = new Map<number, number>();
  (productRows ?? []).forEach((p) => {
    if (p.category_id) countByCategory.set(p.category_id, (countByCategory.get(p.category_id) ?? 0) + 1);
  });

  const categories: Category[] = (categoryRows ?? []).map((c) => ({
    slug: c.slug,
    name: pick(c.name_vi, c.name_en),
    image: c.image_url ?? "",
    count: countByCategory.get(c.id) ?? 0,
  }));

  const products: (Product & { categorySlug: string })[] = (productRows ?? []).map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.product_categories ? pick(p.product_categories.name_vi, p.product_categories.name_en) : "",
    categorySlug: p.product_categories?.slug ?? "",
    tagline: pick(p.tagline_vi, p.tagline_en),
    price: p.price,
    compareAtPrice: p.compare_at_price ?? undefined,
    image: p.image_url ?? "",
    badge: pick(p.badge_vi ?? "", p.badge_en ?? "") || undefined,
    description: pick(p.description_vi, p.description_en),
    specs: [],
  }));

  return (
    <>
      <ShopHero />
      <Suspense>
        <ProductsGrid categories={categories} products={products} />
      </Suspense>
      <Newsletter />
    </>
  );
}
