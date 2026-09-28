"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { formatVnd } from "@/lib/format";
import { placeOrder } from "@/app/[locale]/thanh-toan/actions";
import { GhnAddressFields } from "./GhnAddressFields";

type Prefill = { fullName: string; phone: string; address: string; email: string };
type ShippingConfig = { freeShippingThreshold: number; shippingFee: number };

type WardSelection = {
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
};

export default function CheckoutView({
  prefill,
  shipping,
  ghnEnabled,
}: {
  prefill: Prefill;
  shipping: ShippingConfig;
  ghnEnabled: boolean;
}) {
  const t = useTranslations("checkout");
  const tNav = useTranslations("nav");
  const { items, subtotal, clear } = useCart();
  const [state, action, pending] = useActionState(placeOrder, null);
  const [ghnFee, setGhnFee] = useState<number | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);
  const [ghnFeeError, setGhnFeeError] = useState<string | null>(null);

  const flatShippingCost = subtotal >= shipping.freeShippingThreshold ? 0 : shipping.shippingFee;
  const shippingCost = ghnEnabled && ghnFee !== null ? ghnFee : flatShippingCost;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (state?.orderCode) clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.orderCode]);

  async function handleWardSelected(selection: WardSelection) {
    setFeeLoading(true);
    setGhnFeeError(null);
    try {
      const res = await fetch("/api/ghn/fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toDistrictId: selection.districtId,
          toWardCode: selection.wardCode,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (typeof data.fee === "number") {
        setGhnFee(data.fee);
      } else {
        setGhnFee(null);
        setGhnFeeError(data.error ?? "Không tính được phí GHN");
      }
    } catch {
      setGhnFee(null);
      setGhnFeeError("Không thể kết nối tới máy chủ để tính phí GHN");
    } finally {
      setFeeLoading(false);
    }
  }

  if (state?.orderCode) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          {t("successEyebrow")}
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          {t("successHeading")}
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
          {t.rich("successBody", {
            orderCode: state.orderCode,
            code: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
          })}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/tai-khoan/don-hang/${state.orderCode}`}
            className="inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
          >
            {t("viewOrder")}
          </Link>
          <Link
            href="/"
            className="inline-flex h-13 items-center border border-ink/20 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
          {t("breadcrumbCurrent")}
        </p>
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          {t("emptyHeading")}
        </h1>
        <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/60">{t("emptyBody")}</p>
        <Link
          href="/san-pham"
          className="mt-8 inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
        >
          {t("exploreProducts")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-6 pb-4 pt-24 sm:px-10 sm:pt-28">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
          <Link href="/" className="transition-colors hover:text-ink">
            {tNav("trangChu")}
          </Link>
          <span>/</span>
          <Link href="/gio-hang" className="transition-colors hover:text-ink">
            {tNav("cart")}
          </Link>
          <span>/</span>
          <span className="text-ink/70">{t("breadcrumbCurrent")}</span>
        </nav>
      </div>

      <section className="mx-auto max-w-[1600px] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">{t("heading")}</h1>

        {state?.error && (
          <div className="mt-6 border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">{state.error}</div>
        )}

        <form action={action} className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          <input type="hidden" name="items_json" value={JSON.stringify(items)} readOnly />

          <div className="flex flex-col gap-10 lg:col-span-2">
            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">{t("shippingHeading")}</h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  name="fullName"
                  defaultValue={prefill.fullName}
                  placeholder={t("fullNamePlaceholder")}
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
                <input
                  required
                  type="tel"
                  name="phone"
                  defaultValue={prefill.phone}
                  placeholder={t("phonePlaceholder")}
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
                />
                <input
                  required
                  type="email"
                  name="email"
                  defaultValue={prefill.email}
                  placeholder={t("emailPlaceholder")}
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none"
                />
                <input
                  required
                  name="address"
                  defaultValue={prefill.address}
                  placeholder={t("addressPlaceholder")}
                  className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
                {ghnEnabled ? (
                  <GhnAddressFields onWardSelected={handleWardSelected} />
                ) : (
                  <input
                    required
                    name="city"
                    placeholder={t("cityPlaceholder")}
                    className="h-13 w-full border border-ink/25 bg-transparent px-5 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                  />
                )}
                <textarea
                  name="note"
                  placeholder={t("notePlaceholder")}
                  rows={3}
                  className="w-full resize-none border border-ink/25 bg-transparent px-5 py-4 text-sm placeholder:text-ink/40 focus:border-ink focus:outline-none sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">{t("paymentHeading")}</h2>
              <div className="mt-5 flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3 border border-ink px-5 py-4 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    defaultChecked
                    className="h-4 w-4 accent-ink"
                  />
                  <span className="text-sm font-medium">{t("cod")}</span>
                </label>
                <label className="flex cursor-not-allowed items-center gap-3 border border-ink/20 px-5 py-4 text-ink/40 transition-colors">
                  <input type="radio" name="payment" value="transfer" disabled className="h-4 w-4 accent-ink" />
                  <span className="text-sm font-medium">{t("transfer")}</span>
                  <span className="ml-auto shrink-0 rounded-full border border-ink/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]">
                    {t("comingSoon")}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="h-fit border border-ink/10 p-6 sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em]">
              {t("orderSummary", { count: items.length })}
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
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold uppercase tracking-wide">{item.name}</p>
                    <p className="mt-1 text-xs text-ink">{t("qty", { count: item.qty })}</p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatVnd(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink/60">{t("subtotal")}</span>
                <span className="font-semibold">{formatVnd(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink/60">{t("shippingLabel")}</span>
                <span className="font-semibold">
                  {feeLoading ? "..." : shippingCost === 0 ? t("free") : formatVnd(shippingCost)}
                </span>
              </div>
              {ghnFeeError && (
                <p className="text-xs text-red-600">
                  GHN lỗi: {ghnFeeError} — đang dùng phí cố định thay thế.
                </p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-6 text-base">
              <span className="font-semibold">{t("total")}</span>
              <span className="font-display text-xl font-bold">{formatVnd(total)}</span>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 h-13 w-full bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {pending ? t("submitting") : t("submit")}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
