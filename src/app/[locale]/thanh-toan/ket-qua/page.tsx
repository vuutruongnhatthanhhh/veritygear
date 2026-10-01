import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Kết quả thanh toán — VERITY GEAR", robots: { index: false, follow: false } };

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderCode?: string; cancel?: string }>;
}) {
  const { orderCode, cancel } = await searchParams;
  const locale = await getLocale();
  const t = await getTranslations("checkout");

  if (!orderCode) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: `/dang-nhap?next=/thanh-toan/ket-qua?orderCode=${orderCode}`, locale });
    return;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("order_code, payment_status")
    .eq("order_code", orderCode)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  if (order.payment_status === "paid") {
    redirect({ href: "/tai-khoan/don-hang", locale });
    return;
  }

  const isCancelled = order.payment_status === "cancelled" || cancel === "true";

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col items-center px-6 py-32 text-center sm:px-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink/40">
        {isCancelled ? t("resultCancelledEyebrow") : t("resultPendingEyebrow")}
      </p>
      <h1 className="font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
        {isCancelled ? t("resultCancelledHeading") : t("resultPendingHeading")}
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink/60">
        {isCancelled
          ? t("resultCancelledBody")
          : t.rich("resultPendingBody", {
              orderCode: order.order_code,
              code: (chunks) => <span className="font-semibold text-ink">{chunks}</span>,
            })}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        {!isCancelled && (
          <Link
            href={`/thanh-toan/ket-qua?orderCode=${order.order_code}`}
            className="inline-flex h-13 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
          >
            {t("refresh")}
          </Link>
        )}
        <Link
          href={`/tai-khoan/don-hang/${order.order_code}`}
          className="inline-flex h-13 items-center border border-ink/20 px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
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
