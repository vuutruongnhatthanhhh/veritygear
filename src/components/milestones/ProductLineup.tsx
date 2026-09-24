import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";

const LINEUP_SLUGS = ["vertex-x1", "phantom-pro", "aero-one", "pulse"];

export default function ProductLineup() {
  const lineup = LINEUP_SLUGS.map((slug) =>
    products.find((p) => p.slug === slug),
  ).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 sm:py-32">
      <div className="mb-14 text-center">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          Sản phẩm mới
        </p>
        <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl">
          Lineup mới nhất của VERITY GEAR
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {lineup.map((product) => (
          <Link
            key={product.slug}
            href={`/san-pham/${product.slug}`}
            className="group relative overflow-hidden bg-ink"
          >
            <div className="relative aspect-3/4 w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
              <span className="absolute left-0 top-0 h-[2px] w-0 bg-paper transition-all duration-500 ease-out group-hover:w-full" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <h3 className="font-display text-base font-bold uppercase text-paper">
                  {product.name}
                </h3>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
                  {product.category}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
