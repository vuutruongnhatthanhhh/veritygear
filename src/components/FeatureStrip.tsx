import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

// Icons stay hardcoded and keyed by icon_key — never render SVG markup
// stored in the DB, to avoid an injection vector.
const ICONS: Record<string, React.ReactNode> = {
  precision: <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />,
  warranty: <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z" />,
  shipping: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  community: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 21v-1a4.5 4.5 0 0 1 7 0v1" />
    </>
  ),
};

const FALLBACK_ITEMS = [
  {
    icon_key: "precision",
    title_vi: "Chế tác chính xác",
    title_en: "Precision-engineered",
    desc_vi: "Dung sai gia công 0.02mm, kiểm định từng lô hàng.",
    desc_en: "0.02mm manufacturing tolerance, every batch inspected.",
  },
  {
    icon_key: "warranty",
    title_vi: "Bảo hành 24 tháng",
    title_en: "24-month warranty",
    desc_vi: "Đổi mới miễn phí nếu lỗi kỹ thuật từ nhà sản xuất.",
    desc_en: "Free replacement for manufacturing defects.",
  },
  {
    icon_key: "shipping",
    title_vi: "Giao hàng toàn quốc",
    title_en: "Nationwide shipping",
    desc_vi: "Miễn phí vận chuyển cho đơn từ 1.500.000₫.",
    desc_en: "Free shipping on orders over 1,500,000₫.",
  },
  {
    icon_key: "community",
    title_vi: "Cộng đồng game thủ",
    title_en: "Gamer community",
    desc_vi: "Hơn 50.000 game thủ đang tin dùng VERITY GEAR.",
    desc_en: "Trusted by over 50,000 gamers.",
  },
];

export default async function FeatureStrip() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_feature_strip_items")
    .select("icon_key, title_vi, title_en, desc_vi, desc_en")
    .order("sort_order");

  const items = data && data.length > 0 ? data : FALLBACK_ITEMS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="border-y border-ink/10 bg-paper">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-ink/10 px-0 sm:px-10 md:grid-cols-4 md:divide-y-0">
        {items.map((f, i) => (
          <div key={i} className="flex flex-col gap-4 px-6 py-10">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ink"
            >
              {ICONS[f.icon_key] ?? ICONS.precision}
            </svg>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em]">
              {pick(f.title_vi, f.title_en)}
            </h3>
            <p className="text-[13px] leading-relaxed text-ink">{pick(f.desc_vi, f.desc_en)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
