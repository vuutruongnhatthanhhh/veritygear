import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { NewsletterForm } from "./newsletter/NewsletterForm";

const FALLBACK = {
  eyebrow_vi: "Vòng tròn nội bộ",
  eyebrow_en: "Inner circle",
  heading_vi: "Nhận ưu đãi trước tiên",
  heading_en: "Be the first to know",
  body_vi: "Đăng ký để nhận thông tin drop giới hạn, ưu đãi độc quyền và tin tức mới nhất từ VERITY GEAR.",
  body_en: "Sign up for limited drops, exclusive offers, and the latest news from VERITY GEAR.",
};

export default async function Newsletter() {
  const locale = await getLocale();
  const t = await getTranslations("newsletter");
  const supabase = await createClient();
  const { data } = await supabase.from("home_newsletter").select("*").eq("id", 1).single();
  const newsletter = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <NewsletterForm
      eyebrow={pick(newsletter.eyebrow_vi, newsletter.eyebrow_en)}
      heading={pick(newsletter.heading_vi, newsletter.heading_en)}
      body={pick(newsletter.body_vi, newsletter.body_en)}
      subscribedLabel={t("subscribed")}
      placeholder={t("placeholder")}
      submitLabel={t("submit")}
      submittingLabel={t("submitting")}
      errorLabel={t("error")}
    />
  );
}
