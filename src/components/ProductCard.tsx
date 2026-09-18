import Image from "next/image";
import type { Product } from "@/data/products";
import { formatVnd } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper">
            {product.badge}
          </span>
        )}
        <button className="absolute inset-x-3 bottom-3 translate-y-12 bg-paper py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Thêm vào giỏ
        </button>
      </div>
      <div className="mt-4 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-ink/40">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-base font-bold uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-ink/55">
            {product.tagline}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm font-semibold">{formatVnd(product.price)}</span>
        {product.compareAtPrice && (
          <span className="text-xs text-ink/35 line-through">
            {formatVnd(product.compareAtPrice)}
          </span>
        )}
      </div>
    </div>
  );
}
