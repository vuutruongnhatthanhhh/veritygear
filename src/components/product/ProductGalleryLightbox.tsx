"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function ProductGalleryLightbox({
  images,
  alt,
  index,
  onIndexChange,
  onClose,
}: {
  images: string[];
  alt: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, images.length, onClose, onIndexChange]);

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-ink/95">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs font-semibold tracking-[0.1em] text-paper">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-9 w-9 items-center justify-center rounded-full text-paper transition hover:bg-paper/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Clicking this row outside the image itself (the dark padding around
          it) closes the lightbox — same as clicking a backdrop. */}
      <div
        className="relative flex flex-1 items-center justify-center px-3 sm:px-6"
        onClick={onClose}
      >
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index - 1 + images.length) % images.length);
            }}
            aria-label="Ảnh trước"
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition hover:scale-105 sm:left-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        <div
          className="relative aspect-square w-full max-w-md overflow-hidden bg-paper"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            fill
            sizes="(min-width: 640px) 28rem, 90vw"
            className="object-contain"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((index + 1) % images.length);
            }}
            aria-label="Ảnh sau"
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition hover:scale-105 sm:right-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex flex-col items-center gap-4 px-4 pb-6">
          <div className="flex items-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Ảnh ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-paper" : "w-1.5 bg-paper/30"}`}
              />
            ))}
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndexChange(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden border transition ${
                  i === index ? "border-paper" : "border-paper/20"
                }`}
              >
                <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
