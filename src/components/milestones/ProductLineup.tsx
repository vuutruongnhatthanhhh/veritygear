import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

type LineupRow = {
  slug: string;
  name: string;
  image_url: string | null;
  product_categories: { name_vi: string; name_en: string } | null;
};

export default async function ProductLineup() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data: lineup } = await supabase
    .from("products")
    .select("slug, name, image_url, category_id, product_categories(name_vi, name_en)")
    .eq("is_active", true)
    .eq("is_lineup", true)
    .order("sort_order")
    .limit(4)
    .returns<LineupRow[]>();

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  if (!lineup || lineup.length === 0) return null;

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
                src={product.image_url ?? ""}
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
                  {product.product_categories ? pick(product.product_categories.name_vi, product.product_categories.name_en) : ""}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
