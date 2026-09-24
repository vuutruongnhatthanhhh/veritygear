import Image from "next/image";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

const FALLBACK = {
  eyebrow_vi: "Câu chuyện của chúng tôi",
  eyebrow_en: "Our story",
  heading_vi: "Chế tác cho những kẻ không khoan nhượng",
  heading_en: "Crafted for the uncompromising",
  body_vi:
    "VERITY GEAR ra đời từ nỗi ám ảnh với sự chính xác. Mỗi sản phẩm là kết quả của hàng trăm giờ thử nghiệm cùng các tuyển thủ chuyên nghiệp — không thỏa hiệp giữa hiệu năng và vẻ đẹp tối giản.",
  body_en:
    "VERITY GEAR was born from an obsession with precision. Every product is the result of hundreds of hours of testing with professional players — no compromise between performance and minimalist design.",
  cta_label_vi: "Đọc câu chuyện thương hiệu →",
  cta_label_en: "Read our brand story →",
  cta_url: "/gioi-thieu",
  image_url: "/images/about/engineer-circuit.jpg",
};

export default async function BrandStoryTeaser() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("home_brand_story").select("*").eq("id", 1).single();
  const story = { ...FALLBACK, ...data };

  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto grid max-w-[1600px] grid-cols-1 items-stretch gap-0 px-0 py-24 sm:py-32 md:grid-cols-2">
      <div className="relative order-2 aspect-[4/3] md:order-1 md:aspect-auto">
        <Image
          src={story.image_url || FALLBACK.image_url}
          alt={pick(story.heading_vi, story.heading_en)}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="order-1 flex flex-col justify-center px-6 py-16 sm:px-14 md:order-2 md:py-0">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          {pick(story.eyebrow_vi, story.eyebrow_en)}
        </p>
        <h2 className="max-w-md font-display text-3xl font-bold uppercase leading-[1.1] sm:text-4xl">
          {pick(story.heading_vi, story.heading_en)}
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink">
          {pick(story.body_vi, story.body_en)}
        </p>
        <Link
          href={story.cta_url || FALLBACK.cta_url}
          className="mt-8 inline-flex w-fit items-center gap-2 border-b-2 border-ink pb-1 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-60"
        >
          {pick(story.cta_label_vi, story.cta_label_en)}
        </Link>
      </div>
    </section>
  );
}
