import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

// Icons stay hardcoded and keyed by icon_key — never render SVG markup
// stored in the DB, to avoid an injection vector.
const ICONS: Record<string, React.ReactNode> = {
  location: (
    <>
      <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
  ),
  email: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 6 10-6" />
    </>
  ),
  hours: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </>
  ),
};

const FALLBACK_CARDS = [
  {
    icon_key: "location",
    label_vi: "Địa chỉ",
    label_en: "Address",
    value_vi: "268 Điện Biên Phủ, Phường 7, Quận 3, TP. Hồ Chí Minh",
    value_en: "268 Dien Bien Phu, Ward 7, District 3, Ho Chi Minh City",
    href: null as string | null,
  },
  {
    icon_key: "phone",
    label_vi: "Điện thoại",
    label_en: "Phone",
    value_vi: "(028) 7300 1234",
    value_en: "(028) 7300 1234",
    href: "tel:+842873001234",
  },
  {
    icon_key: "email",
    label_vi: "Email",
    label_en: "Email",
    value_vi: "hello@veritygear.vn",
    value_en: "hello@veritygear.vn",
    href: "mailto:hello@veritygear.vn",
  },
  {
    icon_key: "hours",
    label_vi: "Giờ làm việc",
    label_en: "Business hours",
    value_vi: "Thứ 2 – Thứ 7: 9:00 – 18:00",
    value_en: "Mon – Sat: 9:00 AM – 6:00 PM",
    href: null,
  },
];

export default async function ContactInfoCards() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("contact_info_cards").select("*").order("sort_order");

  const cards = data && data.length > 0 ? data : FALLBACK_CARDS;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-14 sm:px-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden border border-ink/10 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="absolute left-0 top-0 h-[2px] w-0 bg-ink transition-all duration-500 group-hover:w-full" />
            <span className="mb-4 flex h-11 w-11 items-center justify-center bg-ink text-paper">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                {ICONS[card.icon_key] ?? ICONS.location}
              </svg>
            </span>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink">
              {pick(card.label_vi, card.label_en)}
            </p>
            {card.href ? (
              <a href={card.href} className="text-[14px] font-semibold text-ink transition-colors hover:text-ink/60">
                {pick(card.value_vi, card.value_en)}
              </a>
            ) : (
              <p className="text-[14px] leading-snug text-ink/75">{pick(card.value_vi, card.value_en)}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
