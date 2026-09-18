const ITEMS = [
  "Miễn phí vận chuyển toàn quốc",
  "Bảo hành chính hãng 24 tháng",
  "Đổi trả trong 30 ngày",
  "Chế tác giới hạn số lượng",
  "Hỗ trợ kỹ thuật 24/7",
];

export default function Marquee() {
  const loop = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-ink py-4">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-[13px] font-medium uppercase tracking-[0.18em] text-paper/80"
          >
            {item}
            <span className="text-paper/30">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
