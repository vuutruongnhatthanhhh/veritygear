import Image from "next/image";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  eyebrow_vi: "Về chúng tôi",
  eyebrow_en: "About us",
  heading_line1_vi: "Chính xác là",
  heading_line2_vi: "ngôn ngữ của chúng tôi",
  heading_line1_en: "Precision is",
  heading_line2_en: "our language",
  image_url: "/images/about/setup-1.jpg",
};

export default async function AboutHero() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_hero").select("*").eq("id", 1).single();
  const hero = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="relative flex h-[70svh] min-h-[520px] w-full items-end overflow-hidden bg-ink">
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
      </div>
    </section>
  );
}
