import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/format";

export default async function ProductSpotlight() {
  const locale = await getLocale();
  const supabase = await createClient();

  const [{ data: content }, { data: spotlightRow }] = await Promise.all([
    supabase.from("home_product_spotlight").select("*").eq("id", 1).single(),
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_spotlight", true)
      .order("sort_order")
      .limit(1)
      .maybeSingle(),
  ]);

  let hero = spotlightRow;
  if (!hero) {
    const { data: fallback } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    hero = fallback;
  }

  if (!hero) return null;

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);
  const description = pick(hero.description_vi, hero.description_en) || pick(hero.tagline_vi, hero.tagline_en);
  const eyebrow = content ? pick(content.eyebrow_vi, content.eyebrow_en) : "";
  const ctaLabel = content ? pick(content.cta_label_vi, content.cta_label_en) : "";

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-ink">
      <Image
        src="/images/about/setup-2.jpg"
        alt={hero.name}
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/50">
          {eyebrow}
        </p>
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] text-paper sm:text-6xl">
          {hero.name}
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/65">{description}</p>
        <div className="mt-8 flex items-center gap-4">
          <span className="font-display text-2xl font-bold text-paper">
            {formatVnd(hero.price)}
          </span>
          {hero.compare_at_price && (
            <span className="text-sm text-paper/40 line-through">
              {formatVnd(hero.compare_at_price)}
            </span>
          )}
        </div>
        <Link
          href="#san-pham"
          className="mt-8 inline-flex h-13 w-fit items-center justify-center bg-paper px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03]"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
