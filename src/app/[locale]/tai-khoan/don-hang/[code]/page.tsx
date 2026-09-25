import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export const metadata = { title: "Chi tiết đơn hàng — VERITY GEAR" };

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("vi-VN");
}

export default async function OrderDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    redirect({ href: `/dang-nhap?next=/tai-khoan/don-hang/${code}`, locale });
    return;
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_code", code)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  const items: { product_slug: string; product_name: string; product_image: string | null; price: number; qty: number }[] =
    order.order_items ?? [];

  return (
    <section className="mx-auto max-w-3xl px-6 py-32">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink">
        <Link href="/tai-khoan" className="transition-colors hover:text-ink">
          Tài khoản
        </Link>
        <span>/</span>
        <Link href="/tai-khoan/don-hang" className="transition-colors hover:text-ink">
          Đơn hàng của tôi
        </Link>
        <span>/</span>
        <span className="text-ink">{order.order_code}</span>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-ink">Đơn hàng</p>
          <h1 className="font-display text-3xl font-bold uppercase leading-tight sm:text-4xl">{order.order_code}</h1>
          <p className="mt-2 text-sm text-ink">Đặt ngày {formatDate(order.created_at)}</p>
        </div>
        <span className="rounded-full border border-ink/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em]">
          {ORDER_STATUS_LABELS[order.status as OrderStatus]}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em]">Thông tin giao hàng</h2>
          <div className="space-y-1 text-sm text-ink">
            <p className="font-medium text-ink">{order.full_name}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
            <p>
              {order.address}, {order.city}
            </p>
            {order.note && <p className="mt-2 text-ink">Ghi chú: {order.note}</p>}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em]">Phương thức thanh toán</h2>
          <p className="text-sm text-ink">
            {order.payment_method === "cod" ? "Thanh toán khi nhận hàng (COD)" : "Chuyển khoản ngân hàng"}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em]">
          Sản phẩm ({items.length})
        </h2>
        <div className="flex flex-col gap-4 border border-ink/10 p-5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ink/5">
                {item.product_image && (
                  <Image src={item.product_image} alt={item.product_name} fill sizes="60px" className="object-cover" />
                )}
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-paper">
                  {item.qty}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold uppercase tracking-wide">{item.product_name}</p>
              </div>
              <span className="text-sm font-semibold">{formatVnd(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 pt-6 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink">Tạm tính</span>
            <span className="font-semibold">{formatVnd(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink">Vận chuyển</span>
            <span className="font-semibold">{order.shipping_fee === 0 ? "Miễn phí" : formatVnd(order.shipping_fee)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-6 text-base">
          <span className="font-semibold">Tổng cộng</span>
          <span className="font-display text-xl font-bold">{formatVnd(order.total)}</span>
        </div>
      </div>
    </section>
  );
}
