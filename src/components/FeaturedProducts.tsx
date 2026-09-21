import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  return (
    <section id="san-pham" className="bg-paper px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
              Best sellers
            </p>
            <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
              Sản phẩm nổi bật
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink"
          >
            Xem toàn bộ cửa hàng
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
