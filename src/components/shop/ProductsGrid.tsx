"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Product, Category } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type ShopProduct = Product & { categorySlug: string };

export default function ProductsGrid({
  categories,
  products,
}: {
  categories: Category[];
  products: ShopProduct[];
}) {
  const t = useTranslations("shop");
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => [{ slug: "tat-ca", name: t("all") }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))],
    [categories, t],
  );

  const requested = searchParams.get("danh-muc") ?? "tat-ca";
  const active = filters.some((f) => f.slug === requested) ? requested : "tat-ca";

  const filtered = useMemo(() => {
    if (active === "tat-ca") return products;
    return products.filter((p) => p.categorySlug === active);
  }, [products, active]);

  function handleFilter(slug: string) {
    const url = slug === "tat-ca" ? "/san-pham" : `/san-pham?danh-muc=${slug}`;
    router.replace(url, { scroll: false });
  }

  return (
    <section id="danh-sach" className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
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

      <p className="mb-8 text-[13px] text-ink">{t("count", { count: filtered.length })}</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink/50">{t("empty")}</p>
      )}
    </section>
  );
}
