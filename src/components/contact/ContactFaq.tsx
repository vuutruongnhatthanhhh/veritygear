const FAQS = [
  {
    q: "Thời gian giao hàng mất bao lâu?",
    a: "Đơn hàng nội thành giao trong 1–2 ngày làm việc. Các tỉnh thành khác từ 2–5 ngày làm việc.",
  },
  {
    q: "Tôi có thể đổi trả sản phẩm không?",
    a: "Có, chúng tôi hỗ trợ đổi trả miễn phí trong vòng 30 ngày kể từ ngày nhận hàng, không cần lý do.",
  },
  {
    q: "Làm sao để theo dõi đơn hàng?",
    a: "Sau khi đơn hàng được xác nhận, bạn sẽ nhận mã vận đơn qua email để theo dõi trực tiếp.",
  },
  {
    q: "VERITY GEAR có cửa hàng offline không?",
    a: "Hiện tại chúng tôi có showroom tại TP. Hồ Chí Minh, xem vị trí chi tiết ở bản đồ phía trên.",
  },
];

export default function ContactFaq() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          Giải đáp nhanh
        </p>
        <h2 className="font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Câu hỏi thường gặp
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FAQS.map((f) => (
          <div key={f.q} className="border border-ink/10 bg-ink/[0.03] p-6">
            <h3 className="font-display text-base font-bold uppercase tracking-wide">
              {f.q}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink/60">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
