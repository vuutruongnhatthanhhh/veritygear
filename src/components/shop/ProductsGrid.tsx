"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const FILTERS = [{ slug: "tat-ca", name: "Tất cả" }, ...categories];

export default function ProductsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requested = searchParams.get("danh-muc") ?? "tat-ca";
  const active = FILTERS.some((f) => f.slug === requested)
    ? requested
    : "tat-ca";

  const filtered = useMemo(() => {
    if (active === "tat-ca") return products;
    const category = categories.find((c) => c.slug === active);
    return products.filter((p) => p.category === category?.name);
  }, [active]);

  function handleFilter(slug: string) {
    const url = slug === "tat-ca" ? "/san-pham" : `/san-pham?danh-muc=${slug}`;
    router.replace(url, { scroll: false });
  }

  return (
    <section id="danh-sach" className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 sm:py-20">
      <div className="mb-10 flex flex-wrap items-center gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.slug}
            onClick={() => handleFilter(f.slug)}
            className={`h-10 px-5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              active === f.slug
                ? "bg-ink text-paper"
                : "border border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
            }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      <p className="mb-8 text-[13px] text-ink/40">
        Hiển thị {filtered.length} sản phẩm
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-ink/50">
          Chưa có sản phẩm trong danh mục này.
        </p>
      )}
    </section>
  );
}
