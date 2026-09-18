import Image from "next/image";
import Link from "next/link";

export default function BrandStoryTeaser() {
  return (
    <section className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-0 px-0 py-24 sm:py-32 md:grid-cols-2">
      <div className="relative order-2 aspect-[4/3] md:order-1 md:aspect-auto">
        <Image
          src="/images/about/engineer-circuit.jpg"
          alt="Không gian chế tác VERITY GEAR"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="order-1 flex flex-col justify-center px-6 py-16 sm:px-14 md:order-2 md:py-0">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Câu chuyện của chúng tôi
        </p>
        <h2 className="max-w-md font-display text-3xl font-bold uppercase leading-[1.1] sm:text-4xl">
          Chế tác cho những kẻ không khoan nhượng
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60">
          VERITY GEAR ra đời từ nỗi ám ảnh với sự chính xác. Mỗi sản phẩm là
          kết quả của hàng trăm giờ thử nghiệm cùng các tuyển thủ chuyên
          nghiệp — không thỏa hiệp giữa hiệu năng và vẻ đẹp tối giản.
        </p>
        <Link
          href="/about"
          className="mt-8 inline-flex w-fit items-center gap-2 border-b-2 border-ink pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-60"
        >
          Đọc câu chuyện thương hiệu →
        </Link>
      </div>
    </section>
  );
}
