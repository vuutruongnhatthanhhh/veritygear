"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import type { Product } from "@/data/products";
import { formatVnd } from "@/data/products";
import { useCart } from "@/components/providers/CartProvider";

export default function ProductCard({ product }: { product: Product }) {
  const href = `/san-pham/${product.slug}`;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.slug, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <Link href={href} className="absolute inset-0 z-0" tabIndex={-1} aria-hidden="true">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-paper">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          onClick={handleAdd}
          className={`absolute inset-x-3 bottom-3 z-10 bg-paper py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${
            added ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          {added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ"}
        </button>
      </div>
      <Link href={href} className="mt-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold uppercase tracking-wide">
            {product.name}
          </h3>
          <p className="mt-1 text-[13px] leading-snug text-ink">
            {product.tagline}
          </p>
        </div>
      </Link>
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
