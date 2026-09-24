import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  heading_line1_vi: "Sẵn sàng nâng cấp",
  heading_line2_vi: "trải nghiệm của bạn?",
  heading_line1_en: "Ready to upgrade",
  heading_line2_en: "your experience?",
  body_vi: "Khám phá toàn bộ bộ sưu tập VERITY GEAR — được chế tác cho những ai xem game là một môn nghệ thuật.",
  body_en: "Explore the full VERITY GEAR collection — crafted for those who see gaming as an art form.",
  cta_label_vi: "Khám phá bộ sưu tập",
  cta_label_en: "Explore the collection",
  cta_url: "/san-pham",
};

export default async function AboutCta() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_cta").select("*").eq("id", 1).single();
  const cta = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="border-t border-ink/10 bg-paper py-24 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] sm:text-4xl">
          {pick(cta.heading_line1_vi, cta.heading_line1_en)}
          <br />
          {pick(cta.heading_line2_vi, cta.heading_line2_en)}
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">{pick(cta.body_vi, cta.body_en)}</p>
        <Link
          href={cta.cta_url || FALLBACK.cta_url}
          className="mt-8 inline-flex h-13 items-center justify-center bg-ink px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.03]"
        >
          {pick(cta.cta_label_vi, cta.cta_label_en)}
        </Link>
      </div>
    </section>
  );
}
