const CARDS = [
  {
    label: "Địa chỉ",
    value: "268 Điện Biên Phủ, Phường 7, Quận 3, TP. Hồ Chí Minh",
    icon: (
      <>
        <path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    label: "Điện thoại",
    value: "(028) 7300 1234",
    href: "tel:+842873001234",
    icon: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
    ),
  },
  {
    label: "Email",
    value: "hello@veritygear.vn",
    href: "mailto:hello@veritygear.vn",
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 6 10-6" />
      </>
    ),
  },
  {
    label: "Giờ làm việc",
    value: "Thứ 2 – Thứ 7: 9:00 – 18:00",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    ),
  },
];

export default function ContactInfoCards() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-14 sm:px-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div
            key={card.label}
            className="group relative overflow-hidden border border-ink/10 p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="absolute left-0 top-0 h-[2px] w-0 bg-ink transition-all duration-500 group-hover:w-full" />
            <span className="mb-4 flex h-11 w-11 items-center justify-center bg-ink text-paper">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                {card.icon}
              </svg>
            </span>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">
              {card.label}
            </p>
            {card.href ? (
              <a
                href={card.href}
                className="text-[14px] font-semibold text-ink transition-colors hover:text-ink/60"
              >
                {card.value}
              </a>
            ) : (
              <p className="text-[14px] leading-snug text-ink/75">{card.value}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
