"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { formatVnd } from "@/data/products";

const FREE_SHIPPING_THRESHOLD = 1500000;
const SHIPPING_FEE = 35000;

type PaymentMethod = "cod" | "transfer";

export default function CheckoutView() {
  const { items, subtotal, clear } = useCart();
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = `VG${Date.now().toString().slice(-8)}`;
    setOrderCode(code);
    clear();
  }

  if (orderCode) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Đặt hàng thành công
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Cảm ơn bạn đã đặt hàng
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
          Mã đơn hàng của bạn là{" "}
          <span className="font-semibold text-ink">{orderCode}</span>. Đội
          ngũ VERITY GEAR sẽ liên hệ xác nhận trong vòng 24 giờ.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
        >
          Về trang chủ
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          Thanh toán
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/60">
          Thêm sản phẩm vào giỏ trước khi tiến hành thanh toán.
        </p>
        <Link
          href="/san-pham"
          className="mt-8 inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition-colors hover:text-ink">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/gio-hang" className="transition-colors hover:text-ink">
            Giỏ hàng
          </Link>
          <span>/</span>
          <span className="text-ink/70">Thanh toán</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Thanh toán
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16"
        >
          <div className="flex flex-col gap-10 lg:col-span-2">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
                Thông tin giao hàng
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  name="fullName"
                  placeholder="Họ và tên"
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Số điện thoại"
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
                />
                <input
                  required
                  name="address"
                  placeholder="Địa chỉ"
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
                <input
                  required
                  name="city"
                  placeholder="Tỉnh / thành phố"
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
                <textarea
                  name="note"
                  placeholder="Ghi chú (không bắt buộc)"
                  rows={3}
                  className="w-full resize-none border border-ink/25 bg-transparent px-5 py-4 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
                Phương thức thanh toán
              </h2>
              <div className="mt-5 flex flex-col gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 border px-5 py-4 transition-colors ${
                    payment === "cod" ? "border-ink" : "border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                    className="h-4 w-4 accent-ink"
                  />
                  <span className="text-sm font-medium">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 border px-5 py-4 transition-colors ${
                    payment === "transfer" ? "border-ink" : "border-ink/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="transfer"
                    checked={payment === "transfer"}
                    onChange={() => setPayment("transfer")}
                    className="h-4 w-4 accent-ink"
                  />
                  <span className="text-sm font-medium">
                    Chuyển khoản ngân hàng
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="h-fit border border-ink/10 p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
              Đơn hàng ({items.length} sản phẩm)
            </h2>

            <div className="mt-6 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.slug} className="flex items-center gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ink/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-paper">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold uppercase tracking-wide">
                      {item.name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatVnd(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink/60">Tạm tính</span>
                <span className="font-semibold">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60">Vận chuyển</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Miễn phí" : formatVnd(shipping)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-6 text-base">
              <span className="font-semibold">Tổng cộng</span>
              <span className="font-display text-xl font-bold">
                {formatVnd(total)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-6 h-13 w-full bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
            >
              Đặt hàng
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
