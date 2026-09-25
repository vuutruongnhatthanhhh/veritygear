import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export const metadata = { title: "Đơn hàng của tôi — VERITY GEAR" };

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default async function OrderHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    redirect({ href: "/dang-nhap?next=/tai-khoan/don-hang", locale });
    return;
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("order_code, status, total, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-3xl px-6 py-32">
      <div className="mb-8 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink/40">
        <Link href="/tai-khoan" className="transition-colors hover:text-ink">
          Tài khoản
        </Link>
        <span>/</span>
        <span className="text-ink/70">Đơn hàng của tôi</span>
      </div>

      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">
        Tài khoản
      </p>
      <h1 className="mb-10 text-center font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">
        Đơn hàng của tôi
      </h1>

      {orders && orders.length > 0 ? (
        <div className="divide-y divide-ink/10 border border-ink/10">
          {orders.map((o) => (
            <Link
              key={o.order_code}
              href={`/tai-khoan/don-hang/${o.order_code}`}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-ink/[0.03]"
            >
              <div>
                <p className="text-sm font-semibold">{o.order_code}</p>
                <p className="mt-1 text-xs text-ink/50">{formatDate(o.created_at)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">{formatVnd(o.total)}</span>
                <span className="rounded-full border border-ink/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]">
                  {ORDER_STATUS_LABELS[o.status as OrderStatus]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-ink/10 px-6 py-16 text-center">
          <p className="text-sm text-ink/60">Bạn chưa có đơn hàng nào.</p>
          <Link
            href="/san-pham"
            className="mt-6 inline-flex h-12 items-center bg-ink px-8 text-[13px] font-semibold uppercase tracking-[0.14em] text-paper transition-transform hover:scale-[1.02]"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      )}
    </section>
  );
}
