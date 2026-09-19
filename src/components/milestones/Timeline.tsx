const MILESTONES = [
  {
    year: "2020",
    title: "Khởi đầu tại Việt Nam",
    desc: "VERITY GEAR ra đời trong một xưởng nhỏ với dòng sản phẩm đầu tiên: VERTEX Series bàn phím cơ.",
  },
  {
    year: "2021",
    title: "Ra mắt dòng PHANTOM",
    desc: "Bộ đôi chuột gaming không dây đầu tiên — sản phẩm định hình tên tuổi thương hiệu.",
  },
  {
    year: "2022",
    title: "Mở rộng khu vực Đông Nam Á",
    desc: "VERITY GEAR có mặt tại hơn 8 quốc gia, mở rộng mạng lưới đại lý và nhà phân phối chính hãng.",
  },
  {
    year: "2024",
    title: "50.000 game thủ tin dùng",
    desc: "Cộng đồng VERITY GEAR cán mốc 50.000 game thủ trên toàn cầu, cùng dòng tai nghe AERO ra mắt.",
  },
  {
    year: "2026",
    title: "12 quốc gia và tiếp tục phát triển",
    desc: "Hôm nay, VERITY GEAR hiện diện tại 12 quốc gia với đánh giá trung bình 4.9/5 từ hơn 3.200 khách hàng.",
  },
];

export default function Timeline() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Hành trình
        </p>
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Các cột mốc
          <br />
          đáng nhớ
        </h2>
      </div>

      <div className="relative">
        <div className="absolute bottom-2 left-[27px] top-2 hidden w-px bg-ink/15 sm:block" />
        <div className="space-y-6">
          {MILESTONES.map((item) => (
            <div key={item.year} className="relative flex gap-6 sm:gap-8">
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-center">
                <div className="flex h-14 w-14 items-center justify-center border border-ink bg-paper text-[11px] font-bold text-ink">
                  {item.year}
                </div>
              </div>
              <div className="flex-1 border border-ink/10 bg-ink/[0.03] p-6">
                <div className="mb-1 text-[11px] font-bold tracking-[0.2em] text-ink/50 sm:hidden">
                  {item.year}
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink/60">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
