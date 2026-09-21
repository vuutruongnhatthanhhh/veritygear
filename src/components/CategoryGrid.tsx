import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/products";

export default function CategoryGrid() {
  return (
    <section id="danh-muc" className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
            Danh mục
          </p>
          <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
            Chọn vũ khí
            <br />
            của bạn
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-ink/55">
          Từ bàn phím cơ đến tai nghe âm trường vòm — mỗi sản phẩm đều được
          kiểm định qua hàng nghìn giờ thi đấu thực tế.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/san-pham?danh-muc=${cat.slug}`}
            className={`group relative flex flex-col justify-end overflow-hidden bg-ink ${
              i === 0
                ? "col-span-2 aspect-16/10 md:col-span-2 md:row-span-2 md:aspect-auto"
                : "aspect-square md:aspect-square"
            }`}
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent" />
            <div className="relative z-10 flex items-end justify-between p-5">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wide text-paper">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-paper/60">{cat.count} sản phẩm</p>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper/40 text-paper transition-transform duration-500 group-hover:rotate-45">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
