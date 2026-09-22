const FEATURES = [
  {
    title: "Chế tác chính xác",
    desc: "Dung sai gia công 0.02mm, kiểm định từng lô hàng.",
    icon: (
      <path d="M12 2 2 7l10 5 10-5-10-5ZM2 17l10 5 10-5M2 12l10 5 10-5" />
    ),
  },
  {
    title: "Bảo hành 24 tháng",
    desc: "Đổi mới miễn phí nếu lỗi kỹ thuật từ nhà sản xuất.",
    icon: <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z" />,
  },
  {
    title: "Giao hàng toàn quốc",
    desc: "Miễn phí vận chuyển cho đơn từ 1.500.000₫.",
    icon: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </>
    ),
  },
  {
    title: "Cộng đồng game thủ",
    desc: "Hơn 50.000 game thủ đang tin dùng VERITY GEAR.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M2 21v-1a6 6 0 0 1 12 0v1" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M15 21v-1a4.5 4.5 0 0 1 7 0v1" />
      </>
    ),
  },
];

export default function FeatureStrip() {
  return (
    <section className="border-y border-ink/10 bg-paper">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-ink/10 px-0 sm:px-10 md:grid-cols-4 md:divide-y-0">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-4 px-6 py-10">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-ink"
            >
              {f.icon}
            </svg>
            <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em]">
              {f.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-ink">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
