import Image from "next/image";

type Props = {
  eyebrow: string;
  title: string;
  desc: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
};

export default function StoryBlock({
  eyebrow,
  title,
  desc,
  image,
  imageAlt,
  reverse,
}: Props) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
      <div
        className={`relative aspect-[4/3] overflow-hidden ${
          reverse ? "md:order-2" : ""
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className={reverse ? "md:order-1" : ""}>
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
          {eyebrow}
        </p>
        <h3 className="max-w-md font-display text-2xl font-bold uppercase leading-[1.15] sm:text-3xl">
          {title}
        </h3>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink">
          {desc}
        </p>
      </div>
    </div>
  );
}
