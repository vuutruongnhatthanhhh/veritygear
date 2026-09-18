const REVIEWS = [
  {
    quote:
      "Switch của VERTEX X1 mượt đến mức tôi giảm hẳn sai số click trong các pha combat tốc độ cao.",
    name: "Minh Quân",
    role: "Valorant Radiant",
  },
  {
    quote:
      "PHANTOM PRO nhẹ và bám tay hơn hẳn con chuột cũ. Cảm biến chuẩn từng pixel.",
    name: "Thảo Vy",
    role: "CS2 Semi-pro",
  },
  {
    quote:
      "AERO ONE tái tạo bước chân đối thủ cực rõ. Đeo cả ngày không mỏi tai.",
    name: "Đức Anh",
    role: "Streamer, 120K followers",
  },
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 flex items-end justify-between">
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Game thủ nói gì
        </h2>
        <div className="hidden items-center gap-1 text-ink/80 sm:flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="m12 2 3.1 6.7 7.4.8-5.5 5 1.6 7.3L12 18l-6.6 3.8L7 14.5l-5.5-5 7.4-.8Z" />
            </svg>
          ))}
          <span className="ml-2 text-sm font-medium text-ink/60">4.9/5 · 3.200+ đánh giá</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-ink/10 pt-12 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <figure key={r.name} className="flex flex-col">
            <div className="mb-4 flex gap-1 text-ink/80">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m12 2 3.1 6.7 7.4.8-5.5 5 1.6 7.3L12 18l-6.6 3.8L7 14.5l-5.5-5 7.4-.8Z" />
                </svg>
              ))}
            </div>
            <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/75">
              “{r.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="font-semibold">{r.name}</span>
              <span className="text-ink/40"> — {r.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
