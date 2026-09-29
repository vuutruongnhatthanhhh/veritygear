"use client";

import { useState } from "react";
import Image from "next/image";
import ProductGalleryLightbox from "./ProductGalleryLightbox";

export default function ProductGallery({
  images,
  alt,
  badge,
}: {
  images: string[];
  alt: string;
  badge?: string;
}) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasMultiple = images.length > 1;

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="relative aspect-square overflow-hidden bg-ink/5">
        <Image
          src={images[index]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />

        {/* Tap-to-zoom only makes sense on mobile — desktop already has the
            arrow/thumbnail controls right there, so clicking the image
            shouldn't pop the lightbox open. */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Xem ảnh lớn"
          className="absolute inset-0 h-full w-full lg:hidden"
        />

        {badge && (
          <span className="pointer-events-none absolute left-4 top-4 bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">
            {badge}
          </span>
        )}

        {hasMultiple && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Ảnh trước"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-md transition hover:scale-105"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
        {hasMultiple && (
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Ảnh sau"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink shadow-md transition hover:scale-105"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {hasMultiple && (
        <>
          <div className="mt-4 flex items-center justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ảnh ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/20"}`}
              />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative aspect-square overflow-hidden border bg-ink/5 transition ${
                  i === index ? "border-ink" : "border-transparent hover:border-ink/30"
                }`}
              >
                <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

      {lightboxOpen && (
        <ProductGalleryLightbox
          images={images}
          alt={alt}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
