import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_ITEMS = [
  {
    quote_vi:
      "Switch của VERTEX X1 mượt đến mức tôi giảm hẳn sai số click trong các pha combat tốc độ cao.",
    quote_en: "The VERTEX X1 switches are so smooth my click errors dropped noticeably in high-speed combat.",
    name: "Minh Quân",
    role_vi: "Valorant Radiant",
    role_en: "Valorant Radiant",
    rating: 5,
  },
  {
    quote_vi: "PHANTOM PRO nhẹ và bám tay hơn hẳn con chuột cũ. Cảm biến chuẩn từng pixel.",
    quote_en: "The PHANTOM PRO is lighter and grips better than my old mouse. Pixel-accurate sensor.",
    name: "Thảo Vy",
    role_vi: "CS2 Semi-pro",
    role_en: "CS2 semi-pro",
    rating: 5,
  },
  {
    quote_vi: "AERO ONE tái tạo bước chân đối thủ cực rõ. Đeo cả ngày không mỏi tai.",
    quote_en: "The AERO ONE reproduces footsteps with amazing clarity. Comfortable all day.",
    name: "Đức Anh",
    role_vi: "Streamer, 120K followers",
    role_en: "Streamer, 120K followers",
    rating: 5,
  },
];

export default async function Testimonials() {
  const locale = await getLocale();
  const t = await getTranslations("testimonials");
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_testimonials")
    .select("quote_vi, quote_en, name, role_vi, role_en, rating, is_active")
    .eq("is_active", true)
    .order("sort_order");

  const items = data && data.length > 0 ? data : FALLBACK_ITEMS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 flex items-end justify-between">
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          {t("heading")}
        </h2>
        <div className="hidden items-center gap-1 text-ink sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 2 3.1 6.7 7.4.8-5.5 5 1.6 7.3L12 18l-6.6 3.8L7 14.5l-5.5-5 7.4-.8Z" />
            </svg>
          ))}
          <span className="ml-2 text-sm font-medium text-ink">{t("ratingSummary")}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-ink/10 pt-12 md:grid-cols-3">
        {items.map((r, i) => (
          <figure key={i} className="flex flex-col">
            <div className="mb-4 flex gap-1 text-ink">
              {Array.from({ length: r.rating ?? 5 }).map((_, j) => (
                <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 3.1 6.7 7.4.8-5.5 5 1.6 7.3L12 18l-6.6 3.8L7 14.5l-5.5-5 7.4-.8Z" />
                </svg>
              ))}
            </div>
            <blockquote className="flex-1 text-[15px] leading-relaxed text-ink">
              “{pick(r.quote_vi, r.quote_en)}”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold">{r.name}</span>
              <span className="text-ink"> — {pick(r.role_vi, r.role_en)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
