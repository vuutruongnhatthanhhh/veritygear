export default function Newsletter() {
  return (
    <section className="bg-ink py-24 sm:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.35em] text-paper/50">
          Vòng tròn nội bộ
        </p>
        <h2 className="font-display text-3xl font-bold uppercase leading-[1.1] text-paper sm:text-4xl">
          Nhận ưu đãi trước tiên
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-paper/60">
          Đăng ký để nhận thông tin drop giới hạn, ưu đãi độc quyền và tin tức
          mới nhất từ VERITY GEAR.
        </p>
        <form className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            placeholder="Email của bạn"
            className="h-13 flex-1 border border-paper/25 bg-transparent px-5 text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none"
          />
          <button
            type="submit"
            className="h-13 shrink-0 bg-paper px-7 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-transform hover:scale-[1.03]"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  );
}
