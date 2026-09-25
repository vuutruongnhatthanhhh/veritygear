import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_MILESTONES = [
  {
    year: "2020",
    title_vi: "Khởi đầu tại Việt Nam",
    title_en: "Founded in Vietnam",
    desc_vi: "VERITY GEAR ra đời trong một xưởng nhỏ với dòng sản phẩm đầu tiên: VERTEX Series bàn phím cơ.",
    desc_en: "VERITY GEAR was born in a small workshop with its first product line: the VERTEX Series mechanical keyboards.",
  },
  {
    year: "2021",
    title_vi: "Ra mắt dòng PHANTOM",
    title_en: "Launched the PHANTOM line",
    desc_vi: "Bộ đôi chuột gaming không dây đầu tiên — sản phẩm định hình tên tuổi thương hiệu.",
    desc_en: "Our first pair of wireless gaming mice — the products that defined our brand.",
  },
  {
    year: "2022",
    title_vi: "Mở rộng khu vực Đông Nam Á",
    title_en: "Expanded across Southeast Asia",
    desc_vi: "VERITY GEAR có mặt tại hơn 8 quốc gia, mở rộng mạng lưới đại lý và nhà phân phối chính hãng.",
    desc_en: "VERITY GEAR reached over 8 countries, expanding our network of authorized dealers and distributors.",
  },
  {
    year: "2024",
    title_vi: "50.000 game thủ tin dùng",
    title_en: "50,000 gamers trust us",
    desc_vi: "Cộng đồng VERITY GEAR cán mốc 50.000 game thủ trên toàn cầu, cùng dòng tai nghe AERO ra mắt.",
    desc_en: "The VERITY GEAR community reached 50,000 gamers worldwide, alongside the launch of the AERO headset line.",
  },
  {
    year: "2026",
    title_vi: "12 quốc gia và tiếp tục phát triển",
    title_en: "12 countries and still growing",
    desc_vi: "Hôm nay, VERITY GEAR hiện diện tại 12 quốc gia với đánh giá trung bình 4.9/5 từ hơn 3.200 khách hàng.",
    desc_en: "Today, VERITY GEAR is present in 12 countries with an average rating of 4.9/5 from over 3,200 customers.",
  },
];

export default async function Timeline() {
  const locale = await getLocale();
  const t = await getTranslations("milestonesTimeline");
  const supabase = await createClient();
  const { data } = await supabase.from("milestones_timeline").select("*").order("sort_order");

  const milestones = data && data.length > 0 ? data : FALLBACK_MILESTONES;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="border-y border-ink/10 bg-ink/[0.035] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">{t("eyebrow")}</p>
          <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute bottom-2 left-[27px] top-2 hidden w-px bg-ink/50 sm:block" />
          <div className="space-y-6">
            {milestones.map((item, i) => (
              <div key={i} className="relative flex gap-6 sm:gap-8">
                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-center">
                  <div className="flex h-14 w-14 items-center justify-center border border-ink bg-[#efefee] text-[11px] font-bold text-ink">
                    {item.year}
                  </div>
                </div>
                <div className="flex-1 border border-ink/40 bg-[#efefee] p-6">
                  <div className="mb-1 text-[11px] font-bold tracking-[0.2em] text-ink/50 sm:hidden">
                    {item.year}
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                    {pick(item.title_vi, item.title_en)}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{pick(item.desc_vi, item.desc_en)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
