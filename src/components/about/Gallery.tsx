import Image from "next/image";
import { getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

const FALLBACK_IMAGES = [
  { image_url: "/images/products/keyboard-1.jpg", alt_vi: "Chi tiết bàn phím cơ VERITY GEAR", alt_en: "VERITY GEAR mechanical keyboard detail" },
  { image_url: "/images/products/headset-2.jpg", alt_vi: "Chi tiết tai nghe VERITY GEAR", alt_en: "VERITY GEAR headset detail" },
  { image_url: "/images/products/controller-1.jpg", alt_vi: "Chi tiết tay cầm VERITY GEAR", alt_en: "VERITY GEAR controller detail" },
];

export default async function Gallery() {
  const locale = await getLocale();
  const supabase = await createClient();
  const { data } = await supabase.from("about_gallery_images").select("*").order("sort_order");

  const images = data && data.length > 0 ? data : FALLBACK_IMAGES;
  const pick = (vi: string, en: string) => (locale === "en" ? en || vi : vi);

  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {images.map((img, i) => (
          <div
            key={i}
            className={`relative aspect-3/4 overflow-hidden ${i === 1 ? "sm:translate-y-8" : ""}`}
          >
            <Image
              src={img.image_url}
              alt={pick(img.alt_vi, img.alt_en)}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
