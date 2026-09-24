import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_ITEMS = [
  { text_vi: "Miễn phí vận chuyển toàn quốc", text_en: "Free nationwide shipping" },
  { text_vi: "Bảo hành chính hãng 24 tháng", text_en: "24-month official warranty" },
  { text_vi: "Đổi trả trong 30 ngày", text_en: "30-day returns" },
  { text_vi: "Chế tác giới hạn số lượng", text_en: "Limited-run craftsmanship" },
  { text_vi: "Hỗ trợ kỹ thuật 24/7", text_en: "24/7 technical support" },
];

export default async function Marquee() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_marquee_items")
    .select("text_vi, text_en, is_active")
    .eq("is_active", true)
    .order("sort_order");

  const items = data && data.length > 0 ? data : FALLBACK_ITEMS;
  const labels = items.map((item) => (locale === "en" ? item.text_en || item.text_vi : item.text_vi));
  const loop = [...labels, ...labels];

  return (
    <div className="overflow-hidden border-y border-ink/10 bg-ink py-4">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-[13px] font-medium uppercase tracking-[0.18em] text-paper/80"
          >
            {item}
            <span className="text-paper/30">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
