import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative flex h-[70svh] min-h-[520px] w-full items-end overflow-hidden bg-ink">
      <Image
        src="/images/about/setup-1.jpg"
        alt="Không gian chế tác VERITY GEAR"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 sm:px-10">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/60">
          Về chúng tôi
        </p>
        <h1 className="max-w-2xl font-display text-5xl font-bold uppercase leading-[1.28] text-paper sm:text-7xl">
          Chính xác là
          <br />
          ngôn ngữ của chúng tôi
        </h1>
      </div>
    </section>
  );
}
