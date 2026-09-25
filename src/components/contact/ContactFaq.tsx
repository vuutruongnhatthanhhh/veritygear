import { getLocale, getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_FAQS = [
  {
    question_vi: "Thời gian giao hàng mất bao lâu?",
    question_en: "How long does shipping take?",
    answer_vi: "Đơn hàng nội thành giao trong 1–2 ngày làm việc. Các tỉnh thành khác từ 2–5 ngày làm việc.",
    answer_en: "Orders within the city arrive in 1–2 business days. Other provinces take 2–5 business days.",
  },
  {
    question_vi: "Tôi có thể đổi trả sản phẩm không?",
    question_en: "Can I return or exchange a product?",
    answer_vi: "Có, chúng tôi hỗ trợ đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng, không cần lý do.",
    answer_en: "Yes, we offer free returns/exchanges within 30 days of delivery, no reason needed.",
  },
  {
    question_vi: "Làm sao để theo dõi đơn hàng?",
    question_en: "How do I track my order?",
    answer_vi: "Sau khi đơn hàng được xác nhận, bạn sẽ nhận mã vận đơn qua email để theo dõi trực tiếp.",
    answer_en: "Once your order is confirmed, you'll receive a tracking code by email.",
  },
  {
    question_vi: "VERITY GEAR có cửa hàng offline không?",
    question_en: "Does VERITY GEAR have a physical store?",
    answer_vi: "Hiện tại chúng tôi có showroom tại TP. Hồ Chí Minh, xem vị trí chi tiết ở bản đồ phía trên.",
    answer_en: "We currently have a showroom in Ho Chi Minh City — see the map above for the exact location.",
  },
];

export default async function ContactFaq() {
  const locale = await getLocale();
  const t = await getTranslations("contactFaq");
  const supabase = await createClient();
  const { data } = await supabase.from("contact_faqs").select("*").order("sort_order");

  const faqs = data && data.length > 0 ? data : FALLBACK_FAQS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">{t("eyebrow")}</p>
        <h2 className="font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">{t("heading")}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {faqs.map((f, i) => (
          <div key={i} className="border border-ink/10 bg-ink/[0.03] p-6">
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              {pick(f.question_vi, f.question_en)}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">{pick(f.answer_vi, f.answer_en)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
