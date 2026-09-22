"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/providers/CartProvider";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex h-13 items-center border border-ink/20">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          aria-label="Giảm số lượng"
          className="flex h-full w-11 items-center justify-center text-ink/60 transition-colors hover:text-ink"
        >
          −
        </button>
        <span className="flex h-full w-10 items-center justify-center text-sm font-semibold">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          aria-label="Tăng số lượng"
          className="flex h-full w-11 items-center justify-center text-ink/60 transition-colors hover:text-ink"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="h-13 flex-1 min-w-[180px] bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
      >
        {added ? "Đã thêm vào giỏ ✓" : "Thêm vào giỏ"}
      </button>
    </div>
  );
}
