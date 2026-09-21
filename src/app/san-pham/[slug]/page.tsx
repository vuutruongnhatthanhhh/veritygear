import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, formatVnd } from "@/data/products";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";
import Newsletter from "@/components/Newsletter";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  return {
    title: `${product.name} — VERITY GEAR`,
    description: product.tagline,
  };
}

const FEATURES = [
  { label: "Bảo hành 24 tháng", desc: "Đổi mới nếu lỗi kỹ thuật" },
  { label: "Đổi trả 30 ngày", desc: "Không cần lý do" },
  { label: "Giao hàng toàn quốc", desc: "Miễn phí từ 1.500.000₫" },
];

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition-colors hover:text-ink">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="transition-colors hover:text-ink">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 sm:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden bg-ink/5 lg:sticky lg:top-24 lg:self-start">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            {product.badge && (
              <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-paper">
                {product.badge}
              </span>
            )}
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/40">
              {product.category}
            </p>
            <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink/60">
              {product.tagline}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="font-display text-2xl font-bold">
                {formatVnd(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-ink/35 line-through">
                  {formatVnd(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/65">
              {product.description}
            </p>

            <div className="mt-8">
              <ProductActions />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 border-y border-ink/10 py-6 sm:grid-cols-3">
              {FEATURES.map((f) => (
                <div key={f.label}>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.08em]">
                    {f.label}
                  </p>
                  <p className="mt-1 text-[13px] text-ink/50">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
                Thông số kỹ thuật
              </h2>
              <dl className="divide-y divide-ink/10 border-t border-ink/10">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-2 gap-4 py-3.5 text-[14px]"
                  >
                    <dt className="text-ink/50">{spec.label}</dt>
                    <dd className="font-medium text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <RelatedProducts products={related} />
      <Newsletter />
    </>
  );
}
