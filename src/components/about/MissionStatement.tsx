import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  eyebrow_vi: "Sứ mệnh",
  eyebrow_en: "Mission",
  body_vi:
    "Chúng tôi tin rằng mỗi mili-giây đều quan trọng. VERITY GEAR sinh ra để loại bỏ mọi rào cản giữa phản xạ của game thủ và kết quả trên màn hình — không thỏa hiệp, không dư thừa, chỉ có sự chính xác thuần khiết.",
  body_en:
    "We believe every millisecond matters. VERITY GEAR exists to remove every barrier between a gamer's reflex and the result on screen — no compromise, no excess, just pure precision.",
};

export default async function MissionStatement() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_mission").select("*").eq("id", 1).single();
  const mission = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
      <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        {pick(mission.eyebrow_vi, mission.eyebrow_en)}
      </p>
      <p className="font-display text-2xl font-medium leading-snug tracking-tight sm:text-4xl">
        {pick(mission.body_vi, mission.body_en)}
      </p>
    </section>
  );
}
