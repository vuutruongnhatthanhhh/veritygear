import Image from "next/image";

const IMAGES = [
  { src: "/images/products/keyboard-1.jpg", alt: "Chi tiết bàn phím cơ VERITY GEAR" },
  { src: "/images/products/headset-2.jpg", alt: "Chi tiết tai nghe VERITY GEAR" },
  { src: "/images/products/controller-1.jpg", alt: "Chi tiết tay cầm VERITY GEAR" },
];

export default function Gallery() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={`relative aspect-3/4 overflow-hidden ${
              i === 1 ? "sm:translate-y-8" : ""
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
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
