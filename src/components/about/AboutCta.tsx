import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="border-t border-ink/10 bg-paper py-24 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] sm:text-4xl">
          Sẵn sàng nâng cấp
          <br />
          trải nghiệm của bạn?
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/60">
          Khám phá toàn bộ bộ sưu tập VERITY GEAR — được chế tác cho những ai
          xem game là một môn nghệ thuật.
        </p>
        <Link
          href="/#san-pham"
          className="mt-8 inline-flex h-13 items-center justify-center bg-ink px-9 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.03]"
        >
          Khám phá bộ sưu tập
        </Link>
      </div>
    </section>
  );
}
