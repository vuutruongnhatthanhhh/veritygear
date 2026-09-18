const STATS = [
  { value: "2020", label: "Năm thành lập" },
  { value: "50K+", label: "Game thủ tin dùng" },
  { value: "12", label: "Quốc gia phân phối" },
  { value: "4.9/5", label: "Đánh giá trung bình" },
];

export default function StatsRow() {
  return (
    <section className="border-y border-ink/10 bg-ink">
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 divide-x divide-y divide-paper/10 sm:px-10 md:grid-cols-4 md:divide-y-0">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-2 px-6 py-14 text-center"
          >
            <span className="font-display text-4xl font-bold text-paper sm:text-5xl">
              {s.value}
            </span>
            <span className="text-[12px] uppercase tracking-[0.14em] text-paper/50">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
