import Image from "next/image";
import Link from "next/link";
import { formatVnd, products } from "@/data/products";

export default function ProductSpotlight() {
  const hero = products[0];

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden bg-ink">
      <Image
        src="/images/about/setup-2.jpg"
        alt={hero.name}
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 py-24 sm:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/50">
          Sản phẩm chủ lực
        </p>
        <h2 className="max-w-lg font-display text-4xl font-bold uppercase leading-[1.05] text-paper sm:text-6xl">
          {hero.name}
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/65">
          Bàn phím cơ full-size với khung nhôm CNC nguyên khối, hệ thống
          hotswap 5-pin và bộ switch tuyến tính được bôi trơn thủ công —
          {" "}{hero.tagline.toLowerCase()}.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <span className="font-display text-2xl font-bold text-paper">
            {formatVnd(hero.price)}
          </span>
          {hero.compareAtPrice && (
            <span className="text-sm text-paper/40 line-through">
              {formatVnd(hero.compareAtPrice)}
            </span>
          )}
        </div>
        <Link
          href="#san-pham"
          className="mt-8 inline-flex h-13 w-fit items-center justify-center bg-paper px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03]"
        >
          Mua ngay
        </Link>
      </div>
    </section>
  );
}
