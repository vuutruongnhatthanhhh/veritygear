import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_STATS = [
  { value: "2020", label_vi: "Năm thành lập", label_en: "Year founded" },
  { value: "50K+", label_vi: "Game thủ tin dùng", label_en: "Gamers trust us" },
  { value: "12", label_vi: "Quốc gia phân phối", label_en: "Countries distributed" },
  { value: "4.9/5", label_vi: "Đánh giá trung bình", label_en: "Average rating" },
];

export default async function StatsRow() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_stats").select("value, label_vi, label_en").order("sort_order");

  const stats = data && data.length > 0 ? data : FALLBACK_STATS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="border-y border-ink/10 bg-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-paper/10 sm:px-10 md:grid-cols-4 md:divide-y-0">
        {stats.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <span className="font-display text-4xl font-bold text-paper sm:text-5xl">{s.value}</span>
            <span className="text-[12px] uppercase tracking-[0.14em] text-paper/50">
              {pick(s.label_vi, s.label_en)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
