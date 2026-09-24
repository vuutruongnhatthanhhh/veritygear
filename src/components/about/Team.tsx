import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_TEAM = [
  { name: "Đăng Khoa", role_vi: "Nhà sáng lập & CEO", role_en: "Founder & CEO", image_url: "/images/about/team-1.jpg" },
  { name: "Linh Chi", role_vi: "Trưởng phòng thiết kế", role_en: "Head of Design", image_url: "/images/about/team-2.jpg" },
  { name: "Quang Huy", role_vi: "Trưởng phòng sản phẩm", role_en: "Head of Product", image_url: "/images/about/team-3.jpg" },
  { name: "Bảo Trân", role_vi: "Quản lý cộng đồng", role_en: "Community Manager", image_url: "/images/about/team-4.jpg" },
];

export default async function Team() {
  const locale = await getLocale();
  const t = await getTranslations("aboutTeam");
  const supabase = await createClient();
  const { data } = await supabase.from("about_team_members").select("*").order("sort_order");

  const team = data && data.length > 0 ? data : FALLBACK_TEAM;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">{t("eyebrow")}</p>
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          {t("heading")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {team.map((member, i) => (
          <div key={i} className="group relative overflow-hidden bg-ink">
            <div className="relative aspect-3/4 w-full">
              <Image
                src={member.image_url || "/images/about/team-1.jpg"}
                alt={member.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <span className="absolute left-0 top-0 h-[2px] w-0 bg-paper transition-all duration-500 ease-out group-hover:w-full" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-base font-bold text-paper">{member.name}</h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
                  {pick(member.role_vi, member.role_en)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
