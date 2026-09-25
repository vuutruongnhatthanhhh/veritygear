"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { formatVnd } from "@/lib/format";

export default function CartView({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const { items, subtotal, setQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Giỏ hàng
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/60">
          Khám phá bộ sưu tập phụ kiện gaming cao cấp của VERITY GEAR và thêm
          sản phẩm bạn thích vào giỏ.
        </p>
        <Link
          href="/san-pham"
          className="mt-8 inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition-colors hover:text-ink">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-ink/70">Giỏ hàng</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Giỏ hàng
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="flex flex-col divide-y divide-ink/10 lg:col-span-2">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-5 py-6 first:pt-0">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="relative h-28 w-24 shrink-0 overflow-hidden bg-ink/5 sm:h-32 sm:w-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link href={`/san-pham/${item.slug}`}>
                        <h3 className="font-display text-base font-bold uppercase tracking-wide transition-colors hover:text-ink/70">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm text-ink/55">
                        {formatVnd(item.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      aria-label={`Xóa ${item.name} khỏi giỏ`}
                      className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink/40 transition-colors hover:text-ink"
                    >
                      Xóa
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex h-11 items-center border border-ink/20">
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        aria-label="Giảm số lượng"
                        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                      >
                        −
                      </button>
                      <span className="flex h-full w-9 items-center justify-center text-sm font-semibold">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                        aria-label="Tăng số lượng"
                        className="flex h-full w-9 items-center justify-center text-ink/60 transition-colors hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatVnd(item.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit border border-ink/10 p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
              Tóm tắt đơn hàng
            </h2>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-ink/60">Tạm tính</span>
              <span className="font-semibold">{formatVnd(subtotal)}</span>
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/50">
              {remaining > 0
                ? `Mua thêm ${formatVnd(remaining)} để được miễn phí vận chuyển.`
                : "Đơn hàng của bạn được miễn phí vận chuyển."}
            </p>

            <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-6 text-base">
              <span className="font-semibold">Tổng cộng</span>
              <span className="font-display text-xl font-bold">
                {formatVnd(subtotal)}
              </span>
            </div>

            <Link
              href="/thanh-toan"
              className="mt-6 flex h-13 w-full items-center justify-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
            >
              Tiến hành thanh toán
            </Link>
            <Link
              href="/san-pham"
              className="mt-3 flex h-13 w-full items-center justify-center border border-ink/20 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
