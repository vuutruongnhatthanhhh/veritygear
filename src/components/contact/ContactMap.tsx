import { getLocale, getTranslations } from "next-intl/server";
import SocialLinks from "@/components/SocialLinks";
import { createClient } from "@/lib/supabase/server";
import { toSocialLinks } from "@/lib/socialLinks";

const FALLBACK = {
  heading_vi: "Vị trí cửa hàng",
  heading_en: "Store location",
  footer_label_vi: "Nhấn để mở chỉ đường",
  footer_label_en: "Tap to get directions",
  map_embed_url:
    "https://www.google.com/maps?q=268+%C4%90i%E1%BB%87n+Bi%C3%AAn+Ph%E1%BB%A7,+Ph%C6%B0%E1%BB%9Dng+7,+Qu%E1%BA%ADn+3,+TP.+H%E1%BB%93+Ch%C3%AD+Minh&output=embed",
};

export default async function ContactMap() {
  const locale = await getLocale();
  const t = await getTranslations("contactMap");
  const supabase = await createClient();
  const [{ data: mapData }, { data: socialRow }] = await Promise.all([
    supabase.from("contact_map").select("*").eq("id", 1).single(),
    supabase.from("site_social_links").select("*").eq("id", 1).single(),
  ]);
  const map = { ...FALLBACK, ...mapData };
  const socialLinks = toSocialLinks(socialRow);

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        {pick(map.heading_vi, map.heading_en)}
      </p>
      <div className="overflow-hidden border border-ink/15">
        <div className="relative aspect-4/3 w-full">
          <iframe
            title="Bản đồ VERITY GEAR"
            src={map.map_embed_url || FALLBACK.map_embed_url}
            className="absolute inset-0 h-full w-full grayscale contrast-125"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="border-t border-ink/15 px-4 py-3 text-[12px] font-medium text-ink/50">
          {pick(map.footer_label_vi, map.footer_label_en)}
        </div>
      </div>

      <div className="mt-8 border border-ink/15 bg-ink/[0.03] p-6">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
          {t("followUs")}
        </p>
        <SocialLinks links={socialLinks} variant="light" />
      </div>
    </div>
  );
}
