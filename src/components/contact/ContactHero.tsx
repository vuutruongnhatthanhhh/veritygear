import Image from "next/image";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  eyebrow_vi: "Liên hệ",
  eyebrow_en: "Contact",
  heading_line1_vi: "Chúng tôi",
  heading_line2_vi: "luôn lắng nghe",
  heading_line1_en: "We are",
  heading_line2_en: "always listening",
  body_vi: "Có câu hỏi về sản phẩm, đơn hàng hay hợp tác? Đội ngũ VERITY GEAR phản hồi trong vòng 24 giờ.",
  body_en: "Questions about products, orders, or partnerships? The VERITY GEAR team replies within 24 hours.",
  image_url: "/images/about/setup-1.jpg",
};

export default async function ContactHero() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("contact_hero").select("*").eq("id", 1).single();
  const hero = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="relative flex h-[55svh] min-h-[420px] w-full items-end overflow-hidden bg-ink">
      <Image
        src={hero.image_url || FALLBACK.image_url}
        alt={pick(hero.heading_line1_vi, hero.heading_line1_en)}
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 sm:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/60">
          {pick(hero.eyebrow_vi, hero.eyebrow_en)}
        </p>
        <h1 className="max-w-2xl font-display text-5xl font-bold uppercase leading-[1.28] text-paper sm:text-7xl">
          {pick(hero.heading_line1_vi, hero.heading_line1_en)}
          <br />
          {pick(hero.heading_line2_vi, hero.heading_line2_en)}
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-paper/65 sm:text-lg">
          {pick(hero.body_vi, hero.body_en)}
        </p>
      </div>
    </section>
  );
}
