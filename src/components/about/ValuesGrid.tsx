import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

// Icons stay hardcoded and keyed by icon_key — never render SVG markup
// stored in the DB, to avoid an injection vector.
const ICONS: Record<string, React.ReactNode> = {
  precision: <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />,
  noCompromise: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
  durability: <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z" />,
  community: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 21v-1a4.5 4.5 0 0 1 7 0v1" />
    </>
  ),
};

const FALLBACK_VALUES = [
  {
    icon_key: "precision",
    title_vi: "Chính xác tuyệt đối",
    title_en: "Absolute precision",
    desc_vi: "Mỗi chi tiết được đo lường và kiểm định trước khi rời xưởng.",
    desc_en: "Every detail is measured and inspected before it leaves the workshop.",
  },
  {
    icon_key: "noCompromise",
    title_vi: "Không khoan nhượng",
    title_en: "No compromise",
    desc_vi: "Chúng tôi không phát hành sản phẩm chưa vượt qua thử nghiệm thực chiến.",
    desc_en: "We never release a product that hasn't passed real competitive testing.",
  },
  {
    icon_key: "durability",
    title_vi: "Bền vững lâu dài",
    title_en: "Built to last",
    desc_vi: "Vật liệu cao cấp, thiết kế module dễ sửa chữa và nâng cấp.",
    desc_en: "Premium materials, modular design that's easy to repair and upgrade.",
  },
  {
    icon_key: "community",
    title_vi: "Cộng đồng trước tiên",
    title_en: "Community first",
    desc_vi: "Sản phẩm được phát triển cùng phản hồi trực tiếp từ game thủ.",
    desc_en: "Products developed with direct feedback from gamers.",
  },
];

export default async function ValuesGrid() {
  const locale = await getLocale();
  const t = await getTranslations("aboutValues");
  const supabase = await createClient();
  const { data } = await supabase.from("about_values").select("*").order("sort_order");

  const values = data && data.length > 0 ? data : FALLBACK_VALUES;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          {t("eyebrow")}
        </p>
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          {t("headingLine1")}
          <br />
          {t("headingLine2")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {ICONS[v.icon_key] ?? ICONS.precision}
              </svg>
            </span>
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              {pick(v.title_vi, v.title_en)}
            </h3>
            <p className="text-[14px] leading-relaxed text-ink">{pick(v.desc_vi, v.desc_en)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
