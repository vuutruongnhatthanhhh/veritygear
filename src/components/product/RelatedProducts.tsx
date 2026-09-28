import { getTranslations } from "next-intl/server";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

export default async function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  const t = await getTranslations("productDetail");

  return (
    <section className="border-t border-ink/10 px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-[1600px]">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          {t("suggestionsEyebrow")}
        </p>
        <h2 className="mb-12 max-w-lg font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          {t("suggestionsHeading")}
        </h2>
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
