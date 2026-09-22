"use client";

import { useState } from "react";
import type { Product } from "@/data/products";

export default function SpecsCard({ specs }: { specs: Product["specs"] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-2xl border border-ink/10 bg-ink/[0.035] p-6 sm:p-7">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-bold">
          Thông số kỹ thuật
        </span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/20 text-lg leading-none text-ink transition-transform duration-300">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="mt-5 space-y-3">
          {specs.map((spec) => (
            <p key={spec.label} className="text-[14px] leading-relaxed text-ink/60">
              <span className="text-ink/80">{spec.label}:</span> {spec.value}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
