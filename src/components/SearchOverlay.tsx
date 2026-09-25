"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatVnd } from "@/lib/format";

type SearchProduct = { slug: string; name: string; category: string; tagline: string; price: number; image: string };

type CatalogRow = {
  slug: string;
  name: string;
  tagline_vi: string;
  tagline_en: string;
  price: number;
  image_url: string | null;
  product_categories: { name_vi: string; name_en: string } | null;
};

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const [query, setQuery] = useState("");
  const [catalog, setCatalog] = useState<SearchProduct[]>([]);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      // Clear the query once the close animation starts so the overlay
      // doesn't flash stale results the next time it opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
    }
  }, [open]);

  // Fetch the active catalog once, the first time the overlay is opened —
  // there's no synchronous local array to search anymore, but the dataset
  // is small enough to load in full and filter client-side like before.
  useEffect(() => {
    if (!open || loaded) return;
    const supabase = createClient();
    supabase
      .from("products")
      .select("slug, name, tagline_vi, tagline_en, price, image_url, category_id, product_categories(name_vi, name_en)")
      .eq("is_active", true)
      .returns<CatalogRow[]>()
      .then(({ data }) => {
        const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);
        setCatalog(
          (data ?? []).map((p) => ({
            slug: p.slug,
            name: p.name,
            category: p.product_categories ? pick(p.product_categories.name_vi, p.product_categories.name_en) : "",
            tagline: pick(p.tagline_vi, p.tagline_en),
            price: p.price,
            image: p.image_url ?? "",
          })),
        );
        setLoaded(true);
      });
  }, [open, loaded, locale]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, catalog]);

  return (
    <div
      className={`fixed inset-0 z-60 transition-opacity duration-300 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <button
        type="button"
        aria-label="Đóng tìm kiếm"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      <div
        className={`relative mx-auto max-w-[1600px] px-6 pt-24 transition-transform duration-300 sm:px-10 sm:pt-32 ${
          open ? "translate-y-0" : "-translate-y-4"
        }`}
      >
        <div className="mx-auto max-w-2xl bg-paper p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-4 border-b border-ink/15 pb-4">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="shrink-0 text-ink/40"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-transparent font-display text-xl font-bold uppercase text-ink placeholder:text-ink/30 focus:outline-none sm:text-2xl"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng"
              className="shrink-0 text-ink/40 transition-colors hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            {query.trim() === "" ? (
              <p className="py-10 text-center text-sm text-ink/40">
                Nhập tên sản phẩm hoặc danh mục bạn muốn tìm.
              </p>
            ) : results.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink/40">
                Không tìm thấy sản phẩm phù hợp với “{query}”.
              </p>
            ) : (
              <ul className="divide-y divide-ink/10">
                {results.map((product) => (
                  <li key={product.slug}>
                    <Link
                      href={`/san-pham/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-4"
                    >
                      <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ink/5">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] uppercase tracking-[0.1em] text-ink/40">
                          {product.category}
                        </p>
                        <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                          {product.name}
                        </h3>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">
                        {formatVnd(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {results.length > 0 && (
            <Link
              href="/san-pham"
              onClick={onClose}
              className="mt-4 flex h-12 w-full items-center justify-center border border-ink/20 text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-colors hover:border-ink"
            >
              Xem toàn bộ cửa hàng
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
