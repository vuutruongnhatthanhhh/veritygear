const VALUES = [
  {
    title: "Chính xác tuyệt đối",
    desc: "Mỗi chi tiết được đo lường và kiểm định trước khi rời xưởng.",
    icon: <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />,
    circle: true,
  },
  {
    title: "Không khoan nhượng",
    desc: "Chúng tôi không phát hành sản phẩm chưa vượt qua thử nghiệm thực chiến.",
    icon: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
  },
  {
    title: "Bền vững lâu dài",
    desc: "Vật liệu cao cấp, thiết kế module dễ sửa chữa và nâng cấp.",
    icon: <path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6l-9-4Z" />,
  },
  {
    title: "Cộng đồng trước tiên",
    desc: "Sản phẩm được phát triển cùng phản hồi trực tiếp từ game thủ.",
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

export default function ValuesGrid() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          Giá trị cốt lõi
        </p>
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Những điều
          <br />
          chúng tôi theo đuổi
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 border-t border-ink/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((v) => (
          <div key={v.title} className="flex flex-col gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {v.icon}
              </svg>
            </span>
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              {v.title}
            </h3>
            <p className="text-[14px] leading-relaxed text-ink">{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
