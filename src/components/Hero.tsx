import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  eyebrow_vi: "Bộ sưu tập 2026 — Precision Series",
  eyebrow_en: "2026 Collection — Precision Series",
  heading_line1_vi: "Unleash Your",
  heading_line2_vi: "Precision",
  heading_line1_en: "Unleash Your",
  heading_line2_en: "Precision",
  body_vi:
    "Phụ kiện gaming cao cấp được chế tác cho những game thủ không khoan nhượng — chính xác đến từng khung hình.",
  body_en:
    "Premium gaming gear crafted for gamers who refuse to compromise — precise down to every frame.",
  cta1_label_vi: "Khám phá bộ sưu tập",
  cta1_label_en: "Explore the collection",
  cta1_url: "#san-pham",
  cta2_label_vi: "Câu chuyện thương hiệu",
  cta2_label_en: "Our brand story",
  cta2_url: "/gioi-thieu",
  image_url: "/images/hero/hero-main.jpg",
};

export default async function Hero() {
  const locale = await getLocale();
  const t = await getTranslations("hero");
  const supabase = await createClient();
  const { data } = await supabase.from("home_hero").select("*").eq("id", 1).single();
  const hero = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink">
      <Image
        src={hero.image_url || FALLBACK.image_url}
        alt={pick(hero.heading_line1_vi, hero.heading_line1_en)}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[75%_center] opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 sm:pb-28">
        <p className="animate-fade-up mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/60">
          {pick(hero.eyebrow_vi, hero.eyebrow_en)}
        </p>
        <h1
          className="animate-fade-up max-w-3xl font-display text-[13vw] font-bold uppercase leading-[1.02] tracking-tight text-paper sm:text-[7vw] lg:text-[6vw]"
          style={{ animationDelay: "0.1s" }}
        >
          {pick(hero.heading_line1_vi, hero.heading_line1_en)}
          <br />
          {pick(hero.heading_line2_vi, hero.heading_line2_en)}
        </h1>
        <p
          className="animate-fade-up mt-8 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          {pick(hero.body_vi, hero.body_en)}
        </p>
        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={hero.cta1_url || FALLBACK.cta1_url}
            className="inline-flex h-13 items-center justify-center bg-paper px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03]"
          >
            {pick(hero.cta1_label_vi, hero.cta1_label_en)}
          </Link>
          <Link
            href={hero.cta2_url || FALLBACK.cta2_url}
            className="inline-flex h-13 items-center justify-center border border-paper/40 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
          >
            {pick(hero.cta2_label_vi, hero.cta2_label_en)}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 sm:right-10 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-paper/50 [writing-mode:vertical-rl]">
          {t("scrollHint")}
        </span>
        <span className="h-14 w-px bg-gradient-to-b from-paper/60 to-transparent" />
      </div>
    </section>
  );
}
