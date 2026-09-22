import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative flex h-[100svh] min-h-[640px] w-full items-end overflow-hidden bg-ink">
      <Image
        src="/images/hero/hero-main.jpg"
        alt="Thiết lập gaming VERITY GEAR trong không gian tối, đèn RGB"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[75%_center] opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/10 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-20 pt-40 sm:px-10 sm:pb-28">
        <p className="animate-fade-up mb-6 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/60">
          Bộ sưu tập 2026 — Precision Series
        </p>
        <h1
          className="animate-fade-up max-w-3xl font-display text-[13vw] font-bold uppercase leading-[1.02] tracking-tight text-paper sm:text-[7vw] lg:text-[6vw]"
          style={{ animationDelay: "0.1s" }}
        >
          Unleash Your
          <br />
          Precision
        </h1>
        <p
          className="animate-fade-up mt-8 max-w-md text-base leading-relaxed text-paper/70 sm:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          Phụ kiện gaming cao cấp được chế tác cho những game thủ không khoan
          nhượng — chính xác đến từng khung hình.
        </p>
        <div
          className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="#san-pham"
            className="inline-flex h-13 items-center justify-center bg-paper px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03]"
          >
            Khám phá bộ sưu tập
          </Link>
          <Link
            href="/gioi-thieu"
            className="inline-flex h-13 items-center justify-center border border-paper/40 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-colors hover:border-paper hover:bg-paper/10"
          >
            Câu chuyện thương hiệu
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-3 sm:right-10 sm:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-paper/50 [writing-mode:vertical-rl]">
          Cuộn xuống
        </span>
        <span className="h-14 w-px bg-gradient-to-b from-paper/60 to-transparent" />
      </div>
    </section>
  );
}
