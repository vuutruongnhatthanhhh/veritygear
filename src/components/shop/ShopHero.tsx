import Image from "next/image";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/public";

const FALLBACK = {
  eyebrow_vi: "Cửa hàng",
  eyebrow_en: "Shop",
  heading_line1_vi: "Toàn bộ",
  heading_line2_vi: "bộ sưu tập",
  heading_line1_en: "The entire",
  heading_line2_en: "collection",
  image_url: "/images/products/keyboard-2.jpg",
};

export default async function ShopHero() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("shop_hero").select("*").eq("id", 1).single();
  const hero = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="relative flex h-[50svh] min-h-[380px] w-full items-end overflow-hidden bg-ink">
      <Image
        src={hero.image_url || FALLBACK.image_url}
        alt={pick(hero.heading_line1_vi, hero.heading_line1_en)}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-14 pt-32 sm:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/60">
          {pick(hero.eyebrow_vi, hero.eyebrow_en)}
        </p>
        <h1 className="max-w-2xl font-display text-5xl font-bold uppercase leading-[1.28] text-paper sm:text-7xl">
          {pick(hero.heading_line1_vi, hero.heading_line1_en)}
          <br />
          {pick(hero.heading_line2_vi, hero.heading_line2_en)}
        </h1>
      </div>
    </section>
  );
}
