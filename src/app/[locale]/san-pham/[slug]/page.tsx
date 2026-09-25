import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import ProductActions from "@/components/product/ProductActions";
import SpecsCard from "@/components/product/SpecsCard";
import RelatedProducts from "@/components/product/RelatedProducts";
import Newsletter from "@/components/Newsletter";

// Products are managed live from the admin — no generateStaticParams here,
// every request resolves the current catalog (same as every other
// Supabase-backed page in this app).

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, tagline_vi, tagline_en")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) return {};

  const tagline = locale === "en" ? product.tagline_en || product.tagline_vi : product.tagline_vi;

  return {
    title: `${product.name} — VERITY GEAR`,
    description: tagline,
  };
}

const FEATURES = [
  { label: "Bảo hành 24 tháng", desc: "Đổi mới nếu lỗi kỹ thuật" },
  { label: "Đổi trả 30 ngày", desc: "Không cần lý do" },
  { label: "Giao hàng toàn quốc", desc: "Miễn phí từ 1.500.000₫" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const supabase = await createClient();
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  const { data: row } = await supabase
    .from("products")
    .select("*, product_categories(id, name_vi, name_en)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!row) notFound();

  const { data: specRows } = await supabase
    .from("product_specs")
    .select("*")
    .eq("product_id", row.id)
    .order("sort_order");

  const product: Product = {
    slug: row.slug,
    name: row.name,
    category: row.product_categories ? pick(row.product_categories.name_vi, row.product_categories.name_en) : "",
    tagline: pick(row.tagline_vi, row.tagline_en),
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    image: row.image_url ?? "",
    badge: pick(row.badge_vi ?? "", row.badge_en ?? "") || undefined,
    description: pick(row.description_vi, row.description_en),
    specs: (specRows ?? []).map((s) => ({ label: pick(s.label_vi, s.label_en), value: pick(s.value_vi, s.value_en) })),
  };

  let related: Product[] = [];
  if (row.category_id) {
    const { data: relatedRows } = await supabase
      .from("products")
      .select("*, product_categories(name_vi, name_en)")
      .eq("category_id", row.category_id)
      .eq("is_active", true)
      .neq("id", row.id)
      .order("sort_order")
      .limit(4);

    related = (relatedRows ?? []).map((p) => ({
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
  }

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition-colors hover:text-ink">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="transition-colors hover:text-ink">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden bg-ink/5 lg:sticky lg:top-24 lg:self-start">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">
              {product.category}
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink">
              {product.tagline}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="font-display text-2xl font-bold">
                {formatVnd(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink/35 line-through">
                  {formatVnd(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink">
              {product.description}
            </p>

            <div className="mt-8">
              <ProductActions product={product} />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 border-y border-ink/10 py-6 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.label}>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">
                    {f.label}
                  </p>
                  <p className="mt-1 text-[13px] text-ink">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <SpecsCard specs={product.specs} />
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />
      <Newsletter />
    </>
  );
}
