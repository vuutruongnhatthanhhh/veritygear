"use client";

import { useState } from "react";

const COPY = {
  vi: {
    eyebrow: "Đang bảo trì",
    heading: ["Sắp quay", "trở lại"],
    body: "Chúng tôi đang nâng cấp VERITY GEAR để mang đến trải nghiệm tốt hơn. Vui lòng quay lại sau ít phút.",
  },
  en: {
    eyebrow: "Under maintenance",
    heading: ["Back", "soon"],
    body: "We're upgrading VERITY GEAR for a better experience. Please check back shortly.",
  },
} as const;

export function ComingSoonMessage() {
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const copy = COPY[lang];

  return (
    <>
      <div className="mb-8 flex items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] text-paper/80">
        <button
          type="button"
          onClick={() => setLang("vi")}
          aria-pressed={lang === "vi"}
          className={`transition-opacity ${lang === "vi" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
        >
          VI
        </button>
        <span className="opacity-30">/</span>
        <button
          type="button"
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
          className={`transition-opacity ${lang === "en" ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
        >
          EN
        </button>
      </div>

      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.4em] text-paper/50">{copy.eyebrow}</p>
      <h1 className="font-display text-5xl font-bold uppercase leading-[1.05] text-paper sm:text-7xl">
        {copy.heading[0]}
        <br />
        {copy.heading[1]}
      </h1>
      <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/60">{copy.body}</p>
    </>
  );
}
